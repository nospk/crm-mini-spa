
$(document).ready(() => {
    get_data('1');
    get_brand_group();
    $('#product_classification').on('show.bs.modal', function (e) {
        get_product_of_undefined()
    })
    $('#check_store_stocks').on('show.bs.modal', function (e) {
        get_product()
    })
})
let page_now;
function get_data(paging_num) {
    if(!paging_num){
        paging_num = page_now
    }
    let data = {
        search_word:$('#search_word').val().trim(),
        search_group:$('#search_group').val(),
        search_brand:$('#search_brand').val(),
        paging_num: paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_store_stocks/get_data',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                page_now = data.data.currentPage
                render_data(data.data.data, data.data.pageCount, data.data.currentPage);
            } else {
                Swal.fire({
                    title: data.error,
                    text: data.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result) => {
                    // cho vào để ko báo lỗi uncaught
                })
                    .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
                    });

            }
        }
    })
}
function render_data(data, pageCount, currentPage) {
    let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Tên</th>
									<th>Mã số</th>
                                    <th>Trạng thái</th>
									<th>Tổng Tồn kho</th>
									<th>Hàng chưa phân loại</th>
									<th>Hàng bán</th>
									<th>Hàng dịch vụ</th>
                                    <th>Hành Động</th>
                                    </tr>
		                        </thead>	
		                        <tbody>`;
    data.forEach(item => {
        html += `<tr onclick="show_history_stocks('${item.stocks_in_store[0]._id}')" class="pointer">
                <td>${item.name}</td>
                <td>${item.number_code}</td>
				<td>${item.isSell ? "Đang kinh doanh" : "Ngừng kinh doanh"}</td>
				<td>${item.stocks_in_store[0].quantity}</td>
				<td>${item.stocks_in_store[0].product_of_undefined}</td>
				<td>${item.stocks_in_store[0].product_of_sell}</td>
				<td>${item.stocks_in_store[0].product_of_service}</td>
                <td></td>
                </tr>`
    })
    html += `</tbody>
                </table>
            `;
    $('#show_data').html(html);
    let pageination = ''

    if (pageCount > 1) {
        let i = Number(currentPage) > 5 ? (Number(currentPage) - 4) : 1
        pageination += `<ul class="pagination pagination-sm m-0 float-right">`
        if (currentPage == 1) {
            pageination += `<li class="page-item disabled"><a class="page-link" href="#"><<</a></li>`
        } else {
            pageination += `<li class="page-item pointer"><a class="page-link" onclick="get_data('1')"><<</a></li>`
        }
        if (i != 1) {
            pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
        }
        for (; i <= (Number(currentPage) + 4) && i <= pageCount; i++) {

            if (currentPage == i) {
                pageination += `<li class="page-item active pointer"><a class="page-link">${i}</a></li>`
            } else {
                pageination += `<li class="page-item pointer"><a class="page-link" onclick="get_data('${i}')">${i}</a></li>`
            }
            if (i == Number(currentPage) + 4 && i < pageCount) {
                pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
                break
            }
        }
        if (currentPage == pageCount) {
            pageination += `<li class="page-item disabled"><a class="page-link"">>></a></li>`
        } else {
            pageination += `<li class="page-item pointer"><a class="page-link" onclick="get_data('${i - 1}')">>></a></li>`
        }

        pageination += `</ul>`
    }
    $("#pagination").html(pageination)
}
function convertTypetoString(str) {
    switch (str) {
        case 'sell':
            return "Bán";
            break;
        case 'exchange':
            return "Đổi Hàng";
            break;
        case 'import':
            return "Nhập Hàng";
            break;
        case 'return':
            return "Trả Hàng";
            break;
        case 'lost':
            return "Mất Hàng";
            break;
        default:
        // code block
    }
}
function show_history_stocks(id) {
    $.ajax({
        url: `/admin_store_stocks/products/${id}`,
        method: 'POST',
        data: { _csrf: $('#_csrf').val() },
        success: function (data) {
            if (data.status == 1) {
                let html_history = `<table class="table table-sm  table-hover text-nowrap">
										<thead>
											<tr>
											<th>Ngày</th>
											<th>Mã phiếu</th>
											<th>Loại</th>
											<th>Số lượng</th>
											<th>Tồn</th>
											</tr>
										</thead>
										<tbody>`;
                data.data.last_history.forEach((item, index_array) => {
                    if(index_array == 0 ){
                        html_history += `<tr>
								<td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
								<td>${item.serial}</td>
								<td>${convertTypetoString(item.type)}</td>`
                        let number = []
                        item.list_products.forEach((element,index) => {
                            if(element.product == data.data.product) number.push(index)
                        })
                        if(number.length > 1){
                            html_history += `
                                            <td>${item.list_products[number[0]].quantity}<br>
                                            ${item.list_products[number[1]].quantity}</td>
                                            <td>${item.list_products[number[0]].current_quantity}<br>
                                            ${item.list_products[number[1]].current_quantity}</td></tr>
                                        `
                        }else{
                            html_history += `
                                            <td>${item.list_products[number[0]].quantity}</td>
                                            <td>${item.list_products[number[0]].current_quantity}</td></tr>
                                        `
                        }
                    }else if(index_array < data.data.last_history.length -1 && item._id != data.data.last_history[index_array-1]._id  ){
                        html_history += `<tr>
                                <td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                                <td>${item.serial}</td>
                                <td>${convertTypetoString(item.type)}</td>`
                        let number = []
                        item.list_products.forEach((element,index) => {
                            if(element.product == data.data.product) number.push(index)
                        })
                        if(number.length > 1){
                            html_history += `
                                            <td>${item.list_products[number[0]].quantity}<br>
                                            ${item.list_products[number[1]].quantity}</td>
                                            <td>${item.list_products[number[0]].current_quantity}<br>
                                            ${item.list_products[number[1]].current_quantity}</td></tr>
                                        `
                        }else{
                            html_history += `
                                            <td>${item.list_products[number[0]].quantity}</td>
                                            <td>${item.list_products[number[0]].current_quantity}</td></tr>
                                        `
                        }
                    }else if(index_array == data.data.last_history.length-1 && item._id != data.data.last_history[index_array-1]._id){
                        html_history += `<tr>
                                <td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                                <td>${item.serial}</td>
                                <td>${convertTypetoString(item.type)}</td>`
                        let number = []
                        item.list_products.forEach((element,index) => {
                            if(element.product == data.data.product) number.push(index)
                        })
                        if(number.length > 1){
                            html_history += `
                                            <td>${item.list_products[number[0]].quantity}<br>
                                            ${item.list_products[number[1]].quantity}</td>
                                            <td>${item.list_products[number[0]].current_quantity}<br>
                                            ${item.list_products[number[1]].current_quantity}</td></tr>
                                        `
                        }else{
                            html_history += `
                                            <td>${item.list_products[number[0]].quantity}</td>
                                            <td>${item.list_products[number[0]].current_quantity}</td></tr>
                                        `
                        }
                    } 
                })
                html_history += `</tbody>
								</table>
							`;
                $('#show_history').html(html_history);
                $('#show_history_stocks').modal('show');
            } else {
                Swal.fire({
                    title: data.error,
                    text: data.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result) => {
                    // cho vào để ko báo lỗi uncaught
                })
                    .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
                    });

            }
        }
    })
}
function update_store() {
    let data = {
        name: $('#name').val(),
        address: $('#address').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_store_stocks/update_store',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                Swal.fire({
                    title: "Thao tác thành công",
                    text: data.message,
                    icon: "info",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result) => {
                    location.reload();
                })
                    .catch(timer => {
                        location.reload();
                    });
            } else {
                Swal.fire({
                    title: data.error,
                    text: data.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result) => {
                    // cho vào để ko báo lỗi uncaught
                })
                    .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
                    });

            }
        }
    })
}
function get_product_of_undefined() {
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_store_stocks/get_product_of_undefined',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                render_data_classification(data.data)
            } else {
                Swal.fire({
                    title: data.error,
                    text: data.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result) => {
                    // cho vào để ko báo lỗi uncaught
                })
                    .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
                    });

            }
        }
    })
}
function get_product() {
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_store_stocks/get_product',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                render_check_stocks(data.data)
            } else {
                Swal.fire({
                    title: data.error,
                    text: data.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result) => {
                    // cho vào để ko báo lỗi uncaught
                })
                    .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
                    });

            }
        }
    })
}

