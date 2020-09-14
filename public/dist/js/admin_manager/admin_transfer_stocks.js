let page_now;
$(document).ready(() => {
    getStoresAndProducts();
    get_data();
})
function get_data(paging_num){
    if(!paging_num){
        paging_num = page_now
    }
    let data = {
        paging_num:paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_transfer_stocks/get_data',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                page_now = data.data.currentPage
                render_data(data.data.data, data.data.pageCount, data.data.currentPage);
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
}

function render_data(data, pageCount, currentPage){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Ngày</th>
									<th>Mã phiếu</th>
									<th>Người tạo</th>
                                    <th>Sản phẩm</th>
									<th style="text-align: center;">Tồn kho</th>
                                    <th>Cửa hàng</th>
									<th>Ghi chú</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${new Date(item.createdAt).toLocaleString()}</td>
				<td>${item.serial}</td>
				<td>${item.who_created}</td>
                <td>`
        item.list_products.forEach(item=>{
            html +=`[-${item.quantity} ${item.product.name}] [${item.product.number_code}]<br>`
        })
		html+= `</td><td style="text-align: center;">`
		item.list_products.forEach(item=>{
            html +=`${item.current_quantity}<br>`
        })		
        html+= `</td>
				<td>${item.store.name}</td>
				<td>${item.note || ""}</td>
                </tr>
			   `
    })
    html+=`</tbody>
                </table>
            `;
    $('#show_data').html(html);
    let pageination = ''

    if (pageCount > 1) {
        let i = Number(currentPage) > 5 ? (Number(currentPage) - 4) : 1
        pageination += `<ul class="pagination pagination-sm m-0 float-right">`
        if (currentPage == 1){
            pageination += `<li class="page-item disabled"><a class="page-link" href="#"><<</a></li>`  
        }else{
            pageination += `<li class="page-item"><a class="page-link" onclick="get_data('1')"><<</a></li>`  
        }
        if (i != 1) {
            pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
        }
        for (; i<= (Number(currentPage) + 4) && i <= pageCount; i++) {
    
            if (currentPage == i) {
                pageination += `<li class="page-item active"><a class="page-link">${i}</a></li>`
            } else {
                    pageination += `<li class="page-item"><a class="page-link" onclick="get_data('${i}')">${i}</a></li>`
            }
            if (i == Number(currentPage) + 4 && i < pageCount) {
                pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
                break
            }
        }
        if (currentPage == pageCount){
            pageination += `<li class="page-item disabled"><a class="page-link"">>></a></li>`
        }else{
            pageination += `<li class="page-item"><a class="page-link" onclick="get_data('${i-1}')">>></a></li>`
        }
            
        pageination += `</ul>`
    }   
    $("#pagination").html(pageination)
}
function getStoresAndProducts() {
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_transfer_stocks/getStoresAndProducts',
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
                    <td><input class="form-control form-control-sm product-send" min="0" max="${value[2]}"type="number" onchange="change_quantity('${value[1]}', this)" id="quantity-${value[1]}" value="1"></td>
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

function change_quantity(code,btn) {
    let send_number = $(`#quantity-${code}`).val()
    let current_product = $(`#current-products-${code}`).text()
	if(send_number == 0){
		delete_row_product(btn)
	}else{
        if(Number(current_product) - Number(send_number) < 0){
            $(`#quantity-${code}`).val(current_product)
            $(`#remaining-products-${code}`).text(0)
        }else{
            $(`#remaining-products-${code}`).text(Number(current_product) - Number(send_number))
        }	
    }
    
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
            product: $(`#id-product-${number_code}`).val()
        })
    })
    return data;
}
function clear_data(){
    $('#add_product').empty();
	$('#note').val("");
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
		note: $('#note').val(),
        products: get_list_product(),
		store: $('#select_store').val(),
        _csrf: $('#_csrf').val()
    }
    if(data.products.length >= 1){
        $.ajax({
            url:'/admin_transfer_stocks/create',
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
                        getStoresAndProducts()
                        get_data()
                        clear_data()
                    })
                    .catch(timer => {
                        getStoresAndProducts()
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