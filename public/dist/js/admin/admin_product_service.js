function create_new(){
    let data = {
        name: $('#create_new #name').val().trim(),
        type_product_service: $('#create_new #type_product_service').val(),
        price: $('#create_new #price').val(),
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
	$('#show_data').html(html);
}