function render_check_stocks(data) {
    let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead class="thead-dark">
                                    <tr>
                                    <th>Tên</th>
									<th>Mã số</th>
									<th>Hàng bán</th>
									<th>Hàng dịch vụ</th>
									<th>Hàng bị thiếu</th>
                                    </tr>
		                        </thead>	
		                        <tbody>`;
    data.forEach(item => {
        html += `<tr>
                <td>${item.product.name}</td>
                <td><span class="number-code">${item.product.number_code}</span></td>
				<td><input type="number" class="form-control form-control-sm" min="0" max="${item.product_of_sell}" value="${item.product_of_sell}" onchange="check_lost_stocks('${item.product.number_code}')" id="check_quantity_sell_${item.product.number_code}"></td>
				<td><input type="number" class="form-control form-control-sm" min="0" max="${item.product_of_service}" value="${item.product_of_service}"  onchange="check_lost_stocks('${item.product.number_code}')" id="check_quantity_service_${item.product.number_code}"></td>
				<td><input style="border-style:none;width: 100px;" disabled id="stock_lost_${item.product.number_code}" value="0"></td>
				<input type="hidden" id="check_quantity_${item.product.number_code}"value="${item.quantity}" >
				<input type="hidden" id="check_id_${item.product.number_code}"value="${item.product._id}" >
                </tr>`
    })
    html += `</tbody>
                </table>
            `;
    $('#show_check_stocks').html(html);
}
function render_data_classification(data) {
    let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead class="thead-dark">
                                    <tr>
                                    <th>Tên</th>
									<th>Mã số</th>
									<th>Hàng chưa phân loại</th>
									<th>Hàng bán</th>
									<th>Hàng dịch vụ</th>
                                    </tr>
		                        </thead>	
		                        <tbody>`;
    data.forEach(item => {
        html += `<tr>
                <td>${item.product.name}</td>
                <td><span class="number-code">${item.product.number_code}</span></td>
				<td><input style="border-style:none;width: 100px;" disabled id="quantity_${item.product.number_code}" value="${item.product_of_undefined}"></td>
				<td><input type="number" class="form-control form-control-sm" min="0" value="0" onchange="change_product_sell('${item.product.number_code}')" id="quantity_sell_${item.product.number_code}"></td>
				<td><input type="number" class="form-control form-control-sm" min="0" value="0" onchange="change_product_service('${item.product.number_code}')" id="quantity_service_${item.product.number_code}"></td>
				<input type="hidden" id="default_quantity_${item.product.number_code}"value="${item.product_of_undefined}" >
				<input type="hidden" id="id_${item.product.number_code}"value="${item._id}" >
                </tr>`
    })
    html += `</tbody>
                </table>
            `;
    $('#show_product_classification').html(html);
}

