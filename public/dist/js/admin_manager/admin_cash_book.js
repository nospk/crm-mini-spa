
let page_now;
let active_type = "cash"
$( document ).ready(()=>{
	getStoreSupplierCustomerEmployees();
	$("#select_type_receiver").change(()=>{
		if($("#select_type_receiver").val() == "employees"){
			$("#show_employees").show();
		}else{
			$("#show_employees").hide();
		}
		if($("#select_type_receiver").val() == "supplier"){
			$("#show_supplier").show();
		}else{
			$("#show_supplier").hide();
		}
		if($("#select_type_receiver").val() == "customers"){
			$("#show_customers").show();
		}else{
			$("#show_customers").hide();
		}
	})
	$("#isForCompany").change(()=>{
		if($("#isForCompany").val() == "true"){
			$("#show_stores").hide();
		}else{
			$("#show_stores").show();
		}
	})
	$("#select_type").change(()=>{
		if($("#select_type").val() == "income"){
			$("#select_group_income").show();
			$("#select_group_outcome").hide();
		}else{
			$("#select_group_income").hide();
			$("#select_group_outcome").show();
		}
	})
	$("#search_find_selection").change(()=>{
		if($("#search_find_selection").val() == "company"){
			$("#search_find_store").hide();
		}else{
			$("#search_find_store").show();
		}
	})
	const currencyInput = document.querySelector('input[type="currency"]')
	currencyInput.addEventListener('focus', onFocus)
	currencyInput.addEventListener('blur', onBlur)
	setTimeout(function (){get_data('1','cash')}, 100); 
})

