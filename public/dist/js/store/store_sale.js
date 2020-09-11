function search_product(){
	$.ajax({
		url:'/store_sale/search_product',
		method:'POST',
		data: {
			_csrf: $('#_csrf').val()
		},
		success: function(data){
			if(data.status == 1){
				Swal.fire({
					title: "Thao tác thành công",
					text: data.message,
					icon: "info",
					showConfirmButton: false,
					timer: 3000
				}).then((result)=>{
					// cho vào để ko báo lỗi uncaught
				})
				.catch(timer => {
					// cho vào để ko báo lỗi uncaught
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