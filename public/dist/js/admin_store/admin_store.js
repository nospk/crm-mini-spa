
$( document ).ready(()=>{
	get_store();
})
function render_data(data){
	let html = '';
	data.forEach(item =>{
		html+=`
				<div class="card">
				  <img class="card-img-top" src="${item.image_store}" alt="Hình cửa hàng">
				  <div class="card-body">
					<h5 class="card-title">${item.name}</h5>
					<p class="card-text">${item.address}</p>
					<a href="#" class="btn btn-primary float-right" onClick="active_store('${item._id}'); return false;">Chọn cửa hàng</a>
				  </div>
				 </div>
			   `
	})
	$('#show_data').html(html);
}
function create_store(){
	let errors = 0
	if($('#create_store #name').val() == ""){
		errors++
	}
	if($('#create_store #address').val() == ""){
		errors++
	}
	if($('#create_store #username').val() == ""){
		errors++
	}
	if($('#create_store #password').val() == ""){
		errors++
	}
	if(errors > 1 ){
		Swal.fire({
			title: "Lỗi thiếu thông tin",
			text: "Vui lòng nhập đầy đủ thông tin",
			icon: "error",
			showConfirmButton: false,    
				timer: 3000
			}).then((result)=>{
				// cho vào để ko báo lỗi uncaught
			})
			.catch(timer => {
				// cho vào để ko báo lỗi uncaught
		}); 	
	}else{
		let data = {
			name: $('#create_store #name').val().trim(),
			address: $('#create_store #address').val().trim(),
			username: $('#create_store #username').val().trim(),
			password: $('#create_store #password').val().trim(),
			_csrf: $('#_csrf').val()
		}
		$.ajax({
			url:'/admin_store/create',
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
						get_store()
					})
					.catch(timer => {
						get_store()
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
}
function get_store(){
	$('#create_store #name').val("")
    $('#create_store #address').val("")
	$('#create_store #username').val("")
	$('#create_store #password').val("")
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store/get',
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