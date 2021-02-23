let typingTimer_product;                //timer identifier
let typingTimer_search;
let doneTypingInterval = 500;  //time in ms, 1 second for example
let show_product = $('#search_product');
let show_customer = $('#search_customer');
let page_now;
let tab_list = [{
		HD:1, 
		item:[],
		time: "",
		id:"",
		edit_bill: false,
		time_edit: false,
		employee: "", 
		customer:"", 
		bill_money: "", 
		discount_type:"",
		money_discount: "", 
		discount_id:"",
		number_code_discount:"",
		discount_value:"",
		total_sale:"", 
		customer_pay_card:"", 
		customer_pay_cash:"", 
		money_return:"",
		note_bill: "",
		price_book: "default"
	}];
let tab_number = 0;
let tab_max_current = 1;
let employees = {};
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
	get_price_book();
	get_employees();
	set_time();
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
			$.ajax({
				url: '/search_discount',
				method: 'POST',
				data: {
					number_code: $('#number_code_discount').val(),
					_csrf: $('#_csrf').val()
				},
				success: function (data) {
					if (data.status == 1) {
						if (data.data) {
							let discount = data.data
							tab_list[tab_number].discount_id = discount._id
							tab_list[tab_number].discount_type = discount.type_discount
							tab_list[tab_number].number_code_discount = discount.number_code
							if(discount.type_discount == "percent"){
								tab_list[tab_number].discount_value = convert_percent(discount.value)
							}else{
								tab_list[tab_number].discount_value = convert_vnd(discount.value)	
							}
						}
					} else {
						tab_list[tab_number].number_code_discount = ""
						Swal.fire({
							title: data.error,
							text: data.message,
							icon: "error",
							showConfirmButton: false,
							timer: 3000
						}).then((result) => {

						})
						.catch(timer => {

						});
					}
					render_tablist(tab_number)
				}
			})
	})
	$('#select_employees').on('change', function (){
		tab_list[tab_number].employee = $('#select_employees').val()
	})
	$('#date_sale').on('change', function (){
		tab_list[tab_number].time = $('#date_sale').val()
		tab_list[tab_number].time_edit = true
	})
	$('#select_price_book').on('change', function() {
		tab_list[tab_number].price_book = $('#select_price_book').val()
		render_tablist(tab_number);
	});
	$('#note_bill').on('change', function() {
		tab_list[tab_number].note_bill = $('#note_bill').val()
	});
	$('#modal_edit_bill').on('shown.bs.modal', function () {
		get_invoice_sale('1');
	});
	$('#report').on('shown.bs.modal', function () {
		 $.ajax({
			url:'/report',
            method:'post',
            data: {_csrf: $('#_csrf').val()},
            success: function(data){
				if(data.status == 1){
					$('#total_orders').html(data.data.report_day[0] ? data.data.report_day[0].count : 0)
					$('#total_services').html(data.data.service_day[0] ? data.data.service_day[0].count : 0)
					$('#total_money_sales').html(convert_vnd(data.data.report_day[0] ? data.data.report_day[0].totalAmount : 0))
					$('#money_sales_cash').html(convert_vnd(data.data.money_sales_cash || 0))
					$('#money_sales_card').html(convert_vnd(data.data.money_sales_card || 0))
				}
				let html_report_day_employees = "";
				data.data.employees.forEach(item => {
					html_report_day_employees += `<li class="list-group-item"><span class="font-weight-bold">${item.name}</span> <span class="float-right">${convert_vnd(item.money_sale)}</span></li>`
				})
				$('#report_day_employees').html(html_report_day_employees)
				let html_report_sale_month = "";
				data.data.report_sale_month.forEach(item => {
					html_report_sale_month += `<li class="list-group-item"><span class="font-weight-bold">${item.name}</span> <span class="float-right">${convert_vnd(item.money_sale)}</span></li>`
				})
				$('#report_sale_month').html(html_report_sale_month)
				let html_report_service_month = "";
				data.data.report_service_month.forEach(item => {
					html_report_service_month += `<li class="list-group-item"><span class="font-weight-bold">${item.name}</span>
											<br>Số lần dịch vụ<span class="float-right">${item.service}</span>
											<br>Số phút dịch vụ <span class="float-right">${item.minutes_service}</span>
					</li>`
				})
				$('#report_service_month').html(html_report_service_month)
            }
        })
	});
})
function get_price_book(){
	$.ajax({
        url:'/get_price_book',
        method:'POST',
        data: {_csrf: $('#_csrf').val()},
        success: function(data){
            if(data.status == 1){
				let html = `<option value="default">Bảng giá chung</option>`
                data.data.forEach(item =>{
					html +=`<option value="${item._id}">${item.name}</option>`
				})
				$('#select_price_book').html(html)
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
function set_time(){
	if (tab_list[tab_number].time == ""){
		let now = new Date()
		tab_list[tab_number].time = ('0'+ now.getDate()).slice(-2) + '/'+ ('0' + (now.getMonth()+1)).slice(-2) + '/' + now.getFullYear() + ' ' + ('0' + now.getHours()).slice(-2) + ":" + ('0' + now.getMinutes()).slice(-2)
		$('#date_sale').val(('0'+ now.getDate()).slice(-2) + '/'+ ('0' + (now.getMonth()+1)).slice(-2) + '/' + now.getFullYear() + ' ' + ('0' + now.getHours()).slice(-2) + ":" + ('0' + now.getMinutes()).slice(-2))
	}else{
		$('#date_sale').val(tab_list[tab_number].time)
	}
}
function search_product() {
	if ($('#search_product').val() != "") {
		$.ajax({
			url: '/search_product',
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
							html += `<li class="show_search pointer" onclick="add_product('${item._id}')">
										<span class="font-weight-bold">${item.name}</span><br>
										<span class="number_code">Mã: ${item.number_code}</span><span class="float-right">Giá bán: ${convert_vnd(check_price_book(item))}</span><br>
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
	tab_list[tab_number].customer = customer
	customer = customer.split(':')
	$('#customer').text(customer[0]);
	$('#select_customer').val(customer[1]);
	$('#find_customer').css('display', 'none');
	$('#show_customer').css('display', 'flex');
	get_customer(customer[1]);
}
function remove_customer(){
	tab_list[tab_number].customer = ""
	$('#customer').text("");
	$('#select_customer').val("");
	$('#search_customer').val("");
	$('#find_customer').css('display', 'flex');
	$('#show_customer').css('display', 'none');
}
function search_customer() {
	if ($('#search_customer').val() != "") {
		$.ajax({
			url: '/search_customer',
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
function add_product(id){
	$.ajax({
			url: '/get_by_id',
			method: 'POST',
			data: {
				id: id,
				_csrf: $('#_csrf').val()
			},
			success: function (data) {
				if (data.status == 1) {
					let product = data.data
					if(tab_list[tab_number] == undefined){
						tab_list[tab_number] = {item:[product]}
						tab_list[tab_number].item[0].quantity = 1
						tab_list[tab_number].item[0].price_book = product.price_book
					}else{
						let check = tab_list[tab_number].item.findIndex(element => element.number_code == product.number_code);
						if(check != -1){
							if(product.type == "product"){ 
								if(tab_list[tab_number].item[check].quantity +1 <= product.stocks_in_store[0].product_of_sale){
									tab_list[tab_number].item[check].quantity++
									tab_list[tab_number].item[check].stocks_in_store[0].product_of_sale = product.stocks_in_store[0].product_of_sale 
								}else{
									tab_list[tab_number].item[check].quantity = product.stocks_in_store[0].product_of_sale
									tab_list[tab_number].item[check].stocks_in_store[0].product_of_sale = product.stocks_in_store[0].product_of_sale
								}
							}else{
								tab_list[tab_number].item[check].quantity++
							}
						}else{
							tab_list[tab_number].item.push(Object.assign(product, {quantity: 1}))
						}
					}
					render_tablist(tab_number)
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
function render_tablist(tab_number){
	set_time();
	$('#search_product').val("");
	if($('#select_price_book').val() != tab_list[tab_number].price_book){
		$('#select_price_book').val(tab_list[tab_number].price_book);
		get_service();
	}
	let html = '';
	let money = 0;
	let combo = false;
	if(tab_list[tab_number] != undefined){
		tab_list[tab_number].item.forEach((item, index) =>{
			let check_price = check_price_book(item)
			money+= check_price * item.quantity
			html += `<tr>
						<td><span class="number-code">${item.number_code}</span></td>
					`
			if(item.type == "combo"){
				combo = true
				html+= `<td><span id="name-product-${item.number_code}">${item.name}</span><input type="hidden" id="id-product-${item.number_code}" value="${item._id}">`
				item.combo.forEach(combo =>{
					html+= `<br><span> *${combo.id.name} (${combo.id.number_code}): ${combo.quantity}<span>`
				})
				html+= `</td>`
			}else{
				html+=`<td><span id="name-product-${item.number_code}">${item.name}</span><input type="hidden" id="id-product-${item.number_code}" value="${item._id}"></td>`
			}		       		
			html += `<td><span id="price-${item.number_code}">${convert_vnd(check_price)}</span>
					   `
			if(item.type != "product"){
				html += `<td><input class="form-control form-control-sm" style="max-width:60px; " min="0" type="number" onchange="change_quantity(${tab_number}, ${index}, this)" id="quantity-${item.number_code}" max="999" value="${item.quantity}"></td>`
			}else{
				html += `<td><input class="form-control form-control-sm" style="width:60px" min="0" type="number" onchange="change_quantity(${tab_number}, ${index}, this)" id="quantity-${item.number_code}" max="${item.stocks_in_store[0].product_of_sale}" value="${item.quantity}"></td>`
			}  
				 html+= `<td><span class="total" id="total-${item.number_code}" >${convert_vnd(check_price*item.quantity)}</span></td>
						<td width="5%"><span style="color:red; cursor: pointer" onclick="delete_row_product(${tab_number},${index})"><i class="fas fa-times-circle"></i></span></td>
					</tr>`
			
		})
		if(tab_list[tab_number].employee != ""){
			$('#select_employees').val(tab_list[tab_number].employee)
		}
		if($('#number_code_discount').val() == ""){
			tab_list[tab_number].discount_type = "" 
			tab_list[tab_number].discount_value = "" 
			tab_list[tab_number].number_code_discount = "" 
			tab_list[tab_number].discount_id = ""
		}
		if(combo == true || $('#select_price_book').val() != "default"){
			tab_list[tab_number].discount_type = "" 
			tab_list[tab_number].discount_value = "" 
			tab_list[tab_number].number_code_discount = "" 
			tab_list[tab_number].discount_id = ""
			$('#number_code_discount').prop("disabled", true);
		}else{
			$('#number_code_discount').prop("disabled", false);
		}
		$('#number_code_discount').val(tab_list[tab_number].number_code_discount)
		$('#discount_value').text(tab_list[tab_number].discount_value)
		$('#add_product').html(html)
		$('#note_bill').val(tab_list[tab_number].note_bill)
		tab_list[tab_number].total_sale = money
	}
	if(money != 0){
		if(tab_list[tab_number].discount_type != ""){//if have discount code
			if(tab_list[tab_number].discount_type == "percent"){ // type percent
				tab_list[tab_number].money_discount = Math.ceil(money * convert_number(tab_list[tab_number].discount_value) /100)
			}
			if(tab_list[tab_number].discount_type == "money"){// type money
				tab_list[tab_number].money_discount = tab_list[tab_number].discount_value
			}
		}else{
			tab_list[tab_number].money_discount = 0
		}
		let bill_money = money - tab_list[tab_number].money_discount
		if(bill_money < 0){
			tab_list[tab_number].bill_money = 0
		}else{
			tab_list[tab_number].bill_money = bill_money
		}
			
		$('#selection_pay').removeClass("d-none").addClass("d-flex");
		if(tab_list[tab_number].customer_pay_cash != "" || tab_list[tab_number].customer_pay_card != ""){
			tab_list[tab_number].money_return = tab_list[tab_number].customer_pay_cash + tab_list[tab_number].customer_pay_card - tab_list[tab_number].bill_money
		}else{
			tab_list[tab_number].money_return = 0
		}
		$('#money_return').text(convert_vnd(tab_list[tab_number].money_return))
		$('#money_discount').text(convert_vnd(tab_list[tab_number].money_discount))
		$('#total_sale').text(convert_vnd(tab_list[tab_number].total_sale))
		$('#bill_money').text(convert_vnd(tab_list[tab_number].bill_money))
		$('#customer_pay_cash').text(convert_vnd(tab_list[tab_number].customer_pay_cash == "" ? 0 :tab_list[tab_number].customer_pay_cash))
		$('#customer_pay_card').text(convert_vnd(tab_list[tab_number].customer_pay_card == "" ? 0 :tab_list[tab_number].customer_pay_card))
	}else{
		$('#total_sale').text("")
		$('#money_discount').text("")
		$('#customer_pay_cash').text("")
		$('#customer_pay_card').text("")
		$('#money_return').text("")
		$('#bill_money').text("")
		$('#selection_pay').removeClass("d-flex").addClass("d-none");
	}
	if(tab_list[tab_number].customer != ""){
		add_customer(tab_list[tab_number].customer)
	} else {
		remove_customer()
	}
	if(tab_list[tab_number].edit_bill === false){
		$('.button-edit-bill').hide()
		$('.button-sale-bill').show()
	}else{
		$('.button-edit-bill').show()
		$('.button-sale-bill').hide()
	}
}

function delete_row_product(tab_number, index) {
    tab_list[tab_number].item.splice(index,1)
	render_tablist(tab_number)
}


function change_quantity(tab_number, index, btn){
	let number = ($(btn).val())
	if(number == 0){
		tab_list[tab_number].item.splice(index,1)
	}else{
		if(tab_list[tab_number].item[index].type == "product"){ 
			if(number <= tab_list[tab_number].item[index].stocks_in_store[0].product_of_sale){
				tab_list[tab_number].item[index].quantity = number
			}else{
				tab_list[tab_number].item[index].quantity = tab_list[tab_number].item[index].stocks_in_store[0].product_of_sale
			}			
		}else{
			tab_list[tab_number].item[index].quantity = number
		}	
    } 
		
	render_tablist(tab_number)
}


function get_employees(){
	$.ajax({
        url:'/get_employees',
        method:'POST',
        data: {
				_csrf: $('#_csrf').val()
		},
        success: function(data){
            if(data.status == 1){
				let html_employees = '';
                data.data.forEach((item,index) => {
					employees = Object.assign(employees, {[item._id]:`${item.name}`})
                    html_employees += `<option value="${item._id}">${item.name}</option>`
                })
				$('#select_employees').html(html_employees)
				tab_list[tab_number].employee = $("#select_employees option:first").val()
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
			url: '/get_service',
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
											<div class="card shadow-none green-card text-white pointer h-105" onclick="add_product('${item._id}')">
												<div class="card-body">
													<h5 class="card-title">${item.name}</h5>
													<p class="card-text">Mã: ${item.number_code}</p>
													<p class="card-text"><small>${convert_vnd(check_price_book(item))}</small></p>
												</div>
											</div>
								`
						}else if((index+1) == data.data.length){ // if last item
							if(index == count){ // if first card in columns
								html+= `<div class="carousel-item">
											<div class="card-columns">
												<div class="card shadow-none green-card text-white pointer h-105" onclick="add_product('${item._id}')">
													<div class="card-body">
														<h5 class="card-title">${item.name}</h5>
														<p class="card-text">Mã: ${item.number_code}</p>
														<p class="card-text"><small>${convert_vnd(check_price_book(item))}</small></p>
													</div>
												</div>
											</div>
										</div>
									`
							}else{
								html+= `<div class="card shadow-none green-card text-white pointer h-105" onclick="add_product('${item._id}')">
											<div class="card-body">
												<h5 class="card-title">${item.name}</h5>
												<p class="card-text">Mã: ${item.number_code}</p>
												<p class="card-text"><small>${convert_vnd(check_price_book(item))}</small></p>
											</div>
										</div>
									</div>
								</div>
								`
							}
						}else if ((index+1) == count){ // if last card in columns
							
							html+= `<div class="card shadow-none green-card text-white pointer h-105" onclick="add_product('${item._id}')">
											<div class="card-body">
												<h5 class="card-title">${item.name}</h5>
												<p class="card-text">Mã: ${item.number_code}</p>
												<p class="card-text"><small>${convert_vnd(check_price_book(item))}</small></p>
											</div>
										</div>
									</div>
								</div>
								`
						}else if(index == count){ // if first card in columns
							count += set_number;
							html+= `<div class="carousel-item">
										<div class="card-columns">
											<div class="card shadow-none green-card text-white pointer h-105" onclick="add_product('${item._id}')">
												<div class="card-body">
													<h5 class="card-title">${item.name}</h5>
													<p class="card-text">Mã: ${item.number_code}</p>
													<p class="card-text"><small>${convert_vnd(check_price_book(item))}</small></p>
												</div>
											</div>
								`
						}else{
							html+= `<div class="card shadow-none green-card text-white pointer h-105" onclick="add_product('${item._id}')">
										<div class="card-body">
											<h5 class="card-title">${item.name}</h5>
											<p class="card-text">Mã: ${item.number_code}</p>
											<p class="card-text"><small>${convert_vnd(check_price_book(item))}</small></p>
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

function check_price_book(item){
	if($('#select_price_book').val() != 'default'){
		if(!item.price_book){
			return item.price
		}
		let index = item.price_book.findIndex(element =>{
			return element.id == $('#select_price_book').val()
		})
		if(item.price_book[index]){
			return item.price_book[index].price_sale
		}else{
			return item.price
		}
	}else{
		return item.price
	}
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
        url:'/create_customer',
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
	tab_list[tab_number].customer_pay_cash = convert_number($('#pay_cash').val())
	tab_list[tab_number].customer_pay_card = ""
	render_tablist(tab_number)
}
function pay_both(){
	tab_list[tab_number].customer_pay_cash = convert_number($('#both_pay_cash').val())
	tab_list[tab_number].customer_pay_card = convert_number($('#both_pay_card').val())
	render_tablist(tab_number)
}
function change_payment_type(type){
	if(type == "payment_cash"){
		$('#type_cash').modal('show');
		$('#pay_cash').val(convert_vnd(tab_list[tab_number].bill_money))
		$('#both_pay_cash').val("");
		$('#both_pay_card').val("");
	}else if(type == "payment_card"){
		tab_list[tab_number].customer_pay_card = tab_list[tab_number].bill_money
		tab_list[tab_number].customer_pay_cash = ""
		$('#both_pay_cash').val("")
		$('#both_pay_card').val("")
		$('#pay_cash').val("")
		render_tablist(tab_number)
	}else{
		$('#type_both').modal('show');
		$('#pay_cash').val("")
	}
}
function check_payment(){
	if(tab_list[tab_number].item.length == 0){
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
	}else if(tab_list[tab_number].customer_pay_card == 0 && tab_list[tab_number].customer_pay_cash == 0){
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
	}else if(tab_list[tab_number].customer == ""){
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
						check_out()
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
				check_out()
			}
		})
		.catch(timer => {
			// cho vào để ko báo lỗi uncaught
		});
	}
}

function get_list_item(){
    let data = [];
    tab_list[tab_number].item.forEach((element)=>{
        data.push({
            quantity: element.quantity,
            id: element._id,
        })
    })
    return data;
}
function get_time_convert(date_time){
	console.log(date_time)
	let date = date_time.split(" ")[0];
	let time = date_time.split(" ")[1];
	return new Date(date.split("/")[1] + ' ' + date.split("/")[0] + ' ' + date.split("/")[2] + ' ' + time)
}
function check_out(){
	let data = {
		employees: tab_list[tab_number].employee,
		price_book: tab_list[tab_number].price_book,
		time: tab_list[tab_number].time_edit ? get_time_convert(tab_list[tab_number].time) : undefined,
		customer_pay_card: tab_list[tab_number].customer_pay_card,
		customer_pay_cash: tab_list[tab_number].customer_pay_cash,
		discount_id: tab_list[tab_number].discount_id,
		customer: tab_list[tab_number].customer ? tab_list[tab_number].customer.split(":")[1] : "",
		note: tab_list[tab_number].note_bill,
        list_item: get_list_item(),
        _csrf: $('#_csrf').val()
    }
	$.ajax({
		url:'/check_out',
		method:'POST',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data),
		success: function(data){
			if(data.status == 1){
				clear_data(tab_number)
				document.getElementById('printer').src = "data:text/html;charset=utf-8," + data.data;	
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
function unlock_manager(){
	$.ajax({
		url:'/check_password_manager',
		method:'POST',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({_csrf: $('#_csrf').val(), password: $('#password_manager').val()}),
		success: function(data){
			if(data.status == 1){
				$('#button_unlock_manager').hide()
				$('#button_lock_manager').show()
				$('#button_edit_bill').show()
				$('#date_sale').prop( "disabled", false );
				Swal.fire({
					toast: true,
				    position: 'top-end',
				    showConfirmButton: false,
                    title: data.message,
                    icon: "success",  
                    timer: 3000
                })
			}else{
				Swal.fire({
					toast: true,
				    position: 'top-end',
				    showConfirmButton: false,
                    title: data.error,
                    icon: "error",  
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
function lock_manager(){
	$.ajax({
		url:'/check_password_manager',
		method:'POST',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({_csrf: $('#_csrf').val(), password: ""}),
		success: function(data){
				$('#button_unlock_manager').show()
				$('#button_lock_manager').hide()
				$('#button_edit_bill').hide()
				$('#date_sale').prop( "disabled", true );
				Swal.fire({
					toast: true,
				    position: 'top-end',
				    showConfirmButton: false,
                    title: "Quản lý đã bị khóa",
                    icon: "success",  
                    timer: 3000
                }).then(()=>{
                    // cho vào để ko báo lỗi uncaught
                })
                .catch(timer => {
                    // cho vào để ko báo lỗi uncaught
                }); 
				
			
		}
	})
}
function get_customer(id){
	$.ajax({
		url:'/get_customer',
		method:'post',
        data: {id: id, _csrf: $('#_csrf').val()},
        success: function(data){
			if(data.status == 1){
                let customer = data.data.customer;
                let history_sale = data.data.history_sale;
                let service = data.data.service;
				$('#edit_customer #edit_name').val(customer.name);
				$('#edit_customer #edit_birthday').val(customer.birthday);
				$('#edit_customer #edit_note').val(customer.note),
                $('#edit_customer #edit_phone').val(customer.phone);
                $('#edit_customer #edit_gener').val(customer.gener);
				$('#edit_customer #edit_address').val(customer.address);
				$('#edit_customer #edit_id').val(customer._id);
                let html_history_sale = `<table class="table table-sm  table-hover" style="display: block; overflow-x: auto;">
                                        <thead>
                                            <tr>
                                            <th width="20%">Ngày</th>
											<th width="15%">Số Hóa đơn</th>
                                            <th width="40%">Mua hàng</th>
                                            <th width="20%">Nhân viên bán</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                
                history_sale.forEach((item, index)=>{
                    html_history_sale+=`<tr>
                            <td width="20%">${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
							<td width="15%">${item.serial}</td>
							<td width="40%">`
                            history_sale[index].list_item.forEach(sale=>{
                            html_history_sale += `<p style="margin-bottom:0px;">${sale.id.name} (${sale.id.number_code}): ${sale.quantity}</p>`
                        })        
                    html_history_sale +=    `</td><td width="20%">${item.employees.name}</td>
                            </tr>`
                })
                html_history_sale+=`</tbody>
                            </table>
                        `;
                $('#edit-history-payment-tab').html(html_history_sale);
                let html_service= `<table class="table table-sm  table-hover">
                                    <thead>
                                        <tr>
                                        <th>Dịch vụ</th>
                                        <th>Mã</th>
										<th>Số lần</th>
										<th>Đã dùng</th>
										<th></th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                service.forEach((item)=>{
                    html_service+=`<tr>
                            <td>${item.service.name}</td>
                            <td>${item.serial}</td>
							<td>${item.times == 99999 ? 'Trọn đời' : item.times}</td>
							<td>${item.times_used}</td>
							<td><button type="button" class="btn btn-warning" onclick="use_service('${item._id}','${item.service.name}','${item.service._id}','${customer._id}')">Sử dụng</button></td>
                            </tr>`
                })
                html_service+=`</tbody>
                            </table>
                        `;
                $('#edit-service-tab').html(html_service);
            }
		}
	})
}
function use_service(invoice,service_name, service, customer){
	Swal.fire({
        title: `Bạn xác nhận sử dụng đúng dịch vụ: [${service_name}] ?`,
        text: "Sau khi sử dụng sẽ không hoàn lại được ?",
	    input: 'select',
	    inputOptions: employees,
	    inputPlaceholder: 'Chọn nhân viên thực hiện',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
		cancelButtonText: 'Không',
        confirmButtonText: 'Sử dụng',
		inputValidator: function (value) {
			return new Promise(function (resolve, reject) {
			  if (value != '') {
				resolve()
			  } else {
				resolve('Bạn chưa chọn nhân viên thực hiện dịch vụ')
			  }
			})
		  }
	}).then(function (result) {
		if(result.value){
			$.ajax({
				url:'/use_service',
				method:'post',
				data: {employees: result.value, invoice: invoice, service: service, customer:customer, _csrf: $('#_csrf').val()},
				success: function(data){
					get_customer(customer)
				}
			})
		}
    });
}

/*
	tab_list is array, if delete will sort order
	tab_number is interface user
	index_tab is interface array
	find by element HD in array tab_list
*/

function remove_tab_menu(btw){
	let tab = $(btw).parent().text().trim() // get string tab <a>
	let number_tab = tab.split(" ")[1] // get number tab
	let index_tab = tab_list.findIndex(item => item.HD == number_tab); // find number tab in tab_list
	tab_list.splice(index_tab,1);// remove in tab_list
	$(btw).parent().remove();// remove 
	$("#tab-menu-horizontal .menu-bill").removeClass("active");
	$("#tab-menu-horizontal .menu-bill").first().addClass("active");
	tab_max_current = Math.max.apply(Math, tab_list.map(function(item) { return item.HD; }))
	document.getElementById('tab-menu-horizontal').scrollLeft -= 1000;
	if(tab_list.length == 0){
		tab_number = 0;
		tab_max_current = 1;
		let html = `<li class="menu-bill active">
						<a class="item pointer" onclick="active_tab_menu(this);">HD ${tab_max_current}</a>
						<span style="margin-left:5px;" onclick="remove_tab_menu(this);"><i class="fas fa-times"></i></span>
					</li>`
		tab_list.push({
			HD:tab_max_current,
			item:[], 
			time: "",
			id:"",
			edit_bill: false,
			time_edit: false,
			employee: $("#select_employees option:first").val(), 
			customer:"", 
			bill_money: "", 
			discount_type:"",
			money_discount: "", 
			discount_id:"",
			number_code_discount:"",
			discount_value:"",
			total_sale:"", 
			customer_pay_card:"", 
			customer_pay_cash:"", 
			money_return:"",
			note_bill: "",
			price_book: "default",
		})
		$('#tab-menu-horizontal').append(html)
	}
	tab_number = 0;
	render_tablist(tab_number);
}

function active_tab_menu(btw){
	let tab = $(btw).text().trim()
	let number_tab = tab.split(" ")[1]
	let index_tab = tab_list.findIndex(item => item.HD == number_tab);
	if(index_tab == -1){
		index_tab = tab_list.findIndex(item => item.HD == tab);
	}
	$("#tab-menu-horizontal .menu-bill").removeClass("active");
	$(btw).parent().addClass("active");
	tab_number = index_tab
	render_tablist(index_tab)
}
function add_tab_menu(){
	if(tab_list.length <= 9){
		tab_max_current++;
		$("#tab-menu-horizontal .menu-bill").removeClass("active");
		tab_number = tab_max_current-1;
		let html = `<li class="menu-bill active">
						<a class="item pointer" onclick="active_tab_menu(this);">HD ${tab_max_current}</a>
						<span style="margin-left:5px;" onclick="remove_tab_menu(this);"><i class="fas fa-times"></i></span>
					</li>`
		tab_list.push({
			HD: tab_max_current,
			item:[], 
			time: "",
			id:"",
			edit_bill: false,
			time_edit: false,
			employee: $("#select_employees option:first").val(), 
			customer:"", 
			bill_money: "", 
			discount_type:"",
			money_discount: "", 
			discount_id:"",
			number_code_discount:"",
			discount_value:"",
			total_sale:"", 
			customer_pay_card:"", 
			customer_pay_cash:"", 
			money_return:"",
			note_bill: "",
			price_book: "default"
		})
		render_tablist(tab_number);
		$('#tab-menu-horizontal').append(html);
		document.getElementById('tab-menu-horizontal').scrollLeft += 1000;
	}
	
	
}
function get_invoice_sale(paging_num){
    if(!paging_num){
        paging_num = page_now
    }
    let data = {
        paging_num:paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/invoice_sales',
        method:'GET',
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
		                    <table class="table table-hover">
		                        <thead>
                                    <tr>
									<th>Ngày</th>
                                    <th>Mã hóa đơn</th>
									<th>Nhân viên</th>
                                    <th>Khách hàng</th>
									<th></th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{ 
		let date = new Date(item.createdAt).toLocaleString("vi-VN")
		html+=`<tr>
                <td>${date.split(",")[0]}<br>
					${date.split(",")[1]}
				</td>
				<td class="font-weight-bold">${item.serial}</td>
                <td>${item.employees.name}</td>
				<td>${item.customer ? item.customer.name : "Khách lẻ"}</td>
				<td><button type="button" onclick="view_bill(this,'${item._id}')" class="btn btn-primary view-button">Xem</button>
					<button type="button" onclick="edit_bill('${item._id}')" class="btn btn-warning">Sửa</button>
				</td>
                </tr>
				<tr>
					<td colspan="5" class="view-bill" id="view_bill_${item._id}" style="display:none">
						<ul class="nav nav-tabs" role="tablist">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="pill"
									href="#view-list_item-${item._id}" role="tab" data-toggle="tab"
									aria-selected="true">Sản phẩm bán</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="pill" href="#view-bill-${item._id}" role="tab"
									data-toggle="tab" aria-selected="false">Thanh toán</a>
							</li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane fade active show" id="view-list_item-${item._id}" role="tabpanel">
				`
				item.list_item.forEach((item)=>{
					html+=`<p style="margin-bottom:0px;">${item.id.name} (${item.id.number_code}): ${item.quantity} <span class="float-right">Giá: ${item.price_sale? convert_vnd(item.price_sale) + ' ( Giá gốc: ' + convert_vnd(item.price) + ')' : convert_vnd(item.price)}</span></p>` 
                })
		html+=`			</div>
							<div class="tab-pane fade" id="view-bill-${item._id}" role="tabpanel">
							   <p style="margin-bottom:0px;"> Tổng tiền: <span class="float-right">${convert_vnd(item.payment)}</span></p>
			  `
			  	item.bill.forEach((item)=>{
					html+=`<p style="margin-bottom:0px;">${item.type_payment == "card" ? 'Thẻ: <span class="float-right">' + convert_vnd(item.money) : 'Tiền mặt: <span class="float-right">' + convert_vnd(item.money)}</span></p>` 
				})
		html+=`					<p style="margin-bottom:0px;"> Tiền thối: <span class="float-right">${convert_vnd(item.payment_back)}</span></p>
							</div>
						</div>
					</td>
				</tr>
			`
    })
    html+=`</tbody>
                </table>
            `;
    $('#show_bill_edit').html(html);
    let pageination = ''

    if (pageCount > 1) {
        let i = Number(currentPage) > 5 ? (Number(currentPage) - 4) : 1
        pageination += `<ul class="pagination pagination-sm m-0 float-right">`
        if (currentPage == 1){
            pageination += `<li class="page-item disabled"><a class="page-link" href="#"><<</a></li>`  
        }else{
            pageination += `<li class="page-item"><a class="page-link" onclick="get_invoice_sale('1')"><<</a></li>`  
        }
        if (i != 1) {
            pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
        }
        for (; i<= (Number(currentPage) + 4) && i <= pageCount; i++) {
    
            if (currentPage == i) {
                pageination += `<li class="page-item active"><a class="page-link">${i}</a></li>`
            } else {
                    pageination += `<li class="page-item"><a class="page-link" onclick="get_invoice_sale('${i}')">${i}</a></li>`
            }
            if (i == Number(currentPage) + 4 && i < pageCount) {
                pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
                break
            }
        }
        if (currentPage == pageCount){
            pageination += `<li class="page-item disabled"><a class="page-link"">>></a></li>`
        }else{
            pageination += `<li class="page-item"><a class="page-link" onclick="get_invoice_sale('${i-1}')">>></a></li>`
        }
            
        pageination += `</ul>`
    }   
    $("#pagination").html(pageination)
}
function view_bill(btn,id){
	if($(btn).text() == "Xem"){
		$('.view-button').text("Xem")
		$(btn).text("Đóng")
		$('.view-bill').hide();
		$(`#view_bill_${id}`).show();
	}else{
		$(btn).text("Xem")
		$(`#view_bill_${id}`).hide();
	}
}
function edit_bill(id){
	$.ajax({
        url:`/invoice_sales/${id}`,
        method:'GET',
        data: {_csrf: $('#_csrf').val()},
        success: function(data){
            if(data.status == 1){
				tab_max_current++;
				$("#tab-menu-horizontal .menu-bill").removeClass("active");
				tab_number = tab_max_current-1;
				let html = `<li class="menu-bill active">
								<a class="item pointer" style="font-size: 11px" onclick="active_tab_menu(this);">${data.data.serial}</a>
								<span style="margin-left:5px;" onclick="remove_tab_menu(this);"><i class="fas fa-times"></i></span>
							</li>`
				let cash = data.data.bill.filter(item =>{
					return item.type_payment === 'cash'
				})
				let card = data.data.bill.filter(item =>{
					return item.type_payment === 'card'
				})
				let time_creater = new Date(data.data.createdAt)
				let conver_time = ('0'+ time_creater.getDate()).slice(-2) + '/'+ ('0' + (time_creater.getMonth()+1)).slice(-2) + '/' + time_creater.getFullYear() + ' ' + ('0' + time_creater.getHours()).slice(-2) + ":" + ('0' + time_creater.getMinutes()).slice(-2)
				$('#date_sale').val(('0'+ time_creater.getDate()).slice(-2) + '/'+ ('0' + (time_creater.getMonth()+1)).slice(-2) + '/' + time_creater.getFullYear() + ' ' + ('0' + time_creater.getHours()).slice(-2) + ":" + ('0' + time_creater.getMinutes()).slice(-2))
				tab_list.push({
					HD: data.data.serial, 
					item: data.data.list_item.map(item =>{
						item = Object.assign(item.id, {quantity: item.quantity}, {price: item.price})
						return item
					}),
					time: conver_time,
					id: data.data._id,
					edit_bill: true,
					time_edit: true,
					employee: data.data.employees, 
					customer: `${data.data.customer.name}:${data.data.customer._id}`, 
					bill_money: "", 
					discount_type:"",
					money_discount: "", 
					discount_id:"",
					number_code_discount:"",
					discount_value:"",
					total_sale:"", 
					customer_pay_card: card.length > 0 ? card[0].money: 0, 
					customer_pay_cash: cash.length > 0 ? cash[0].money: 0, 
					money_return:"",
					note_bill: "",
					price_book: "default"
				});
				render_tablist(tab_number)
				$('#tab-menu-horizontal').append(html);
				document.getElementById('tab-menu-horizontal').scrollLeft += 1000;
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
function clear_data(index_tab){
	let number_tab = tab_list[index_tab].HD
	remove_tab_menu($(`a:contains('HD ${number_tab}')`))
	render_tablist(tab_number)
}
function slideLeft(){
	document.getElementById('tab-menu-horizontal').scrollLeft -= 70;
}
function slideRight(){
	document.getElementById('tab-menu-horizontal').scrollLeft += 70;
}