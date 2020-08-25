
$( document ).ready(()=>{
	get_product();
})
let page_now;
function get_product(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_stock/get',
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
function render_data(data, pageCount, currentPage){
	let html = `        
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Tên</th>
									<th>Mã số</th>
                                    <th>Trạng thái</th>
									<th>Tổng Tồn kho</th>
									<th>Hàng chưa phân loại</th>
									<th>Hàng bán</th>
									<th>Hàng dịch vụ</th>
                                    <th>Hành Động</th>
                                    </tr>
		                        </thead>	
		                        <tbody>`;
	data.forEach(item =>{
		console.log(item.quantity)
		html+=`<tr>
                <td>${item.name}</td>
                <td>${item.number_code}</td>
				<td>${item.isSale ? "Đang kinh doanh" : "Ngừng kinh doanh"}</td>
				<td>${item.stocks_in_store[0].quantity}</td>
				<td>${item.stocks_in_store[0].product_of_undefined}</td>
				<td>${item.stocks_in_store[0].product_of_sale}</td>
				<td>${item.stocks_in_store[0].product_of_service}</td>
                <td></td>
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
function update_store(){
    let data = {
		name:  $('#name').val(),
		address: $('#address').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_stock/update_store',
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
                        location.reload();
                    })
                    .catch(timer => {
                        location.reload();
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