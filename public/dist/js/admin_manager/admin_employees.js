$( document ).ready(()=>{
	get_data();
})
let page_now;

function create_new(){
    let data = {
        name: $('#create_new #name').val().trim(),
        birthday: $('#create_new #birthday').val().trim(),
        address: $('#create_new #address').val().trim(),
        number_code: $('#create_new #number_code').val().trim(),
        identity_number: $('#create_new #identity_number').val().trim(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_employees/create',
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
									<th>Sinh nhật</th>
                                    <th>Giấy tờ tùy thân</th>
                                    <th>Địa chỉ</th>
                                    <th>Mã số</th>
                                    <th>Hành Động</th>
                                    </tr>
		                        </thead>
		                        <tbody>`;
	data.forEach(item =>{
		html+=`<tr>
                <td>${item.name}</td>
				<td>${item.birthday}</td>
                <td>${item.identity_number}</td>
                <td>${reduce_string(item.address)}</td>
                <td>${item.number_code}</td>
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
    $('#create_new #name').val("")
    $('#create_new #birthday').val("")
    $('#create_new #number_code').val("")
    $('#create_new #address').val("")
	$('#create_new #identity_number').val("")
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
        url:'/admin_employees/get',
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
		url:'/admin_employees/edit_data',
		method:'post',
        data: {id: id, _csrf: $('#_csrf').val()},
        success: function(data){
			if(data.status == 1){
				$('#edit_data #edit_name').val(data.data.name);
				$('#edit_data #edit_birthday').val(data.data.birthday);
				$('#edit_data #edit_identity_number').val(data.data.identity_number),
				$('#edit_data #edit_number_code').val(data.data.number_code);
				$('#edit_data #edit_address').val(data.data.address);
				$('#edit_data #edit_id').val(data.data._id);
				$('#edit_data').modal('show');
            }
		}
	})
}
function update_data(){
	let data = {
        name: $('#edit_data #edit_name').val().trim(),
        birthday: $('#edit_data #edit_birthday').val().trim(),
        address: $('#edit_data #edit_address').val().trim(),
        number_code: $('#edit_data #edit_number_code').val().trim(),
        identity_number: $('#edit_data #edit_identity_number').val().trim(),
		id: $('#edit_data #edit_id').val(),
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_employees/update_data',
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