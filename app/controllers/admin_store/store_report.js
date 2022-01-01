const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Invoice_sell = require('../../models/invoice_sell');
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
            let end_month = new Date(now.getFullYear(), Number(now.getMonth()) + 1, 0, 0, 0, 0);
            let start_month_ago = new Date(now.getFullYear(), now.getMonth() -1, 1, 0, 0, 0);
            let end_month_ago = new Date(now.getFullYear(), Number(now.getMonth()), 0, 0, 0, 0);
            let gettotalAmount = await Invoice_sell.aggregate([
                { $match: { company: mongoose.Types.ObjectId(req.session.user.company._id), isActive: true, store: mongoose.Types.ObjectId(req.session.store_id), createdAt: { $gte: start_month, $lt: end_month } } },
                {
                    $group: {
                        _id: null,
                        money: { $sum: "$payment" },
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
            gettotalAmount = gettotalAmount.length > 0 ? gettotalAmount[0].money : 0;
            gettotalCostPrice = gettotalCostPrice.length > 0 ? gettotalCostPrice[0].money : 0;
            gettotalAmountLastMonth = gettotalAmountLastMonth.length > 0 ? gettotalAmountLastMonth[0].money : 0;
            gettotalCostPriceLastMonth = gettotalCostPriceLastMonth.length > 0 ? gettotalCostPriceLastMonth[0].money : 0;
            Admin_store_report.sendData(res, { gettotalAmount, gettotalCostPrice, gettotalAmountLastMonth, gettotalCostPriceLastMonth });
        } catch (err) {
            console.log(err.message)
            Admin_store_report.sendError(res, err, err.message);
        }
    }
}

module.exports = Admin_store_report

