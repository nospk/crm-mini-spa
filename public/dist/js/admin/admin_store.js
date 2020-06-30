
$( document ).ready(()=>{
	get_store();
})
function render_store(data){
	let html = '';
	data.forEach(item =>{
		html+=`<div class="col-6">
				<div class="card">
				  <img class="card-img-top" src="${item.image_store}" alt="Hình cửa hàng">
				  <div class="card-body">
					<h5 class="card-title">${item.name}</h5>
					<p class="card-text">${item.address}</p>
					<a href="#" class="btn btn-primary float-right" onClick="active_store('${item._id}'); return false;">Chọn cửa hàng</a>
				  </div>
				 </div>
			   </div>`
	})
	$('#show_store').html(html);
}
function create_store(){
    let data = {
        name: $('#create_store #name').val().trim(),
        address: $('#create_store #address').val().trim(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store/create',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                Swal.fire({
                    title: "Cập nhật thành công",
                    text: "Nội dung này đã được lưu lại",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 3000
                }).then((result)=>{
					get_store()
                })
                .catch(timer => {
					get_store()
                });    
            }else{
                Swal.fire({
                    title: "Phát sinh lỗi",
                    text: "Vui lòng kiểm tra dữ liệu",
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
function get_store(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store/get',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                render_store(data.data);
            }else{
                Swal.fire({
                    title: "Phát sinh lỗi",
                    text: "Vui lòng kiểm tra dữ liệu",
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
function active_store(id){
    let data = {
		id: id,
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store/active',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                Swal.fire({
                    title: "Cập nhật thành công",
                    text: "Đã chọn cửa hàng",
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
                    title: "Phát sinh lỗi",
                    text: "Vui lòng kiểm tra dữ liệu",
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