function get_data(paging_num, type){
    if(!paging_num){
        paging_num = page_now
    }
    if(!type){
        type = active_type
    }else{
        active_type = type
    }
	let time = $('#reservation').val().split("-");
	let start_time = time[0]
	let end_time = time[1]
    let data = {
		search_find_selection: $("#search_find_selection").val(),
        search_find_store: $("#search_find_store").val(),
		start_time: start_time,
		end_time: end_time,
        type_payment: type,
        search_find_type: $("#search_find_type").val(),
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
                render_data(data.data.data, data.data.pageCount, data.data.currentPage, type);
                let begin_fund = data.data.begin_fund[0] ? data.data.begin_fund[0].totalincome - data.data.begin_fund[0].totaloutcome : 0
                let total_income = data.data.current_fund[0] ? data.data.current_fund[0].totalincome : 0
                let total_outcome = data.data.current_fund[0] ? data.data.current_fund[0].totaloutcome : 0
                let after_fund = begin_fund - total_outcome + total_income
				$('#begin_fund').html(convert_vnd(begin_fund))
				$('#total_income').html(convert_vnd(total_income))
				$('#total_outcome').html(convert_vnd(total_outcome))

                
				$('#after_fund').html(convert_vnd(after_fund))
                if(type=="cash"){
                    $('#showDataCash').show()
                    $('#showDataCard').hide()
                    $('#showDataBoth').hide()
                }else if(type == "card"){
                    $('#showDataCash').hide()
                    $('#showDataCard').show()
                    $('#showDataBoth').hide()
                }else{
                    $('#showDataCash').hide()
                    $('#showDataCard').hide()
                    $('#showDataBoth').show()
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
function getStoreSupplierCustomerEmployees(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_cash_book/getStoreSupplierCustomerEmployees',
        method: 'POST',
		contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (data) {
            if (data.status == 1) {
                let html_suppliers = ""
                let html_employees = ""
				let html_stores = ""
				let html_customers = ""
                data.data.suppliers.forEach(item => {
                    html_suppliers += `<option value="${item.name} :${item._id}">${item.name}</option>`
                })
                data.data.employees.forEach(item => {
                    html_employees += `<option value="Tên NV ${item.name} - Mã ${item.number_code}:${item._id}">${item.name}</option>`
                })
				data.data.customers.forEach(item => {
                    html_customers += `<option value="${item.name} - Số ĐT ${item.phone}:${item._id}">${item.name}</option>`
                })
				data.data.stores.forEach(item => {
                    html_stores += `<option value="${item._id}">${item.name}</option>`
                })
                $('#select_supplier').html(html_suppliers)	
				$('#search_find_store').html(html_stores)
				$('#select_customer').html(html_customers)
                $('#select_employees').html(html_employees)
				$('#select_store').html(html_stores)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function render_data(data, pageCount, currentPage, type){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Ngày</th>
                                    <th>Mã phiếu</th>
                                    <th>Loại</th>
                                    <th>Nhóm</th>
                                    <th>Người tạo</th>
                                    <th>Nơi nhận/thanh toán</th>
                                    <th>Ghi chú</th>
                                    <th style="text-align: right;">Tiền</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                <td>${item.serial}</td>
                <td>${item.type == "income" ? "Thu" : "Chi"}</td>
                <td>${item.group}</td>
				<td>${(item.user_created)}</td>
                <td>${item.member_name}</td>
                <td>${item.note ? reduce_string(item.note) : ""}</td>
                <td style="text-align: right;">${item.type == "income" ? convert_vnd(item.money) : convert_vnd(item.money * -1)}</td>
                </tr>`
    })
    html+=`</tbody>
                </table>
            `;
    if(type=="cash"){
        $('#showDataCash').html(html);
    }else if(type == "card"){
        $('#showDataCard').html(html);
    }else{
        $('#showDataBoth').html(html);
    }
    let pageination = ''

    if (pageCount > 1) {
        let i = Number(currentPage) > 5 ? (Number(currentPage) - 4) : 1
        pageination += `<ul class="pagination pagination-sm m-0 float-right">`
        if (currentPage == 1){
            pageination += `<li class="page-item disabled"><a class="page-link" href="#"><<</a></li>`  
        }else{
            pageination += `<li class="page-item"><a class="page-link" onclick="get_data('1','${type}')"><<</a></li>`  
        }
        if (i != 1) {
            pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
        }
        for (; i<= (Number(currentPage) + 4) && i <= pageCount; i++) {
    
            if (currentPage == i) {
                pageination += `<li class="page-item active"><a class="page-link">${i}</a></li>`
            } else {
                    pageination += `<li class="page-item"><a class="page-link" onclick="get_data('${i}', '${type}')">${i}</a></li>`
            }
            if (i == Number(currentPage) + 4 && i < pageCount) {
                pageination += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`
                break
            }
        }
        if (currentPage == pageCount){
            pageination += `<li class="page-item disabled"><a class="page-link"">>></a></li>`
        }else{
            pageination += `<li class="page-item"><a class="page-link" onclick="get_data('${i-1}', '${type}')">>></a></li>`
        }
            
        pageination += `</ul>`
    }   
    $("#pagination").html(pageination)
}

function create_new(){
    let data = {
        time: get_time_convert($('#date').val()),
        type: $('#create_new #select_type').val(),
        type_payment: $('#create_new #select_type_payment').val(),
        type_receiver: $('#create_new #select_type_receiver').val(),
        select_supplier: $('#create_new #select_supplier').val(),
        select_employees: $('#create_new #select_employees').val(),
		select_customer: $('#create_new #select_customer').val(),
        isForCompany: $('#create_new #isForCompany').val() == "true" ? true : false,
		select_store: $('#create_new #select_store').val(),
		payment: convert_number($('#create_new #payment').val()),
        note: $('#create_new #note').val().trim(),
        accounting: $('#create_new #accounting').is(":checked"),
		group: $("#select_type").val() == "income" ? $("#select_group_income").val() : $("#select_group_outcome").val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_cash_book/create',
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
					get_data('1',$('#create_new #select_type_payment').val());
                })
                .catch(timer => {
					get_data('1',$('#create_new #select_type_payment').val());
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