$( document ).ready(()=>{
    get_data();
    get_brand_group();
    const currencyInput = document.querySelectorAll('input[type="currency"]')
    currencyInput.forEach(function(element) {
        element.addEventListener('focus', onFocus)
        element.addEventListener('blur', onBlur)
    });
	
	$('#new_group').on('shown.bs.modal', function (e) {
		$('#create_new').css('opacity', 0);
		$('#edit_data').css('opacity', 0);
	});
	$('#new_group').on('hidden.bs.modal', function (e) {
		$('#create_new').css('opacity', 1);
		$('#edit_data').css('opacity', 1);
	});
	$('#new_brand').on('shown.bs.modal', function (e) {
		$('#create_new').css('opacity', 0);
		$('#edit_data').css('opacity', 0);
	});
	$('#new_brand').on('hidden.bs.modal', function (e) {
		$('#create_new').css('opacity', 1);
		$('#edit_data').css('opacity', 1);
	});
	$('#type_product_service').change(function(){
		if($('#type_product_service').val() == "product"){
            $('.hair-removel').hide()
            $('#brand_show').show()
            $('.combo-off').show()
            $('.combo-on').hide()
			$('.times_choose').hide()
            $('.times_service').hide()
            $('#cost_price').prop("disabled", false);
		}else if($('#type_product_service').val() == "service"){
            $('.hair-removel').hide()
            $('.combo-off').show()
            $('.combo-on').hide()
            $('#brand_show').hide()
			$('.times_choose').show()
            $('.times_service').show()
            $('#cost_price').prop("disabled", false);
        }else if($('#type_product_service').val() == "hair_removel"){
            $('.combo-off').show()
            $('.combo-on').hide()
            $('.hair-removel').show()
            $('.times_choose').show()
            $('.times_service').hide()
            $('#cost_price').prop("disabled", false);
            $('#brand_show').hide();
		}else{
            get_product_service()
            $('.hair-removel').hide()
            $('.combo-off').hide()
            $('.combo-on').show()
			$('.times_choose').hide()
            $('.times_service').hide()
            $('#cost_price').prop("disabled", true);
        }
	})
    $('#create_new').on('shown.bs.modal', function (e) {
		if($('#type_product_service').val() == "product"){
            $('.hair-removel').hide()
            $('#brand_show').show()
            $('.combo-off').show()
            $('.combo-on').hide()
			$('.times_choose').hide()
            $('.times_service').hide()
            $('#cost_price').prop("disabled", false);
		}else if($('#type_product_service').val() == "service"){
            $('.hair-removel').hide()
            $('.combo-off').show()
            $('.combo-on').hide()
            $('#brand_show').hide()
			$('.times_choose').show()
            $('.times_service').show()
            $('#cost_price').prop("disabled", false);
        }else if($('#type_product_service').val() == "hair_removel"){
            $('.combo-off').show()
            $('.combo-on').hide()
            $('.hair-removel').show()
            $('.times_choose').show()
            $('.times_service').hide()
            $('#cost_price').prop("disabled", false);
            $('#brand_show').hide();
		}else{
            get_product_service()
            $('.hair-removel').hide()
            $('.combo-off').hide()
            $('.combo-on').show()
			$('.times_choose').hide()
            $('.times_service').hide()
            $('#cost_price').prop("disabled", true);
        }
	});
})
let page_now;
const show_type = type =>{
    if(type == "product")   return "Sản Phẩm"
    else if (type == "service") return "Dịch vụ"
    else if (type == "hair_removel") return "Triệt lông"
    else return "Combo"
}
function get_product_service(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_product_service/get_product_service',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                let html = ""   
                data.data.forEach(item =>{
                    html +=`<option value="${item.name}:${item.number_code}:${item.cost_price}:${item._id}">${item.name}</option>`
                })
                $('#edit_select_items').html(html)
                $('#select_items').html(html)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function add_combo(){
    let value = $('#select_items').val()
    value = value.split(':')
    let check = $(`#quantity-${value[1]}`).val()
    if(!check){
        let html = `<tr>
                    <td><span class="number-code">${value[1]}</span></td>
                    <td><span>${value[0]}</span><input type="hidden" id="id-product-${value[1]}" value="${value[3]}"></td>
                    <td><span id="cost-price-${value[1]}">${convert_vnd(Number(value[2]))}</span></td>
                    <td><input class="form-control form-control-sm" min="0" type="number" onchange="change_quantity('${value[1]}', this)" id="quantity-${value[1]}" value="1"></td>
                    <td><span class="total" id="total-${value[1]}" >${convert_vnd(Number(value[2]))}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#add_items').append(html)
        total_get_goods();
    }else{
        let quantity = $(`#quantity-${value[1]}`).val()
        $(`#quantity-${value[1]}`).val(Number(quantity)+1)
        change_quantity(value[1])
    }

}
function edit_add_combo(){
    let value = $('#edit_select_items').val()
    console.log(value)
    value = value.split(':')
    let check = $(`#quantity-${value[1]}`).val()
    if(!check){
        let html = `<tr>
                    <td><span class="number-code">${value[1]}</span></td>
                    <td><span>${value[0]}</span><input type="hidden" id="id-product-${value[1]}" value="${value[3]}"></td>
                    <td><span id="cost-price-${value[1]}">${convert_vnd(Number(value[2]))}</span></td>
                    <td><input class="form-control form-control-sm" min="0" type="number" onchange="edit_change_quantity('${value[1]}', this)" id="quantity-${value[1]}" value="1"></td>
                    <td><span class="total" id="total-${value[1]}" >${convert_vnd(Number(value[2]))}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="edit_delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#edit_add_items').append(html)
        edit_total_get_goods();
    }else{
        let quantity = $(`#quantity-${value[1]}`).val()
        $(`#quantity-${value[1]}`).val(Number(quantity)+1)
        edit_change_quantity(value[1])
    }
}
function edit_change_quantity(code, btn){
	let number = $(`#quantity-${code}`).val()
	if(number == 0){
		delete_row_product(btn)
	}else{
		let value = convert_number($(`#cost-price-${code}`).text())
		$(`#total-${code}`).text(convert_vnd(value*number))
	}
    edit_total_get_goods();
}
function edit_delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    edit_total_get_goods();
}
function delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    total_get_goods();
}
function edit_total_get_goods(){
    let money = 0;
    $(".total").each(function () {                  
        money+= convert_number($(this).text()); 
    });
    $('#edit_cost_price').val(convert_vnd(money))
}
function change_quantity(code, btn){
	let number = $(`#quantity-${code}`).val()
	if(number == 0){
		delete_row_product(btn)
	}else{
		let value = convert_number($(`#cost-price-${code}`).text())
		$(`#total-${code}`).text(convert_vnd(value*number))
	}
    total_get_goods();
}
function total_get_goods(){
    let money = 0;
    $(".total").each(function () {                  
        money+= convert_number($(this).text()); 
    });
    $('#cost_price').val(convert_vnd(money))
}
function get_list_items(){
    let list_product = [];
    $(".number-code").each(function () {                  
        list_product.push($(this).text()); 
    });
    let data = [];
    list_product.forEach((number_code)=>{
        data.push({
            quantity: convert_number($(`#quantity-${number_code}`).val()),
            id: $(`#id-product-${number_code}`).val()
        })
    })
    return data;
}
function create_new(){
    let data;
    if($('#create_new #type_product_service').val() != "combo"){
        data = {    
            name: $('#create_new #name').val().trim(),
            type: $('#create_new #type_product_service').val(),
            price: convert_number($('#create_new #price').val()),
            cost_price: convert_number($('#create_new #cost_price').val()),
            service_price: convert_number($('#create_new #service_price').val()),
            number_code: $('#create_new #number_code').val(),
            description: $('#create_new #description').val(),
			times_service: $('#create_new #times_service').val(),
            brand: $('#brand').val() == "" ? undefined : $('#brand').val(),
			times: ($('#type_product_service').val() == "service" || $('#type_product_service').val() == "hair_removel") ? $('#create_new #times_choose').val() : undefined,
            group: $('#group').val(),
            _csrf: $('#_csrf').val()
        }
    }else{
        data = {
            name: $('#create_new #name').val().trim(),
            type: $('#create_new #type_product_service').val(),
            price: convert_number($('#create_new #price').val()),
            cost_price: convert_number($('#create_new #cost_price').val()),
            combo: get_list_items(),
            number_code: $('#create_new #number_code').val(),
            description: $('#create_new #description').val(),
            brand: $('#brand').val() == "" ? undefined : $('#brand').val(),
            group: $('#group').val(),
            _csrf: $('#_csrf').val()
        }
    }
    $.ajax({
        url:'/admin_product_service/create',
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
                }).then(()=>{
					get_data()
                })
                .catch(timer => {
					get_data()
                });    
            }else{
                Swal.fire({
                    title: data.error,
                    text: data.message,
                    icon: "error",
                    showConfirmButton: false,    
                    timer: 3000
                }).then(()=>{
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
                                    <th width="20%">Tên</th>
									<th>Loại</th>
									<th>Mã số</th>
                                    <th>Số lần</th>
									<th>Giá vốn</th>
                                    <th>Giá bán</th>
                                    <th>Trạng thái</th>
									<th>Tồn kho</th>
									<th>Tổng hàng</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr onclick="edit_data('${item._id}')" class="pointer">
                <td>${item.name}</td>
				<td>${show_type(item.type)}</td>
                <td>${item.number_code}</td>
                <td>${item.type == 'hair_removel'? item.times : ""}</td>
				<td>${convert_vnd(item.cost_price)}</td>
				<td>${convert_vnd(item.price)}</td>
                <td>${item.isSell ? "Đang kinh doanh" : "Ngừng kinh doanh"}</td>
				<td class="text-center">${item.type == 'product'? item.stocks_in_storage.quantity : ""}</td>
				<td class="text-center">${item.type == 'product'? item.quantity : ""}</td>
                </tr>`
    })
	//comform_delete_data('${item._id}')
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

function get_data(paging_num){
    $('#edit_add_items').html("")
    $('#add_items').html("")
	$('#create_new #cost_price').val("")
    $('#create_new #name').val("")
    $('#create_new #price').val("")
    $('#create_new #number_code').val("")
    $('#create_new #description').val("")
    $('#edit_data #edit_id').val("");
    if(!paging_num){
        paging_num = page_now
    }
    let data = {
        search:$('#search_word').val().trim(),
        paging_num:paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_product_service/get',
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

function comform_delete_data(){
    Swal.fire({
        title: 'Bạn muốn xóa ?',
        text: "Mọi thông tin trong này sẽ bị mất, bạn có chắc muốn xóa nó ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
            if(result.value == true){
                $.ajax({
                    url:'/admin_product_service/delete_data',
                    method:'delete',
                    data: {id: $('#edit_data #edit_id').val(), _csrf: $('#_csrf').val()},
                    success: function(data){
                        if(data.status == 1){
                            get_data();
                        }
                    }
                })
            }
    });
}
function edit_data(id){
    $('#edit-stock-tab').html("")
    $("#edit_data .nav-link").removeClass('active');
    $("#edit_data .nav-link").first().addClass('active');
    $("#edit_data .tab-pane").removeClass('active show');
    $("#edit_data .tab-pane").first().addClass('active show');
	$.ajax({
		url:'/admin_product_service/edit_data',
		method:'post',
        data: {id: id, _csrf: $('#_csrf').val()},
        success: function(data){
			if(data.status == 1){
				$('#edit_data #edit_name').val(data.data.name);
                $('#edit_data #edit_price').val(convert_vnd(data.data.price));
                $('#edit_data #edit_cost_price').val(convert_vnd(data.data.cost_price));
				$('#edit_data #edit_type_product_service').val(data.data.type),
				$('#edit_data #edit_number_code').val(data.data.number_code);
				$('#edit_data #edit_description').val(data.data.description);
				$('#edit_data #isSell').val(data.data.isSell.toString())
                $('#edit_data #edit_id').val(data.data._id);
				$('#edit_data #edit_brand').val(data.data.brand);
				$('#edit_data #edit_group').val(data.data.group).change();
                $('#edit_data').modal('show');
                if(data.data.type =="service"){
                    $('#edit_data #edit_cost_price').prop("disabled", false);
                    $('#edit_data #edit-stock').css("display", "none");
					$('#edit_data #edit-history').css("display", "none");
					$('#edit_data .edit-times-choose').show();
                    $('#edit_data .edit-times-service').show();
					$('#edit_data #edit_times_service').val(data.data.times_service);
					$('#edit_data #edit_times_choose').val(data.data.times);
                    $('.edit-hair-removel').hide()
                    $('.combo-off').show()
                    $('.combo-on').hide()
                    $('#edit_brand_show').hide();
                }else if(data.data.type =="hair_removel"){
                    $('#edit_data #edit_cost_price').prop("disabled", false);
                    $('#edit_data #edit-stock').css("display", "none");
                    $('.edit-hair-removel').show()
					$('#edit_data #edit-history').css("display", "none");
					$('#edit_data .edit-times-choose').show();
                    $('#edit_data .edit-times-service').hide();
					$('#edit_data #edit_service_price').val(convert_vnd(data.data.service_price));
					$('#edit_data #edit_times_choose').val(data.data.times);
                    $('.combo-off').show()
                    $('.combo-on').hide()
                    $('#edit_brand_show').hide();
                }else if(data.data.type =="product"){
                    $('#edit_data #edit_cost_price').prop("disabled", true);
                    $('#edit_data #edit-stock').css("display", "block");
					$('#edit_data #edit-history').css("display", "block");
                    $('#edit_brand_show').show();
                    $('.edit-hair-removel').hide()
					$('#edit_data .edit-times-choose').hide();
                    $('#edit_data .edit-times-service').hide();
                    $('.combo-off').show()
                    $('.combo-on').hide()
                    let html = `<div class="info-box">
                                <span class="info-box-icon bg-success"><i class="fas fa-boxes"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Tổng hàng tồn</span>
                                    <span class="info-box-number">${data.data.quantity}</span>
                                    </div>
                            </div>
                            <div class="info-box">
                                <span class="info-box-icon bg-success"><i class="fas fa-warehouse"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Kho</span>
                                    <span class="info-box-number">${data.data.stocks_in_storage.quantity}</span>
                                    </div>
                            </div>`
                    for(let i = 0; i < data.data.stocks_in_store.length; i++){
                        html += `<div class="info-box">
                                    <span class="info-box-icon bg-success"><i class="fas fa-store"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Cửa hàng ${data.data.stocks_in_store[i].store_name}</span>
										<span class="info-box-number">Tổng hàng : ${data.data.stocks_in_store[i].quantity}</span>
                                        <span class="info-box-text">Hàng bán:</span><span class="info-box-number">${data.data.stocks_in_store[i].product_of_sell}</span>
										<span class="info-box-text">Hàng dịch vụ:</span><span class="info-box-number">${data.data.stocks_in_store[i].product_of_service}</span>
										<span class="info-box-text">Hàng chưa phân loại:</span><span class="info-box-number">${data.data.stocks_in_store[i].product_of_undefined}</span>
                                    </div>
                                </div>`
                    }
					let html_history= `<table class="table table-sm  table-hover text-nowrap">
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
					data.data.storage_history.last_history.forEach((item)=>{
						html_history+=`<tr>
								<td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
								<td>${item.serial}</td>
								<td>${item.type}</td>`
						let index = item.list_products.findIndex(element => element.product == data.data._id)
						html_history+=`
										<td>${item.list_products[index].quantity}</td>
										<td>${item.list_products[index].current_quantity}</td></tr>
									  `
					})
					html_history+=`</tbody>
								</table>
							`;
					$('#edit-history-tab').html(html_history);
                    $('#edit-stock-tab').html(html)
                }else{
                    $('#edit_data #edit_cost_price').prop("disabled", true);
                    $('#edit_data #edit-stock').css("display", "none");
                    $('.edit-hair-removel').hide()
					$('#edit_data .edit-times-choose').hide();
                    $('#edit_data .edit-times-service').hide();
					$('#edit_data #edit-history').css("display", "none");
                    $('#edit_brand_show').hide();
                    get_product_service();
                    $('.combo-off').hide()
                    $('.combo-on').show()
                    let html
                    //${item.name}:${item.number_code}:${item.cost_price}:${item._id}
                    data.data.combo.forEach(item=>{
                        html += `<tr>
                                    <td><span class="number-code">${item.id.number_code}</span></td>
                                    <td><span>${item.id.name}</span><input type="hidden" id="id-product-${item.id.number_code}" value="${item.id._id}"></td>
                                    <td><span id="cost-price-${item.id.number_code}">${convert_vnd(Number(item.id.cost_price))}</span></td>
                                    <td><input class="form-control form-control-sm" min="0" type="number" onchange="edit_change_quantity('${item.id.number_code}', this)" id="quantity-${item.id.number_code}" value="${item.quantity}"></td>
                                    <td><span class="total" id="total-${item.id.number_code}" >${convert_vnd(Number(item.id.cost_price)*Number(item.quantity))}</span></td>
                                    <td><span style="color:red; cursor: pointer" onclick="edit_delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                                </tr>`
                            
                    })
                    $('#edit_add_items').html(html)
                    edit_total_get_goods()
                }
                
            }
		}
	})
}
function update_data(){
    let data
    if($('#edit_data #edit_type_product_service').val() != "combo"){
        data = {
            name: $('#edit_data #edit_name').val().trim(),
            cost_price: convert_number($('#edit_data #edit_cost_price').val()),
            price: convert_number($('#edit_data #edit_price').val()),
            number_code: $('#edit_data #edit_number_code').val(),
            description: $('#edit_data #edit_description').val(),
            service_price: convert_number($('#edit_data #edit_service_price').val()),
            isSell: $('#edit_data #isSell').val(),
			times_service: $('#edit_data #edit_times_service').val(),
            brand: $('#edit_data #edit_brand').val() == "" ? undefined: $('#edit_data #edit_brand').val(),
			times: ($('#edit_type_product_service').val() == "service" || $('#edit_type_product_service').val() == "hair_removel") ? $('#edit_data #edit_times_choose').val() : undefined,
            group: $('#edit_data #edit_group').val(),
            id: $('#edit_data #edit_id').val(),
            _csrf: $('#_csrf').val()
        }
    }else{
        data = {
            name: $('#edit_data #edit_name').val().trim(),
            combo: get_list_items(),
            price: convert_number($('#edit_data #edit_price').val()),
            cost_price: convert_number($('#edit_data #edit_cost_price').val()),
            number_code: $('#edit_data #edit_number_code').val(),
            description: $('#edit_data #edit_description').val(),
            isSell: $('#edit_data #isSell').val(),
            brand: $('#edit_data #edit_brand').val() == "" ? undefined: $('#edit_data #edit_brand').val(),
            group: $('#edit_data #edit_group').val(),
            id: $('#edit_data #edit_id').val(),
            _csrf: $('#_csrf').val()
        }
    }
	
    $.ajax({
        url:'/admin_product_service/update_data',
        method:'PUT',
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
					get_data()
                })
                .catch(timer => {
					get_data()
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

function new_name_brand(){
    if($('#new_name_brand').val().trim() == ""){
        Swal.fire({
            title: "Thiếu thông tin",
            text: "Vui lòng đặt tên",
            icon: "error",
            showConfirmButton: false,    
            timer: 3000
        }).then((result)=>{
            // cho vào để ko báo lỗi uncaught
        })
        .catch(timer => {
            // cho vào để ko báo lỗi uncaught
        }); 
    }else{
        $.ajax({
            url:'/admin_brand_group/new_brand',
            method:'POST',
            data: {
                name: $('#new_name_brand').val().trim(),
                _csrf: $('#_csrf').val()
            },
            success: function(data){
                if(data.status == 1){
                    Swal.fire({
                        title: "Thao tác thành công",
                        text: data.message,
                        icon: "info",
                        showConfirmButton: false,
                        timer: 3000
                    }).then((result)=>{
                        get_brand_group()
                    })
                    .catch(timer => {
                        get_brand_group()
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
}

function new_name_group(){
    if($('#new_name_group').val().trim() == ""){
        Swal.fire({
            title: "Thiếu thông tin",
            text: "Vui lòng đặt tên",
            icon: "error",
            showConfirmButton: false,    
            timer: 3000
        }).then((result)=>{
            // cho vào để ko báo lỗi uncaught
        })
        .catch(timer => {
            // cho vào để ko báo lỗi uncaught
        }); 
    }else{
        $.ajax({
            url:'/admin_brand_group/new_group',
            method:'POST',
            data: {
                name: $('#new_name_group').val().trim(),
                _csrf: $('#_csrf').val()
            },
            success: function(data){
                if(data.status == 1){
                    Swal.fire({
                        title: "Thao tác thành công",
                        text: data.message,
                        icon: "info",
                        showConfirmButton: false,
                        timer: 3000
                    }).then((result)=>{
                        get_brand_group()
                    })
                    .catch(timer => {
                        get_brand_group()
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
				let html_group = ""
                data.data.forEach(item => {
                    if(item.type=="brand"){
                        html_brand += `<option value="${item._id}">${item.name}</option>`
                    }else{
                        html_group += `<option value="${item._id}">${item.name}</option>`
                    }
                })
                $('#brand').html(html_brand)	
				$('#edit_brand').html(html_brand)
				$('#group').html(html_group)
				$('#edit_group').html(html_group)
				$('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}