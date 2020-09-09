
$( document ).ready(()=>{
	get_product();
	$('#product_classification').on('show.bs.modal', function (e) {
		get_product_of_undefined()
	})
})
let page_now;
function get_product(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_stocks/get',
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
	data.forEach(item =>{
		html+=`<tr>
                <td>${item.name}</td>
                <td>${item.number_code}</td>
				<td>${item.isSale ? "Đang kinh doanh" : "Ngừng kinh doanh"}</td>
				<td>${item.stocks_in_store[0].quantity}</td>
				<td>${item.stocks_in_store[0].product_of_undefined}</td>
				<td>${item.stocks_in_store[0].product_of_sale}</td>
				<td>${item.stocks_in_store[0].product_of_service}</td>
                <td></td>
                </tr>`
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
function update_store(){
    let data = {
		name:  $('#name').val(),
		address: $('#address').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_stocks/update_store',
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
                        location.reload();
                    })
                    .catch(timer => {
                        location.reload();
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
}
function get_product_of_undefined(){
	let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_stocks/get_product_of_undefined',
        method:'POST',
        data: data,
        success: function(data){
                if(data.status == 1){
                    render_data_classification(data.data)
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
function render_data_classification(data){
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
	data.forEach(item =>{
		html+=`<tr>
                <td>${item.product.name}</td>
                <td><span class="number-code">${item.product.number_code}</span></td>
				<td><input style="border-style:none;width: 100px;" disabled id="quantity_${item.product.number_code}" value="${item.product_of_undefined}"></td>
				<td><input type="number" class="form-control form-control-sm" min="0" value="0" onchange="change_product_sale('${item.product.number_code}')" id="quantity_sale_${item.product.number_code}"></td>
				<td><input type="number" class="form-control form-control-sm" min="0" value="0" onchange="change_product_service('${item.product.number_code}')" id="quantity_service_${item.product.number_code}"></td>
				<input type="hidden" id="default_quantity_${item.product.number_code}"value="${item.product_of_undefined}" >
				<input type="hidden" id="id_${item.product.number_code}"value="${item._id}" >
                </tr>`
    })
    html+=`</tbody>
                </table>
            `;
    $('#show_product_classification').html(html);
}

function change_product_sale(number_code){
	let quantity = $(`#default_quantity_${number_code}`).val()
	let change_number = $(`#quantity_sale_${number_code}`).val()
	let quantity_service = $(`#quantity_service_${number_code}`).val()
	if(quantity - change_number - quantity_service >= 0){
		$(`#quantity_${number_code}`).val(quantity - change_number - quantity_service)
	}else{
		$(`#quantity_sale_${number_code}`).val(quantity - quantity_service )
		$(`#quantity_${number_code}`).val(0)
	}
	
}
function change_product_service(number_code){
	let quantity = $(`#default_quantity_${number_code}`).val()
	let change_number = $(`#quantity_service_${number_code}`).val()
	let quantity_sale = $(`#quantity_sale_${number_code}`).val()
	if(quantity - change_number - quantity_sale >= 0){
		$(`#quantity_${number_code}`).val(quantity - change_number - quantity_sale)
	}else{
		$(`#quantity_service_${number_code}`).val(quantity - quantity_sale)
		$(`#quantity_${number_code}`).val(0)
	}
	
}

function get_list_product(){
    let list_product = [];
    $(".number-code").each(function () {                  
        list_product.push($(this).text()); 
    });
    let data = [];
    list_product.forEach((number_code)=>{
		if($(`#quantity_sale_${number_code}`).val() > 0 || $(`#quantity_service_${number_code}`).val() > 0){
			data.push({
				product_of_sale: Number($(`#quantity_sale_${number_code}`).val()),
				product_of_service: Number($(`#quantity_service_${number_code}`).val()),
				id: $(`#id_${number_code}`).val()
			})
		}
    })
    return data;
}
function send_data(){
	let data = {
        products: get_list_product(),
        _csrf: $('#_csrf').val()
    }
    if(data.products.length >= 1){
        $.ajax({
            url:'/admin_store_stocks/update_stocks',
            method:'PUT',
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
                    })
                    .catch(timer => {
                        get_product()
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
            title: 'Không có hàng chưa phân loại',
            text: 'Vui lòng phân loại hàng vào lần sau',
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