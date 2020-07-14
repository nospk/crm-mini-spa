$( document ).ready(()=>{
	get_data();
})
function create_new(){
    let data = {
        name: $('#create_new #name').val().trim(),
        type: $('#create_new #type_product_service').val(),
        price: $('#create_new #price').val(),
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
function render_data(data){
	let html = `<div class="col-12">
	                <div class="card">
	                    <div class="card-header">
                            <h3 class="card-title">Danh sách sản phẩm</h3>
                            <div class="card-tools">
		                        <div class="input-group input-group-sm" style="width: 150px;">
			                        <input type="text" name="table_search" class="form-control float-right" placeholder="Tìm">

			                        <div class="input-group-append">
			                            <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
			                        </div>
		                        </div>
		                    </div>
                        </div>
                        <!-- /.card-header -->
	                    <div class="card-body table-responsive p-0">
		                    <table class="table table-hover text-nowrap">
		                        <thead>
                                    <tr>
                                    <th>Tên</th>
									<th>Loại</th>
                                    <th>Giá</th>
                                    <th>Mã số</th>
                                    <th>Thông tin</th>
                                    <th>Hành Động</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${item.name}</td>
				<td>${item.type == 'product'? "Sản phẩm" : "Dịch vụ"}</td>
                <td>${(item.price).toLocaleString()}</td>
                <td>${item.number_code}</td>
                <td>${item.description}</td>
                <td><span style="color:blue; cursor: pointer" onclick="edit_data('${item._id}')"><i class="far fa-edit"></i></i></span>&nbsp;
					<span style="color:red; cursor: pointer" onclick="comform_delete_data('${item._id}')"><i class="fas fa-times-circle"></i></span>		
				</td>
                </tr>`
    })
    html+=`</tbody>
                </table>
            </div>
            <!-- /.card-body -->
            </div>
            <!-- /.card -->
            </div>
            `;
	$('#show_data').html(html);
}
function get_data(){
    $('#create_new #name').val("")
    $('#create_new #price').val("")
    $('#create_new #number_code').val("")
    $('#create_new #description').val("")
	$('#edit_data #edit_id').val("");
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_product_service/get',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                render_data(data.data);
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
	$.ajax({
		url:'/admin_product_service/edit_data',
		method:'post',
        data: {id: id, _csrf: $('#_csrf').val()},
		async:false,
        success: function(data){
			if(data.status == 1){
				$('#edit_data #edit_name').val(data.data.name);
				$('#edit_data #edit_price').val(data.data.price);
				$('#edit_data #edit_type_product_service').val(data.data.type),
				$('#edit_data #edit_number_code').val(data.data.number_code);
				$('#edit_data #edit_description').val(data.data.description);
				$('#edit_data #edit_id').val(data.data._id);
				$('#edit_data').modal('show');
            }
		}
	})
}
function update_data(){
	let data = {
        name: $('#edit_data #edit_name').val().trim(),
        type: $('#edit_data #edit_type_product_service').val(),
        price: $('#edit_data #edit_price').val(),
        number_code: $('#edit_data #edit_number_code').val(),
        description: $('#edit_data #edit_description').val(),
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