function check_lost_stocks(number_code) {
    let max_product_sell = Number($(`#check_quantity_sell_${number_code}`).attr('max'));
    let max_product_service = Number($(`#check_quantity_service_${number_code}`).attr('max'));
    let product_sell = Number($(`#check_quantity_sell_${number_code}`).val());
    let product_service = Number($(`#check_quantity_service_${number_code}`).val());
    let lost_stocks = (max_product_sell - product_sell) + (max_product_service - product_service);
    $(`#stock_lost_${number_code}`).val(lost_stocks);
}
function change_product_sell(number_code) {
    let quantity = $(`#default_quantity_${number_code}`).val()
    let change_number = $(`#quantity_sell_${number_code}`).val()
    let quantity_service = $(`#quantity_service_${number_code}`).val()
    if (quantity - change_number - quantity_service >= 0) {
        $(`#quantity_${number_code}`).val(quantity - change_number - quantity_service)
    } else {
        $(`#quantity_sell_${number_code}`).val(quantity - quantity_service)
        $(`#quantity_${number_code}`).val(0)
    }

}
function change_product_service(number_code) {
    let quantity = $(`#default_quantity_${number_code}`).val()
    let change_number = $(`#quantity_service_${number_code}`).val()
    let quantity_sell = $(`#quantity_sell_${number_code}`).val()
    if (quantity - change_number - quantity_sell >= 0) {
        $(`#quantity_${number_code}`).val(quantity - change_number - quantity_sell)
    } else {
        $(`#quantity_service_${number_code}`).val(quantity - quantity_sell)
        $(`#quantity_${number_code}`).val(0)
    }

}

