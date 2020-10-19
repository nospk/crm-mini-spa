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
    const currencyInputAll = document.querySelectorAll('input[type="currency"]')
	currencyInputAll.forEach(currencyInput=>{
		currencyInput.addEventListener('focus', onFocus)
		currencyInput.addEventListener('blur', onBlur)
	})
	$('#number_code_discount').keyup(function() {
        this.value = this.value.toLocaleUpperCase();
    });
	$('#number_code_discount').on('change', function(){
		if (this.value != "") {
			$.ajax({
				url: '/store_sale/search_discount',
				method: 'POST',
				data: {
					number_code: $('#number_code_discount').val(),
					_csrf: $('#_csrf').val()
				},
				success: function (data) {
					if (data.status == 1) {
						if (data.data) {
							let discount = data.data
							$('#discount_type').val(discount.type_discount)
							if(discount.type_discount == "percent"){
								$('#discount_value').text(convert_percent(discount.value))
								total_sale()
							}else{
								$('#discount_value').text(convert_vnd(discount.value))
								total_sale()
							}
						}
					} else {
						Swal.fire({
							title: data.error,
							text: data.message,
							icon: "error",
							showConfirmButton: false,
							timer: 3000
						}).then((result) => {
							clear_discount()
						})
						.catch(timer => {
							clear_discount()
						});
					}
				}
			})
		}else{
			$('#discount_type').val("")
			$('#discount_value').text("")
			total_sale()
		}

	})
})
function clear_discount(){
	$('#discount_type').val("")
	$('#discount_value').text("")
	$('#number_code_discount').val("")
	total_sale()
}
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
			html += `<td><input class="form-control form-control-sm" style="max-width:60px; " min="0" type="number" onchange="change_quantity('${product[1]}', this)" id="quantity-${product[1]}" max="999" value="1"></td>`
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
	let money_discount = 0;
	//let payment = convert_number($('#payment').val());
    $(".total").each(function () {                  
        money+= convert_number($(this).text()); 
    });
	if(money != 0){
		if($("#discount_type").val() != ""){
			if($("#discount_type").val() == "percent"){
				money_discount = Math.ceil(money * convert_number($('#discount_value').text()) /100)
				$('#money_discount').text(convert_vnd(money_discount))
			}
			if($("#discount_type").val() == "money"){
				money_discount = convert_number($('#discount_value').text())
				$('#money_discount').text($('#discount_value').text())
			}
		}else{
			$('#money_discount').text("")
		}
		$('#total_sale').text(convert_vnd(money))
		let bill_money = money - money_discount
		if(bill_money < 0){
			$('#bill_money').text(convert_vnd(0))
		}else{
			$('#bill_money').text(convert_vnd(bill_money))
		}
			
		$('#selection_pay').removeClass("d-none").addClass("d-flex");
		if($('#customer_pay_cash').text() != "" || $('#customer_pay_card').text() != ""){
			$('#money_return').text(convert_vnd(convert_number($('#customer_pay_cash').text()) + convert_number($('#customer_pay_card').text()) - convert_number($('#bill_money').text())))
		}else{
			$('#money_return').text("")
		}
	}else{
		$('#total_sale').text("")
		$('#customer_pay_cash').text("")
		$('#customer_pay_card').text("")
		$('#money_return').text("")
		$('#bill_money').text("")
		$('#selection_pay').removeClass("d-flex").addClass("d-none");
	}
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
											<div class="card shadow-none green-card text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
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
												<div class="card shadow-none green-card text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
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
								html+= `<div class="card shadow-none green-card text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
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
							
							html+= `<div class="card shadow-none green-card text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
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
											<div class="card shadow-none green-card text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
												<div class="card-body">
													<h5 class="card-title">${item.name}</h5>
													<p class="card-text">Mã: ${item.number_code}</p>
													<p class="card-text"><small>${convert_vnd(item.price)}</small></p>
												</div>
											</div>
								`
						}else{
							html+= `<div class="card shadow-none green-card text-white pointer" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
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
		note: $('#create_new_customer #note_customer').val().trim(),
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
function pay_cash(){
	$('#customer_pay_cash').text($('#pay_cash').val())
	$('#customer_pay_card').text("")
	if($('#customer_pay_cash').text() != ""){
		$('#money_return').text(convert_vnd(convert_number($('#customer_pay_cash').text()) - convert_number($('#bill_money').text())))
	}else{
		$('#money_return').text("")
	}
}
function pay_both(){
	$('#customer_pay_cash').text($('#both_pay_cash').val())
	$('#customer_pay_card').text($('#both_pay_card').val())
	$('#money_return').text(convert_vnd(convert_number($('#customer_pay_cash').text()) + convert_number($('#customer_pay_card').text()) - convert_number($('#bill_money').text())))
}
function change_payment_type(type){
	if(type == "payment_cash"){
		$('#type_cash').modal('show');
		$('#pay_cash').val($('#bill_money').text())
		$('#both_pay_cash').val("");
		$('#both_pay_card').val("");
	}else if(type == "payment_card"){
		$('#customer_pay_card').text($('#bill_money').text())
		$('#money_return').text(convert_vnd(0))
		$('#customer_pay_cash').text("")
		$('#both_pay_cash').val("")
		$('#both_pay_card').val("")
		$('#pay_cash').val("")
	}else{
		$('#type_both').modal('show');
		$('#pay_cash').val("")
	}
}
function check_payment(){
	if($(".total").length == 0){
		Swal.fire({
			title: "Lỗi chưa chọn sản phẩm - dịch vụ",
			text: "Vui lòng chọn lại",
			icon: "error",
			showConfirmButton: false,    
			timer: 3000
		}).then((result)=>{
			// cho vào để ko báo lỗi uncaught
		})
		.catch(timer => {
			// cho vào để ko báo lỗi uncaught
		}); 
	}else if($('#customer_pay_cash').text() == "" && $('#customer_pay_card').text() == ""){
		Swal.fire({
			title: "Lỗi chưa nhập số tiền thanh toán của khách",
			text: "Vui lòng nhập lại",
			icon: "error",
			showConfirmButton: false,    
			timer: 3000
		}).then((result)=>{
			// cho vào để ko báo lỗi uncaught
		})
		.catch(timer => {
			// cho vào để ko báo lỗi uncaught
		});
	}else if($('#select_customer').val() == ""){
		Swal.fire({
			title: "Bạn chưa nhập thông tin khách hàng",
			text: "Xác nhận đồng ý thanh toán cho khách lẻ",
			icon: "info",
			showCancelButton: true,
			cancelButtonColor: '#d33',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Từ chối'
		}).then((result)=>{
			if(result.value){
				Swal.fire({
					title: "Xác nhận thanh toán",
					text: "Đã kiểm tra kỹ thông tin",
					icon: "info",
					showCancelButton: true,
					cancelButtonColor: '#d33',
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Đồng ý',
					cancelButtonText: 'Từ chối'
				}).then((result)=>{
					if(result.value){
						send_payment()
					}
				})
				.catch(timer => {
					// cho vào để ko báo lỗi uncaught
				});
			}
		})
		.catch(timer => {
			// cho vào để ko báo lỗi uncaught
		});
	}else{
		Swal.fire({
			title: "Xác nhận thanh toán",
			text: "Đã kiểm tra kỹ thông tin",
			icon: "info",
			showCancelButton: true,
			cancelButtonColor: '#d33',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Từ chối'
		}).then((result)=>{
			if(result.value){
				send_payment()
			}
		})
		.catch(timer => {
			// cho vào để ko báo lỗi uncaught
		});
	}
}

function get_list_item(){
    let get_list_item = [];
    $(".number-code").each(function () {                  
        get_list_item.push($(this).text()); 
    });
    let data = [];
    get_list_item.forEach((number_code)=>{
        data.push({
            quantity: convert_number($(`#quantity-${number_code}`).val()),
            id: $(`#id-product-${number_code}`).val()
        })
    })
    return data;
}

function send_payment(){
	let data = {
		customer_pay_card: convert_number($('#customer_pay_card').text()),
		customer_pay_cash: convert_number($('#customer_pay_cash').text()),
		number_code_discount: $('#number_code_discount').val(),
		customer: $('#select_customer').val(),
		note_bill: $('#note_bill').val(),
        list_item: get_list_item(),
        _csrf: $('#_csrf').val()
    }
	$.ajax({
		url:'/store_sale/send_payment',
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
					clear_data()
				})
				.catch(timer => {
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
}

function clear_data(){
	$('#add_product').html("")
	$('#bill_money').text("")
	$('#money_discount').text("")
	$('#total_sale').text("")
	$('#customer_pay_card').text("")
	$('#customer_pay_cash').text("")
	$('#money_return').text("")
	$('#note_bill').val("")
	remove_customer()
	clear_discount()
}