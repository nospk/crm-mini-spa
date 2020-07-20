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
                    <td><input class="form-control form-control-sm" id="cost-price-${value[1]}" onchange="change_cost_price('${value[1]}')" field="${value[1]}" type="number" step="1000" value="${value[2]}"></td>
                    <td><input class="form-control form-control-sm" min="0" type="number" onchange="change_stocks('${value[1]}')" id="stocks-${value[1]}" field="${value[1]}" value="1"></td>
                    <td><span id="total-${value[1]}" field="${value[1]}">${value[2]}</span></td>
                    <td><span style="color:red; cursor: pointer"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
    $('#add_product').append(html)
}

function change_cost_price(code){
	let value = $(`#cost-price-${code}`).val()
	let number = $(`#stocks-${code}`).val()
	$(`#total-${code}`).text(value*number)
}
function change_stocks(code){
	let value = $(`#cost-price-${code}`).val()
	let number = $(`#stocks-${code}`).val()
	$(`#total-${code}`).text(value*number)
}