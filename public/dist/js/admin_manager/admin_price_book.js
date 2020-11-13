$( document ).ready(()=>{
    get_data();
	get_price_book();
    get_store_groupCustomer();
	$('#select_price_book').on('change', function() {
	  if(this.value == "default"){
		  $('#show_select_item').hide()
	  }else{
		  $('#show_select_item').show()
	  }
	});
})
let page_now;
const show_type = type =>{
    if(type == "product")   return "Sản Phẩm"
    else if (type == "service") return "Dịch vụ"
    else return "Combo"
}
function get_items(){
	 $.ajax({
        url:'/admin_price_book/get_items',
        method:'POST',
        data: {price_book: $('#select_price_book').val(), _csrf: $('#_csrf').val()},
        success: function(data){
            if(data.status == 1){
                let html = "";
				data.data.forEach(item =>{
					html +=`<option value="${item._id}">${item.name}</option>`
				})
				$('#select_item').html(html)
				$('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
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
function add_item(){
	console.log($('#select_item').val())
	if($('#select_item').val() != null){
		$.ajax({
			url:'/admin_price_book/add_item',
			method:'POST',
			data: {price_book:$('#select_price_book').val(), id: $('#select_item').val(), _csrf: $('#_csrf').val()},
			success: function(data){
				if(data.status == 1){
					get_data()
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


function get_store_groupCustomer(){
	 $.ajax({
        url:'/admin_price_book/get_store_groupCustomer',
        method:'POST',
        data: {_csrf: $('#_csrf').val()},
        success: function(data){
            if(data.status == 1){
                let html_store = "";
				let html_groupCustomer = "";
				data.data.stores.forEach(item =>{
					html_store +=`<option value="${item._id}">${item.name}</option>`
				})
				$('#select_store').html(html_store)
				data.data.groupCustomer.forEach(item =>{
					html_groupCustomer +=`<option value="${item._id}">${item.name}</option>`
				})
				$('#select_group_customer').html(html_groupCustomer)
				$('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
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
function create_new(){
	let date_from = $('#date_from').val()
	date_from = date_from.split(" ");
	let time_from = date_from[1]
	date_from = date_from[0].split("/")
	let new_date_from = `${date_from[1]}/${date_from[0]}/${date_from[2]} ${time_from}`
	let date_to = $('#date_to').val()
	date_to = date_to.split(" ");
	let time_to = date_to[1]
	date_to = date_to[0].split("/")
	let new_date_to = `${date_to[1]}/${date_to[0]}/${date_to[2]} ${time_to}`
    let data = {    
        name: $('#name').val().trim(),
        date_from: new_date_from,
        date_to: new_date_to,
		store: $('#select_store').val(),
        groupCustomer: $('#select_group_customer').val(),
        _csrf: $('#_csrf').val()
    }

    $.ajax({
        url:'/admin_price_book/create_price_book',
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
					get_price_book();
                })
                .catch(timer => {
					get_price_book();
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
function save_price(btn){
	let input = $(btn).attr('id')
	let price = $(btn).val()
	let id = input.slice(6)
	$.ajax({
        url:'/admin_price_book/save_price',
        method:'POST',
        data: {
			price_book: $('#select_price_book').val(),
			_csrf:$('#_csrf').val(),
			id: id,
			price: price
		},
        success: function(data){
            if(data.status == 1){
                toastr.success(data.message)
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
function find_price_book(array){
	let index = array.findIndex(item =>{
		return item.id == $('#select_price_book').val()
	})
	return convert_vnd(array[index].price_sale)
}
function render_data_default(data, pageCount, currentPage){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
									<th>Mã số</th>
                                    <th width="20%">Tên</th>
									<th>Loại</th>
									<th witdh="20%">Giá vốn</th>
                                    <th witdh="10%"style="text-align:right">Giá bán</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
				<td>${item.number_code}</td>
                <td>${item.name}</td>
				<td>${show_type(item.type)}</td>
				<td>${convert_vnd(item.cost_price)}</td>
				<td><input type="currency" class="form-control" style="text-align: right;"value="${convert_vnd(item.price)}" onchange="save_price(this)" id="price-${item._id}" placeholder="Nhập giá"
								aria-label="Price"></td>
                </tr>`
    })
    html+=`</tbody>
                </table>
            `;
    $('#show_data').html(html);
	const currencyInput = document.querySelectorAll('input[type="currency"]')
    currencyInput.forEach(function(element) {
        element.addEventListener('focus', onFocus)
        element.addEventListener('blur', onBlur)
    });
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
function render_data(data, pageCount, currentPage){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
									<th>Mã số</th>
                                    <th>Tên</th>
									<th>Loại</th>
									<th>Giá vốn</th>
                                    <th>Giá bán</th>
									<th style="text-align:right">Giá khuyến mãi</th>
									<th></th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
				<td>${item.number_code}</td>
                <td>${item.name}</td>
				<td>${show_type(item.type)}</td>
				<td>${convert_vnd(item.cost_price)}</td>
				<td><span type="currency">${convert_vnd(item.price)}</span></td>
				<td><input type="currency" class="form-control" style="text-align: right;"value="${find_price_book(item.price_book)}" onchange="save_price(this)" id="price-${item._id}" placeholder="Nhập giá"
								aria-label="Price"></td>
				<td><button type="button" onclick="delete_item(this)" id="delete-${item._id}"class="btn btn-danger"><i class="fas fa-times"></i></button></td>
                </tr>`
    })
    html+=`</tbody>
                </table>
            `;
    $('#show_data').html(html);
	const currencyInput = document.querySelectorAll('input[type="currency"]')
    currencyInput.forEach(function(element) {
        element.addEventListener('focus', onFocus)
        element.addEventListener('blur', onBlur)
    });
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
function get_price_book(){
	$.ajax({
        url:'/admin_price_book/get_price_book',
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
function get_data(paging_num){
    if(!paging_num){
        paging_num = page_now
    }
	if($('#select_price_book').val() != 'default'){
		get_items();
	}
    let data = {
        search:$('#select_price_book').val(),
        paging_num:paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_price_book/get_data',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                page_now = data.data.currentPage
				if($('#select_price_book').val() == 'default'){
					render_data_default(data.data.data, data.data.pageCount, data.data.currentPage);
				}else{
					render_data(data.data.data, data.data.pageCount, data.data.currentPage);
				}
                
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
function delete_item(btn){
	let input = $(btn).attr('id')
	let id = input.slice(7)
	$.ajax({
			url:'/admin_price_book/delete_item',
			method:'POST',
			data: {price_book:$('#select_price_book').val(), id: id, _csrf: $('#_csrf').val()},
			success: function(data){
				if(data.status == 1){
					get_data()
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

