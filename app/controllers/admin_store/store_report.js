const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Invoice_sell = require('../../models/invoice_sell');
const Log_services = require('../../models/log_service');
const Customer = require('../../models/customer');
const mongoose = require('mongoose');
class Admin_store_report extends Controller {
    static async show(req, res) {
        Admin_store_report.setLocalValue(req, res);

        res.render('./pages/admin_store/store_report');
    }
    static async get_data(req, res) {
        try {
            let now = new Date();
            let start_month = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
            let end_month = new Date(now.getFullYear(), Number(now.getMonth()) + 1, 1, 0, 0, 0);
            let start_month_ago = new Date(now.getFullYear(), now.getMonth() -1, 1, 0, 0, 0);
            let end_month_ago = new Date(now.getFullYear(), Number(now.getMonth()), 1, 0, 0, 0);
            let gettotalAmount = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month, $lt: end_month } } },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$payment" },
                        totalsell: {$sum: 1}
                    }
                }
            ])
            let gettotalCostPrice = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month, $lt: end_month } } },
                { $unwind: "$list_item" },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$list_item.cost_price" },
                    }
                }
            ])
            let gettotalAmountLastMonth = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month_ago, $lt: end_month_ago } } },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$payment" },
                    }
                }
            ])
            let gettotalCostPriceLastMonth = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month_ago, $lt: end_month_ago } } },
                { $unwind: "$list_item" },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$list_item.cost_price" },
                    }
                }
            ])
            let newCustomers = await Customer.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, createdAt: { $gte: start_month, $lt: end_month } } },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$payment" },
                        customers: { $sum: 1 }
                    }
                }
            ]);
            let oldCustomers = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month, $lt: end_month } } },
                {
                    $group: {
                        _id: "$customer",
                    }
                }
            ])
            let newCustomersLastMonth = await Customer.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, createdAt: { $gte: start_month_ago, $lt: end_month_ago } } },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$payment" },
                        customers: { $sum: 1 }
                    }
                }
            ]);
            let oldCustomersLastMonth = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month_ago, $lt: end_month_ago } } },
                {
                    $group: {
                        _id: "$customer",
                    }
                }
            ])
            let topSell = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month, $lt: end_month } } },
                { $unwind: "$list_item" },
                {
                    $group: {
                        _id: "$list_item.id",
                        total: { $sum: 1 },
                    }
                },
                {$sort: {total: -1}},
                {$limit: 5},
                {$lookup: {from: 'product_services', localField: '_id', foreignField:'_id', as: 'product_service'}}

            ])
            let servicesMonth = await Log_services.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, type:'service', store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month, $lt: end_month } } },
                {
                    $group: {
                        _id: "$service",
                        total: { $sum: 1 },
                    }
                },
                {$sort: {total: -1}},
                {$lookup: {from: 'product_services', localField: '_id', foreignField:'_id', as: 'product_service'}}

            ])
            let servicesLastMonth = await Log_services.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, type:'service', store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month_ago, $lt: end_month_ago } } },
                {
                    $group: {
                        _id: "$service",
                        total: { $sum: 1 },
                    }
                },
                {$sort: {total: -1}},
                {$lookup: {from: 'product_services', localField: '_id', foreignField:'_id', as: 'product_service'}}

            ])
            let totalSell = gettotalAmount.length > 0 ? gettotalAmount[0].totalsell : 0;
            gettotalAmount = gettotalAmount.length > 0 ? gettotalAmount[0].money : 0;
            gettotalCostPrice = gettotalCostPrice.length > 0 ? gettotalCostPrice[0].money : 0;
            gettotalAmountLastMonth = gettotalAmountLastMonth.length > 0 ? gettotalAmountLastMonth[0].money : 0;
            gettotalCostPriceLastMonth = gettotalCostPriceLastMonth.length > 0 ? gettotalCostPriceLastMonth[0].money : 0;
            Admin_store_report.sendData(res, { gettotalAmount, gettotalCostPrice, gettotalAmountLastMonth, gettotalCostPriceLastMonth, newCustomers, newCustomersLastMonth, oldCustomers, oldCustomersLastMonth, topSell, totalSell, servicesMonth, servicesLastMonth});
        } catch (err) {
            console.log(err.message)
            Admin_store_report.sendError(res, err, err.message);
        }
    }
}

module.exports = Admin_store_report

