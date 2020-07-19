$( document ).ready(()=>{
	get_product();
})
function get_product(){
    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url:'/admin_stocks/get_product',
        method:'POST',
        data: data,
        success: function(data){
            if(data.status == 1){
                let html = ""     
                data.data.forEach(item =>{
                    html +=`<option value="${item.name}:${item.number_code}:${item.cost_price}">${item.name}</option>`
                })
                $('#select_product').html(html)
                $('.select2bs4').select2({
                    theme: 'bootstrap4'
                })
            }
        }
    })
}
function add_product(){
    let value = $('#select_product').val()
    value = value.split(':')
    let html = `<tr>
                    <td>${value[0]}</td>
                    <td>${value[1]}</td>
                    <td><input class="form-control form-control-sm" type="number" value="${value[2]}"></td>
                    <td><input class="form-control form-control-sm" type="number" value="1"></td>
                    <td>${value[2]}</td>
                    <td><span style="color:red; cursor: pointer"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
    $('#add_product').append(html)
}