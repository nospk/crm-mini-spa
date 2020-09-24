let typingTimer_product;                //timer identifier
let typingTimer_search;
let doneTypingInterval = 500;  //time in ms, 1 second for example
let show_product = $('#search_product');
let show_customer = $('#search_customer');

//on keyup, start the countdown
show_product.on('keyup', function () {
	clearTimeout(typingTimer_product);
	typingTimer_product = setTimeout(search_product, doneTypingInterval);
});

//on keydown, clear the countdown 
show_product.on('keydown', function () {
	clearTimeout(typingTimer_product);
	$('#show_search_product').hide();
});

show_customer.on('keyup', function () {
	clearTimeout(typingTimer_search);
	typingTimer_search = setTimeout(search_customer, doneTypingInterval);
});

//on keydown, clear the countdown 
show_customer.on('keydown', function () {
	clearTimeout(typingTimer_search);
	$('#show_search_customer').hide();
});

$(window).on("click", function () {
	$('#show_search_customer').hide();
	$('#show_search_product').hide();

});
$( document ).ready(()=>{
	get_service();
	get_employees();
	$('#birthday').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' })
	$('[data-mask]').inputmask()
    // const currencyInput = document.querySelector('input[type="currency"]')
    // currencyInput.addEventListener('focus', onFocus)
    // currencyInput.addEventListener('blur', onBlur)
})
function search_product() {
	if ($('#search_product').val() != "") {
		$.ajax({
			url: '/store_sale/search_product',
			method: 'POST',
			data: {
				search: $('#search_product').val(),
				_csrf: $('#_csrf').val()
			},
			success: function (data) {
				if (data.status == 1) {
					if (data.data.length > 0) {
						let html = ""
						data.data.forEach(item => {
							html += `<li class="show_search pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
										<span class="font-weight-bold">${item.name}</span><br>
										<span class="number_code">Mã: ${item.number_code}</span><span class="float-right">Giá bán: ${convert_vnd(item.price)}</span><br>
									`
							if (item.type == "product") {
								html += `<span>Số lượng: ${item.stocks_in_store[0].product_of_sale}</span>`
							}
							html += `</li>`
						});
						$('#show_search_product').html(html)
						$('#show_search_product').show();
					} else {
						$('#show_search_product').html(`<li><span>Không tìm thấy sản phẩm</span></li>`);
						$('#show_search_product').show();
					}
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

}
function add_customer(customer){
	customer = customer.split(':')
	$('#customer').text(customer[0]);
	$('#select_customer').val(customer[1]);
	$('#find_customer').css('display', 'none');
	$('#show_customer').css('display', 'flex');
}
function remove_customer(){
	$('#customer').text("");
	$('#select_customer').val("");
	$('#search_customer').val("");
	$('#find_customer').css('display', 'flex');
	$('#show_customer').css('display', 'none');
}
function search_customer() {
	if ($('#search_customer').val() != "") {
		$.ajax({
			url: '/store_sale/search_customer',
			method: 'POST',
			data: {
				search: $('#search_customer').val(),
				_csrf: $('#_csrf').val()
			},
			success: function (data) {
				if (data.status == 1) {
					if (data.data.length > 0) {
						let html = ""
						data.data.forEach(item => {
							html += `<li class="show_search pointer" onclick="add_customer('${item.name}:${item._id}')">
										<span class="font-weight-bold" >${item.name}</span><br>
										<span class="number_code"><i class="fas fa-phone-square-alt"></i>  ${item.phone.replace(/(\d{3})(\d{3})(\d{4})/g, '$1 $2 $3')}</span>
									 </li>
									`
						});
						$('#show_search_customer').html(html)
						$('#show_search_customer').show();
					} else {
						$('#show_search_customer').html(`<li><span>Không tìm thấy khách hàng</span></li>`);
						$('#show_search_customer').show();
					}
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

}
function add_product(product){
    product = product.split(':')
	let check = $(`#quantity-${product[1]}`).val()
	if(product[4] == 0){
		Swal.fire({
			title: "Sản phẩm hết hàng",
			text: "Vui lòng chọn sản phẩm khác hoặc thêm sản phẩm",
			icon: "error",
			showConfirmButton: false,
			timer: 3000
		}).then((result) => {
			// cho vào để ko báo lỗi uncaught
		})
		.catch(timer => {
				// cho vào để ko báo lỗi uncaught
		});
		return;
	}
    if(!check){
        let html = `<tr>
                    <td><span class="number-code">${product[1]}</span></td>
                    <td><span id="name-product-${product[1]}">${product[0]}</span><input type="hidden" id="id-product-${product[1]}" value="${product[3]}"></td>
                    <td><span id="price-${product[1]}">${convert_vnd(Number(product[2]))}</span>
				   `
		if(product[4]=="max"){
			html += `<td><input class="form-control form-control-sm" style="max-width:60px" min="0" type="number" onchange="change_quantity('${product[1]}', this)" id="quantity-${product[1]}" max="999" value="1"></td>`
		}else{
			html += `<td><input class="form-control form-control-sm" style="width:60px" min="0" type="number" onchange="change_quantity('${product[1]}', this)" id="quantity-${product[1]}" max="${product[4]}" value="1"></td>`
		}  
             html+= `<td><span class="total" id="total-${product[1]}" >${convert_vnd(Number(product[2]))}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#add_product').append(html)
        total_sale();
    }else{
        let quantity = $(`#quantity-${product[1]}`).val()
        $(`#quantity-${product[1]}`).val(Number(quantity)+1)
        change_quantity(product[1])
    }

}

function delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    total_sale();
}


function change_quantity(code, btn){
	let number = $(`#quantity-${code}`).val()
	let current_product = $(`#quantity-${code}`).attr('max');
	if(number == 0){
		delete_row_product(btn)
	}else{
		let value = convert_number($(`#price-${code}`).text())
		// $(`#total-${code}`).text(convert_vnd(value*number))
		if(Number(current_product) - Number(number) < 0){
            $(`#quantity-${code}`).val(current_product)
            $(`#total-${code}`).text(convert_vnd(value*current_product))
        }else{
            $(`#total-${code}`).text(convert_vnd(value*number))
        }	
    }
		
	
    total_sale();
}


function total_sale(){
    let money = 0;
	//let payment = convert_number($('#payment').val());
    $(".total").each(function () {                  
        money+= convert_number($(this).text()); 
    });


}

function get_employees(){
	$.ajax({
        url:'/store_sale/get_employees',
        method:'POST',
        data: {
				_csrf: $('#_csrf').val()
		},
        success: function(data){
            if(data.status == 1){
				let html_employees = '';
                data.data.forEach(item => {
                    html_employees += `<option value="${item._id}">${item.name}</option>`
                })
				console.log(html_employees)
				$('#select_employees').html(html_employees)
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

function get_service(){
	$.ajax({
			url: '/store_sale/get_service',
			method: 'POST',
			data: {
				_csrf: $('#_csrf').val()
			},
			success: function (data) {
				if (data.status == 1) {
					let count
					let set_number = 8;
					count = set_number;
					let html = `<div class="carousel-inner">`
					data.data.forEach((item, index) => {
						if(index == 0){ // if first item
							html+= `<div class="carousel-item active">
										<div class="card-columns">
											<div class="card bg-primary text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
												<div class="card-body">
													<h5 class="card-title">${item.name}</h5>
													<p class="card-text">Mã: ${item.number_code}</p>
													<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
												</div>
											</div>
								`
						}else if((index+1) == data.data.length){ // if last item
							if(index == count){ // if first card in columns
								html+= `<div class="carousel-item">
											<div class="card-columns">
												<div class="card bg-primary text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
													<div class="card-body">
														<h5 class="card-title">${item.name}</h5>
														<p class="card-text">Mã: ${item.number_code}</p>
														<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
													</div>
												</div>
											</div>
										</div>
									`
							}else{
								html+= `<div class="card bg-primary text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
											<div class="card-body">
												<h5 class="card-title">${item.name}</h5>
												<p class="card-text">Mã: ${item.number_code}</p>
												<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
											</div>
										</div>
									</div>
								</div>
								`
							}
						}else if ((index+1) == count){ // if last card in columns
							
							html+= `<div class="card bg-primary text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
											<div class="card-body">
												<h5 class="card-title">${item.name}</h5>
												<p class="card-text">Mã: ${item.number_code}</p>
												<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
											</div>
										</div>
									</div>
								</div>
								`
						}else if(index == count){ // if first card in columns
							count += set_number;
							html+= `<div class="carousel-item">
										<div class="card-columns">
											<div class="card bg-primary text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
												<div class="card-body">
													<h5 class="card-title">${item.name}</h5>
													<p class="card-text">Mã: ${item.number_code}</p>
													<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
												</div>
											</div>
								`
						}else{
							html+= `<div class="card bg-primary text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
										<div class="card-body">
											<h5 class="card-title">${item.name}</h5>
											<p class="card-text">Mã: ${item.number_code}</p>
											<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
										</div>
									</div>
								`
						}
					})
					html+=`
						</div>
						<a class="carousel-control-prev" href="#get_service" style="width:20px" role="button" data-slide="prev">
							<span class="carousel-control-prev-icon" style="background-color:red" aria-hidden="true"></span>
							<span class="sr-only">Previous</span>
						</a>
						<a class="carousel-control-next" href="#get_service" style="width:20px" role="button" data-slide="next">
							<span class="carousel-control-next-icon" style="background-color:red" aria-hidden="true"></span>
							<span class="sr-only">Next</span>
						</a>
					</div>
					`
					$('#get_service').html(html)
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
function clear_new_customer(){
	$('#create_new_customer #name').val("")
    $('#create_new_customer #birthday').val("")
    $('#create_new_customer #address').val("")
    $('#create_new_customer #phone').val("")
	$('#create_new_customer #note').val("")
}
function create_new_customer(){
    let data = {
        name: $('#create_new_customer #name').val().trim(),
        birthday: $('#create_new_customer #birthday').val().trim(),
        address: $('#create_new_customer #address').val().trim(),
        phone: $('#create_new_customer #phone').val().replace(/ +/g, ""),
		note: $('#create_new_customer #note').val().trim(),
		gener: $('#create_new_customer #gener').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/store_sale/create_customer',
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
					clear_new_customer()
                })
                .catch(timer => {
					clear_new_customer()
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