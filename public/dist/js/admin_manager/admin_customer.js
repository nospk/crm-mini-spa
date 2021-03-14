$( document ).ready(()=>{
    get_data();
    $('#birthday').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' })
	$('[data-mask]').inputmask()
})
let page_now;

function create_new(){
    let data = {
        name: $('#create_new #name').val().trim(),
        birthday: $('#create_new #birthday').val().trim(),
        gener: $('#create_new #gener').val(),
        address: $('#create_new #address').val().trim(),
        phone: $('#create_new #phone').val().trim(),
		note: $('#create_new #note').val().trim(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_customer/create',
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
function render_data(data, pageCount, currentPage){
	let html = `        
		                    <table class="table table-hover">
		                        <thead>
                                    <tr>
                                    <th>Tên</th>
                                    <th>Sinh nhật</th>
                                    <th>Giới tính</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
									<th>Điểm</th>
									<th>Nợ</th>
									<th>Tổng mua hàng</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr onclick="edit_data('${item._id}')">
                <td>${item.name}</td>
                <td>${item.birthday}</td>
                <td>${item.gener == "male" ? "Nam" : "Nữ"}</td>
                <td>${item.phone}</td>
                <td>${reduce_string(item.address)}</td>
				<td>${item.point - item.point_used}</td>
				<td>${convert_vnd(item.debt)}</td>
				<td>${convert_vnd(item.payment)}</td>
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
function get_data(paging_num){
    $('#create_new #name').val("")
    $('#create_new #birthday').val("")
    $('#create_new #phone').val("")
    $('#create_new #address').val("")
	$('#create_new #note').val("")
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
        url:'/admin_customer/get',
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

function edit_data(id){
	$.ajax({
		url:'/admin_customer/edit_data',
		method:'post',
        data: {id: id, _csrf: $('#_csrf').val()},
        success: function(data){
			if(data.status == 1){
                let customer = data.data.customer;
                let history_sale = data.data.history_sale;
                let service = data.data.service;
				$('#edit_data #edit_name').val(customer.name);
				$('#edit_data #edit_birthday').val(customer.birthday);
				$('#edit_data #edit_note').val(customer.note),
                $('#edit_data #edit_phone').val(customer.phone);
                $('#edit_data #edit_gener').val(customer.gener);
				$('#edit_data #edit_address').val(customer.address);
				$('#edit_data #edit_id').val(customer._id);
                $('#edit_data').modal('show');
                let html_history_sale = `<table class="table table-sm  table-hover">
                                        <thead>
                                            <tr>
                                            <th>Ngày</th>
											<th>Số Hóa đơn</th>
                                            <th>Mua hàng</th>
                                            <th>Nhân viên bán</th>
                                            <th>Số tiền</th>
                                            <th>Mã giảm giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                
                history_sale.forEach((item, index)=>{
                    html_history_sale+=`<tr>
                            <td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
							<td>${item.serial}</td>
							<td>`
                            history_sale[index].list_item.forEach(sale=>{
                                console.log(sale)
                            html_history_sale += `<p style="margin-bottom:0px;">${sale.id.name} (${sale.id.number_code}): ${sale.quantity}</p>`
                        })        
                    html_history_sale +=    `</td><td>${item.employees.name}</td>
                            <td>${convert_vnd(item.payment)}</td>
                            <td>${item.discount ? item.discount.number_code : ""}</td>
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
                                        </tr>
                                    </thead>
                                    <tbody>`;
                service.forEach((item)=>{
                    html_service+=`<tr>
                            <td>${item.service.name}</td>
                            <td>${item.serial}</td>
							<td>${item.times}</td>
							<td>${item.times_used}</td>
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
function update_data(){
	let data = {
        name: $('#edit_data #edit_name').val().trim(),
        birthday: $('#edit_data #edit_birthday').val().trim(),
        address: $('#edit_data #edit_address').val().trim(),
        phone: $('#edit_data #edit_phone').val().trim(),
        gener:  $('#edit_data #edit_gener').val(),
        note: $('#edit_data #edit_note').val().trim(),
		id: $('#edit_data #edit_id').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_customer/update_data',
        method:'put',
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