function get_list_lost_stocks() {
    let list_product = [];
    $("#show_check_stocks .number-code").each(function () {
        list_product.push($(this).text());
    });
    let data = [];
    list_product.forEach((number_code) => {
        if ($(`#stock_lost_${number_code}`).val() > 0) {
            data.push({
                product_of_sell: Number($(`#check_quantity_sell_${number_code}`).val()),
                product_of_service: Number($(`#check_quantity_service_${number_code}`).val()),
                lost_stocks: Number($(`#stock_lost_${number_code}`).val()),
                current_quantity: Number($(`#check_quantity_${number_code}`).val()) - Number($(`#stock_lost_${number_code}`).val()),
                id: $(`#check_id_${number_code}`).val()
            })
        }
    })
    return data;
}
function get_list_product() {
    let list_product = [];
    $("#show_product_classification .number-code").each(function () {
        list_product.push($(this).text());
    });
    let data = [];
    list_product.forEach((number_code) => {
        if ($(`#quantity_sell_${number_code}`).val() > 0 || $(`#quantity_service_${number_code}`).val() > 0) {
            data.push({
                product_of_sell: Number($(`#quantity_sell_${number_code}`).val()),
                product_of_service: Number($(`#quantity_service_${number_code}`).val()),
                id: $(`#id_${number_code}`).val()
            })
        }
    })
    return data;
}


function send_check_stocks() {
    Swal.fire({
        title: 'Bạn xác nhận kiểm kho hàng ?',
        text: "Mọi thông tin đã thực hiện không thể thay đổi ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Không',
        confirmButtonText: 'Xác nhận'
    }).then((result) => {
        if (result.value == true) {
            $.ajax({
                url: '/admin_store_stocks/check_stocks',
                method: 'POST',
                data: {
                    products: get_list_lost_stocks(),
                    _csrf: $('#_csrf').val()
                },
                success: function (data) {
                    Swal.fire({
                        title: "Thao tác thành công",
                        text: data.message,
                        icon: "info",
                        showConfirmButton: false,
                        timer: 3000
                    }).then((result) => {
                        get_data()
                    })
                        .catch(timer => {
                            get_data()
                        });
                }
            })
        }
    });
}
function set_stocks_classify() {
    let data = {
        products: get_list_product(),
        _csrf: $('#_csrf').val()
    }
    if (data.products.length >= 1) {
        $.ajax({
            url: '/admin_store_stocks/update_stocks',
            url: '/admin_store_stocks/set_stocks_classify',
            method: 'PUT',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.status == 1) {
                    Swal.fire({
                        title: "Thao tác thành công",
                        text: data.message,
                        icon: "info",
                        showConfirmButton: false,
                        timer: 3000
                    }).then((result) => {
                        get_product()
                        get_data()
                    })
                        .catch(timer => {
                            get_product()
                            get_data()
                        });
                } else {
                    Swal.fire({
                        title: data.error,
                        text: data.message,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 3000
                    }).then((result) => {
                        // cho vào để ko báo lỗi uncaught
                    })
                        .catch(timer => {
                            // cho vào để ko báo lỗi uncaught
                        });

                }
            }
        })
    } else {
        Swal.fire({
            title: 'Không có hàng chưa phân loại',
            text: 'Vui lòng phân loại hàng vào lần sau',
            icon: "error",
            showConfirmButton: false,
            timer: 3000
        }).then((result) => {
            // cho vào để ko báo lỗi uncaught
        })
            .catch(timer => {
                // cho vào để ko báo lỗi uncaught
            });
    }
}
function get_brand_group(){
    $.ajax({
        url:'/admin_brand_group/get_data',
        method:'POST',
        data: {
            _csrf: $('#_csrf').val()
        },
        success: function(data){
            if (data.status == 1) {
				let html_brand = "<option></option>"
				let html_group = "<option></option>"
                data.data.forEach(item => {
                    if(item.type=="brand"){
                        html_brand += `<option value="${item._id}">${item.name}</option>`
                    }else{
                        html_group += `<option value="${item._id}">${item.name}</option>`
                    }
                })

                $('#search_brand').html(html_brand)	


                $('#search_group').html(html_group)

				$('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}