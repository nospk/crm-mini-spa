
let page_now;
$( document ).ready(()=>{
    get_data();
	getSupplierAndEmployees();
	$("#select_type_receiver").change(()=>{
		if($("#select_type_receiver").val() == "employees"){
			$("#show_supplier").hide();
			$("#show_employees").show();
		}else{
			$("#show_supplier").show();
			$("#show_employees").hide();
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
function getSupplierAndEmployees(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_cash_book/getSupplierAndEmployees',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                let html_supplier = ""
                let html_employees = ""
                data.data.supplier.forEach(item => {
                    html_supplier += `<option value="${item._id}">${item.name}</option>`
                })
                data.data.employees.forEach(item => {
                    html_employees += `<option value="${item._id}">${item.name}</option>`
                })
                $('#select_supplier').html(html_supplier)
                $('#select_employees').html(html_employees)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function render_data(data, pageCount, currentPage){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Ngày</th>
									<th>Mã phiếu</th>
                                    <th>Loại thu/chi</th>
                                    <th>Người lập</th>
                                    <th>Người nhận/thanh toán</th>
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
                <td>${item.type == "income" ? "Thu" : "Chi"}</td>
				<td>${(item.who_created)}</td>
                <td>${item.who_receiver}</td>
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
