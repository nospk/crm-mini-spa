let money_total = 0;
let page_now;
$( document ).ready(()=>{
    get_product();
    get_data();
    const currencyInput = document.querySelector('input[type="currency"]')
    currencyInput.addEventListener('focus', onFocus)
    currencyInput.addEventListener('blur', onBlur)
})

function get_product(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_storage_stocks/get_product',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                let html_products = ""   
				let html_suppliers = "" 
                data.data.products.forEach(item =>{
                    html_products +=`<option value="${item.name}:${item.number_code}:${item.cost_price}:${item._id}">${item.name}</option>`
                })
				data.data.suppliers.forEach(item =>{
                    html_suppliers +=`<option value="${item._id}">${item.name}</option>`
                })
                $('#select_product').html(html_products)
				$('#select_supplier').html(html_suppliers)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function get_data(paging_num){
    if(!paging_num){
        paging_num = page_now
    }
    let data = {
        paging_num:paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_storage_stocks/get_data',
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
                                    <th>Công ty</th>
									<th style="text-align: right;">Giá</th>
                                    <th style="text-align: right;">Thanh toán</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
				<td>${item.serial}</td>
				<td>${item.who_created}</td>
                <td>`
        item.list_products.forEach(item=>{
            html +=`[+${item.quantity} ${item.product.name}] [${item.product.number_code}] - [${convert_vnd(item.cost_price)} ]<br>`
        })
		html+= `</td><td style="text-align: center;">`
		item.list_products.forEach(item=>{
            html +=`${item.current_quantity}<br>`
        })		
        html+= `</td>
				<td>${(item.supplier.name)}</td>
                <td style="text-align: right;">${convert_vnd(item.price)}</td>
                <td style="text-align: right;">${convert_vnd(item.payment? item.payment.money: 0)} </td>
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
function add_product(){
    let value = $('#select_product').val()
    value = value.split(':')
    let check = $(`#quantity-${value[1]}`).val()
    if(!check){
        let html = `<tr>
                    <td><span class="number-code">${value[1]}</span></td>
                    <td><span id="name-product-${value[1]}">${value[0]}</span><input type="hidden" id="id-product-${value[1]}" value="${value[3]}"></td>
                    <td><input class="form-control form-control-sm" id="cost-price-${value[1]}" onchange="change_cost_price('${value[1]}')" type="currency" step="1000" value="${convert_vnd(Number(value[2]))}"></td>
                    <td><input class="form-control form-control-sm" min="0" type="number" onchange="change_quantity('${value[1]}', this)" id="quantity-${value[1]}" value="1"></td>
                    <td><span class="total" id="total-${value[1]}" >${convert_vnd(Number(value[2]))}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#add_product').append(html)
        let input = document.getElementById(`cost-price-${value[1]}`)
        input.addEventListener('focus', onFocus)
        input.addEventListener('blur', onBlur)
        total_get_goods();
    }else{
        let quantity = $(`#quantity-${value[1]}`).val()
        $(`#quantity-${value[1]}`).val(Number(quantity)+1)
        change_quantity(value[1])
    }

}

function delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    total_get_goods();
}

function change_cost_price(code){
	let value = convert_number($(`#cost-price-${code}`).val())
	let number = $(`#quantity-${code}`).val()
    $(`#total-${code}`).text(convert_vnd(value*number))
    total_get_goods();
}

function change_quantity(code, btn){
	let number = $(`#quantity-${code}`).val()
	if(number == 0){
		delete_row_product(btn)
	}else{
		let value = convert_number($(`#cost-price-${code}`).val())
		$(`#total-${code}`).text(convert_vnd(value*number))
	}
    total_get_goods();
}

function change_debt(){
    let payment = convert_number($('#payment').val());
    $('#debt').val(convert_vnd(money_total - payment))
}

function total_get_goods(){
    let money = 0;
	let payment = convert_number($('#payment').val());
    $(".total").each(function () {                  
        money+= convert_number($(this).text()); 
    });
	$('#debt').val(convert_vnd(money - payment))
    $('#total_get_goods').text(convert_vnd(money))
    money_total = money;
}

function get_list_product(){
    let list_product = [];
    $(".number-code").each(function () {                  
        list_product.push($(this).text()); 
    });
    let data = [];
    list_product.forEach((number_code)=>{
        data.push({
            cost_price: convert_number($(`#cost-price-${number_code}`).val()),
            quantity: convert_number($(`#quantity-${number_code}`).val()),
            product: $(`#id-product-${number_code}`).val()
        })
    })
    return data;
}
function clear_data(){
    $('#add_product').empty();
    money_total = 0;
    $('#debt').val(0)
    $('#payment').val(0)
    $('#total_get_goods').text(0)
}
function create_new(){
    let data = {
        total_get_goods : Number(money_total),
        payment: convert_number($('#payment').val()),
		debt: convert_number($('#debt').val()),
		type_payment: $('#type_payment').val(),
		supplier_id: $('#select_supplier').val(),
        products: get_list_product(),
        _csrf: $('#_csrf').val()
    }
    if(data.products.length >= 1){
        $.ajax({
            url:'/admin_storage_stocks/create',
            method:'POST',
            contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
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