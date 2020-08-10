let page_now;
$(document).ready(() => {
    getStoresAndProducts();
    //get_data();
})
function getStoresAndProducts() {
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_tranfer_stocks/getStoresAndProducts',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                let html_products = ""
                let html_stores = ""
                data.data.products.forEach(item => {
                    html_products += `<option value="${item.name}:${item.number_code}:${item.stocks_in_storage.quantity}:${item._id}">${item.name} - Số lượng ${item.stocks_in_storage.quantity}</option>`
                })
                data.data.stores.forEach(item => {
                    html_stores += `<option value="${item._id}">${item.name}</option>`
                })
                $('#select_product').html(html_products)
                $('#select_store').html(html_stores)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function add_product() {
    let value = $('#select_product').val()
    value = value.split(':')
    let check = $(`#quantity-${value[1]}`).val()
	if(value[2] == 0){
		return;
	}
    if (!check) {
        let html = `<tr>
                    <td><span class="number-code">${value[1]}</span></td>
                    <td><span id="name-product-${value[1]}">${value[0]}</span><input type="hidden" id="id-product-${value[1]}" value="${value[3]}"></td>
                    <td><span id="current-products-${value[1]}" >${value[2]}</span></td>
                    <td><input class="form-control form-control-sm product-send" min="0" max="${value[2]}"type="number" onchange="change_quantity('${value[1]}')" id="quantity-${value[1]}" value="1"></td>
                    <td><span class="remaining-products" id="remaining-products-${value[1]}" >${value[2] - 1}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#add_product').append(html)
        total_get_goods()
    } else {
        let current_product = $(`#current-products-${value[1]}`).text()
        let send_number = $(`#quantity-${value[1]}`).val()
        if ((Number(current_product) - Number(send_number)) > 0) {
            let quantity = $(`#quantity-${value[1]}`).val()
            $(`#quantity-${value[1]}`).val(Number(quantity) + 1)
            change_quantity(value[1])
        }
    }
}

function change_quantity(code) {
    let current_product = $(`#current-products-${code}`).text()
    let send_number = $(`#quantity-${code}`).val()
    $(`#remaining-products-${code}`).text(Number(current_product) - Number(send_number))
    total_get_goods()
}

function delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    total_get_goods();
}

function total_get_goods() {
    let product = 0;
    $(".product-send").each(function () {
        product += Number($(this).val());
    });
    $('#total_products').text(new Intl.NumberFormat().format(product))
}

function get_list_product(){
    let list_product = [];
    $(".number-code").each(function () {                  
        list_product.push($(this).text()); 
    });
    let data = [];
    list_product.forEach((number_code)=>{
        data.push({
            quantity: $(`#quantity-${number_code}`).val(),
            product_id: $(`#id-product-${number_code}`).val()
        })
    })
    return data;
}
function clear_data(){
    $('#add_product').empty();
    $('#total_products').text(0)
}
function create_new(){
	let error = 0;
	$(".remaining-products").each(function () {
        if(Number($(this).text()) < 0) error++;
    });
	if(error > 0){
		Swal.fire({
           title: "Lỗi nhập sai số lượng",
           text: "Số lượng vận chuyển không thể lớn hơn số lượng tồn kho",
           icon: "error",
           showConfirmButton: false,    
           timer: 3000
        }).then((result)=>{
                        // cho vào để ko báo lỗi uncaught
        })
        .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
        });
		return;
	}
    let data = {
        products: get_list_product(),
		total_products : $('#total_products').text(),
		store: $('#select_store').val(),
        _csrf: $('#_csrf').val()
    }
    if(data.products.length >= 1){
        $.ajax({
            url:'/admin_store_stocks/create',
            method:'POST',
            data: data,
            success: function(data){
                if(data.status == 1){
                    Swal.fire({
                        title: "Thao tác thành công",
                        text: data.message,
                        icon: "info",
                        showConfirmButton: false,
                        timer: 3000
                    }).then((result)=>{
                        get_product()
                        get_data()
                        clear_data()
                    })
                    .catch(timer => {
                        get_product()
                        get_data()
                        clear_data()
                    });    
                }else{
                    Swal.fire({
                        title: data.error,
                        text: data.message,
                        icon: "error",
                        showConfirmButton: false,    
                        timer: 3000
                    }).then((result)=>{
                        // cho vào để ko báo lỗi uncaught
                    })
                    .catch(timer => {
                        // cho vào để ko báo lỗi uncaught
                    }); 
                    
                }
            }
        })
    }else{
        Swal.fire({
            title: 'Lỗi thiếu thông tin hàng nhập',
            text: 'Vui lòng nhập hàng hóa vào',
            icon: "error",
            showConfirmButton: false,    
            timer: 3000
        }).then((result)=>{
            // cho vào để ko báo lỗi uncaught
        })
        .catch(timer => {
            // cho vào để ko báo lỗi uncaught
        }); 
    }
    
}