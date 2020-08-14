$( document ).ready(()=>{
	get_data();
})
let page_now;
const reduce_string = (string)=>{
    if(string.length > 25){
        return string.slice(0,25) + ' ...'
    }else{
        return string
    }
}
function create_new(){
    let data = {
        name: $('#create_new #name').val().trim(),
        type: $('#create_new #type_product_service').val(),
        price: $('#create_new #price').val(),
		cost_price: $('#create_new #cost_price').val(),
        number_code: $('#create_new #number_code').val(),
        description: $('#create_new #description').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_product_service/create',
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
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Tên</th>
									<th>Loại</th>
									<th>Mã số</th>
									<th>Giá vốn</th>
                                    <th>Giá bán</th>
                                    <th>Trạng thái</th>
                                    <th>Hành Động</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${item.name}</td>
				<td>${item.type == 'product'? "Sản phẩm" : "Dịch vụ"}</td>
                <td>${item.number_code}</td>
				<td>${(item.cost_price).toLocaleString()}</td>
				<td>${(item.price).toLocaleString()}</td>
                <td>${item.isSale ? "Đang kinh doanh" : "Ngừng kinh doanh"}</td>
                <td><span style="color:blue; cursor: pointer" onclick="edit_data('${item._id}')"><i class="far fa-edit"></i></i></span>&nbsp;
					<span style="color:red; cursor: pointer" onclick="comform_delete_data('${item._id}')"><i class="fas fa-times-circle"></i></span>		
				</td>
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
	$('#create_new #cost_price').val("")
    $('#create_new #name').val("")
    $('#create_new #price').val("")
    $('#create_new #number_code').val("")
    $('#create_new #description').val("")
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
        url:'/admin_product_service/get',
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

function comform_delete_data(id){
    Swal.fire({
        title: 'Bạn muốn xóa ?',
        text: "Mọi thông tin trong này sẽ bị mất, bạn có chắc muốn xóa nó ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
            if(result.value == true){
                $.ajax({
                    url:'/admin_product_service/delete_data',
                    method:'delete',
                    data: {id: id, _csrf: $('#_csrf').val()},
					async:false,
                    success: function(data){
                        if(data.status == 1){
                            get_data();
                        }
                    }
                })
            }
    });
}
function edit_data(id){
    $('#edit-stock-tab').html("")
    $("#edit_data .nav-link").removeClass('active');
    $("#edit_data .nav-link").first().addClass('active');
    $("#edit_data .tab-pane").removeClass('active show');
    $("#edit_data .tab-pane").first().addClass('active show');
	$.ajax({
		url:'/admin_product_service/edit_data',
		method:'post',
        data: {id: id, _csrf: $('#_csrf').val()},
        success: function(data){
			if(data.status == 1){
				$('#edit_data #edit_name').val(data.data.name);
                $('#edit_data #edit_price').val(data.data.price);
                $('#edit_data #edit_cost_price').val(data.data.cost_price);
				$('#edit_data #edit_type_product_service').val(data.data.type),
				$('#edit_data #edit_number_code').val(data.data.number_code);
				$('#edit_data #edit_description').val(data.data.description);
				$('#edit_data #isSale').val(data.data.isSale.toString())
                $('#edit_data #edit_id').val(data.data._id);
                $('#edit_data').modal('show');
                if(data.data.type =="service"){
                    $('#edit_data #edit_cost_price').prop("disabled", false);
                    $('#edit_data #edit-stock').css("display", "none");
                }else{
                    $('#edit_data #edit_cost_price').prop("disabled", true);
                    $('#edit_data #edit-stock').css("display", "block");
                    let html = `<div class="info-box">
                                <span class="info-box-icon bg-success"><i class="fas fa-boxes"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Tổng hàng tồn</span>
                                    <span class="info-box-number">${data.data.quantity}</span>
                                    </div>
                            </div>
                            <div class="info-box">
                                <span class="info-box-icon bg-success"><i class="fas fa-warehouse"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Kho</span>
                                    <span class="info-box-number">${data.data.stocks_in_storage.quantity}</span>
                                    </div>
                            </div>`
                    for(let i = 0; i < data.data.stocks_in_store.length; i++){
                        html += `<div class="info-box">
                                    <span class="info-box-icon bg-success"><i class="fas fa-store"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">Cửa hàng ${data.data.stocks_in_store[i].store_name}</span>
										<span class="info-box-number">Tổng hàng : ${data.data.stocks_in_store[i].quantity}</span>
                                        <span class="info-box-text">Hàng bán:</span><span class="info-box-number">${data.data.stocks_in_store[i].product_of_service}</span>
										<span class="info-box-text">Hàng dịch vụ:</span><span class="info-box-number">${data.data.stocks_in_store[i].product_of_safe}</span>
										<span class="info-box-text">Hàng chưa phân loại:</span><span class="info-box-number">${data.data.stocks_in_store[i].product_of_undefined}</span>
                                        </div>
                                </div>`
                    }
                    $('#edit-stock-tab').html(html)
                }
                
            }
		}
	})
}
function update_data(){
	let data = {
        name: $('#edit_data #edit_name').val().trim(),
        cost_price: $('#edit_data #edit_cost_price').val(),
        price: $('#edit_data #edit_price').val(),
        number_code: $('#edit_data #edit_number_code').val(),
        description: $('#edit_data #edit_description').val(),
		isSale: $('#edit_data #isSale').val(),
		id: $('#edit_data #edit_id').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_product_service/update_data',
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