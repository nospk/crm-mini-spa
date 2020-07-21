let money_total;
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
                    html +=`<option value="${item.name}:${item.number_code}:${item.cost_price}:${item._id}">${item.name}</option>`
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
    let check = $(`#stocks-${value[1]}`).val()
    if(!check){
        let html = `<tr>
                    <td><span id="name-product-${value[1]}">${value[0]}</span><input type="hidden" id="id-product-${value[1]}" value="${value[3]}"></td>
                    <td><span class="number-code">${value[1]}</span></td>
                    <td><input class="form-control form-control-sm" id="cost-price-${value[1]}" onchange="change_cost_price('${value[1]}')" type="number" step="1000" value="${value[2]}"></td>
                    <td><input class="form-control form-control-sm" min="0" type="number" onchange="change_stocks('${value[1]}')" id="stocks-${value[1]}" value="1"></td>
                    <td><span class="total" id="total-${value[1]}" >${value[2]}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#add_product').append(html)
        total_get_goods();
    }else{
        let quantity = $(`#stocks-${value[1]}`).val()
        $(`#stocks-${value[1]}`).val(Number(quantity)+1)
        change_stocks(value[1])
    }
}
function delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    total_get_goods();
}
function change_cost_price(code){
	let value = $(`#cost-price-${code}`).val()
	let number = $(`#stocks-${code}`).val()
    $(`#total-${code}`).text(value*number)
    total_get_goods();
}
function change_stocks(code){
	let value = $(`#cost-price-${code}`).val()
	let number = $(`#stocks-${code}`).val()
    $(`#total-${code}`).text(value*number)
    total_get_goods();
}
function total_get_goods(){
    let money = 0;
    $(".total").each(function () {                  
        money+= Number($(this).text()); 
    });
    $('#total_get_goods').text(new Intl.NumberFormat().format(money))
    money_total = money;
}

function get_list_product(){
    let list_product = [];
    $(".number-code").each(function () {                  
        list_product.push($(this).text()); 
    });
    let data = [{
        total_get_goods : money_total
    }];
    list_product.forEach((number_code)=>{
        data.push({
            number_code : number_code,
            name: $(`#name-product-${number_code}`).text(),
            cost_price: $(`#cost-price-${number_code}`).val(),
            stock_quantity: $(`#stocks-${number_code}`).val(),
            product_id: $(`#id-product-${number_code}`).val()
        })
    })
    return data;
}

function create_new(){
    let data = {
        products: get_list_product(),
        _csrf: $('#_csrf').val()
    }
    if(data.products.length > 1){
        $.ajax({
            url:'/admin_stocks/create',
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
                        get_product()
                    })
                    .catch(timer => {
                        get_product()
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
    }else{
        Swal.fire({
            title: 'Lỗi thiếu thông tin hàng nhập',
            text: 'Vui lòng nhập hàng hóa vào',
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