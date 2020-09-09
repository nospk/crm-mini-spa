
$( document ).ready(()=>{
	get_store();
})

function get_store(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_edit/get_store',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                $('#name').val(data.data.name);
				$('#image').attr("src", data.data.image_store)
				$('#address').val(data.data.address);
				$('#username').val(data.data.username);
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

function update_store(){
    let data = {
		name:  $('#name').val(),
		address: $('#address').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_edit/update_store',
        method:'PUT',
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
function change_password(){
    let data = {
		password:  $('#password').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_store_edit/change_password',
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