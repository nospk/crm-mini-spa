$( document ).ready(()=>{
    get_data();
    get_store_groupCustomer();
})
let page_now;
const show_type = type =>{
    if(type == "product")   return "Sản Phẩm"
    else if (type == "service") return "Dịch vụ"
    else return "Combo"
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
function get_store_groupCustomer(){
	 $.ajax({
        url:'/admin_price_book/get_store_groupCustomer',
        method:'POST',
        data: {_csrf: $('#_csrf').val()},
        success: function(data){
			console.log(data)
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

    let data = {    
        name: $('#name').val().trim(),
        date_from: $('#date_from').val(),
        date_to: $('#date_to').val(),
		store: $('#select_store').val(),
        groupCustomer: $('#select_group_customer').val(),
        _csrf: $('#_csrf').val()
    }

    $.ajax({
        url:'/admin_price_book/create',
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
function save_price_default(btn){
	let input = $(btn).attr('id')
	let price = $(btn).val()
	let id = input.slice(6)
	$.ajax({
        url:'/admin_price_book/save_price_default',
        method:'POST',
        data: {
			price_book: $('#select_price_book').val(),
			_csrf:$('#_csrf').val(),
			id: id,
			price: price
		},
        success: function(data){
            if(data.status == 1){
                toastr.success(data.message,
				{
					timeOut: 1000,
					fadeOut: 1000,
					onShow: function () {
						get_data();
					}
				})
				get_data()
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
				<td><input type="currency" class="form-control" style="text-align: right;"value="${convert_vnd(item.price)}" onchange="save_price_default(this)" id="price-${item._id}" placeholder="Nhập giá"
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

function get_data(paging_num){
    if(!paging_num){
        paging_num = page_now
    }
    let data = {
        search:$('#select_price_book').val(),
        paging_num:paging_num,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_price_book/get',
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


