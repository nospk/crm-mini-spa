
let page_now;
$( document ).ready(()=>{
    get_data();
	getStoreSupplierEmployees();
	$("#select_type_receiver").change(()=>{
		if($("#select_type_receiver").val() == "employees"){
			$("#show_supplier").hide();
			$("#show_employees").show();
		}else{
			$("#show_supplier").show();
			$("#show_employees").hide();
		}
	})
	$("#select_cost_for").change(()=>{
		if($("#select_cost_for").val() == "Company"){
			$("#show_stores").hide();
		}else{
			$("#show_stores").show();
		}
	})
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
        url:'/admin_cash_book/get_data',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                page_now = data.data.currentPage
                render_data(data.data.data, data.data.pageCount, data.data.currentPage, data.data.company);
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
function getStoreSupplierEmployees(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_cash_book/getStoreSupplierEmployees',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                let html_suppliers = ""
                let html_employees = ""
				let html_stores = ""
                data.data.suppliers.forEach(item => {
                    html_suppliers += `<option value="${item.name}">${item.name}</option>`
                })
                data.data.employees.forEach(item => {
                    html_employees += `<option value="Tên:${item.name} - Mã:${item.number_code}">${item.name}</option>`
                })
				data.data.stores.forEach(item => {
                    html_stores += `<option value="${item._id}">${item.name}</option>`
                })
                $('#select_supplier').html(html_suppliers)
                $('#select_employees').html(html_employees)
				$('#select_store').html(html_stores)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function render_data(data, pageCount, currentPage, company){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Ngày</th>
									<th>Mã phiếu</th>
                                    <th>Loại</th>
                                    <th>Người tạo</th>
                                    <th>Người nhận/thanh toán</th>
									<th>Nơi nhận/thanh toán</th>
                                    <th>Ghi chú</th>
                                    <th style="text-align: right;">Tiền</th>
									<th style="text-align: right;">Tồn Quỹ</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${new Date(item.createdAt).toLocaleString()}</td>
				<td>${item.serial}</td>
                <td>${item.group}</td>
				<td>${(item.user_created)}</td>
                <td>${item.member_name}</td>
				<td>${item.isCostForCompany == true ? company : item.store.name}</td>
                <td>${item.note ? item.note : ""}</td>
                <td style="text-align: right;">${item.type == "income" ? item.money.toLocaleString() : (item.money * -1).toLocaleString()} đồng</td>
				<td style="text-align: right;">${item.current_money.toLocaleString()} đồng</td>
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
function create_new(){
    let data = {
        type: $('#create_new #select_type').val(),
        type_receiver: $('#create_new #select_type_receiver').val(),
        select_supplier: $('#create_new #select_supplier').val(),
        select_employees: $('#create_new #select_employees').val(),
        cost_for: $('#create_new #select_cost_for').val(),
		select_store: $('#create_new #select_store').val(),
		note: $('#create_new #note').val().trim(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_cash_book/create',
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