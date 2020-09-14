let typingTimer;                //timer identifier
let doneTypingInterval = 500;  //time in ms, 1 second for example
let $input = $('#search_product');

//on keyup, start the countdown
$input.on('keyup', function () {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(search_product, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
	clearTimeout(typingTimer);
	$('#show_search_product').hide();
});

//user is "finished typing," do something
function doneTyping() {
	//do something
}

$(window).on("click", function () {

	$('#show_search_product').hide();

});
$( document ).ready(()=>{
    // const currencyInput = document.querySelector('input[type="currency"]')
    // currencyInput.addEventListener('focus', onFocus)
    // currencyInput.addEventListener('blur', onBlur)
})
function search_product() {
	if ($('#search_product').val() != "") {
		$.ajax({
			url: '/store_sale/search_product',
			method: 'POST',
			data: {
				search: $('#search_product').val(),
				_csrf: $('#_csrf').val()
			},
			success: function (data) {
				if (data.status == 1) {
					if (data.data.length > 0) {
						let html = ""
						data.data.forEach(item => {
							html += `<li class="search_product" onclick="add_product('${item.name}:${item.number_code}:${item.price}:${item._id}:${item.type == "product" ? item.stocks_in_store[0].product_of_sale : "max"}')">
										<span class="font-weight-bold">${item.name}</span><br>
										<span class="number_code">Mã: ${item.number_code}</span><span class="float-right">Giá bán: ${convert_vnd(item.price)}</span><br>
									`
							if (item.type == "product") {
								html += `<span>Số lượng: ${item.stocks_in_store[0].product_of_sale}</span>`
							}
							html += `</li>`
						});
						$('#show_search_product').html(html)
						$('#show_search_product').show();
					} else {
						$('#show_search_product').html(`<li><span>Không tìm thấy sản phẩm</span></li>`);
						$('#show_search_product').show();
					}
				} else {
					Swal.fire({
						title: data.error,
						text: data.message,
						icon: "error",
						showConfirmButton: false,
						timer: 3000
					}).then((result) => {
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

function add_product(product){
    product = product.split(':')
	let check = $(`#quantity-${product[1]}`).val()
	if(product[4] == 0){
		Swal.fire({
			title: "Sản phẩm hết hàng",
			text: "Vui lòng chọn sản phẩm khác hoặc thêm sản phẩm",
			icon: "error",
			showConfirmButton: false,
			timer: 3000
		}).then((result) => {
			// cho vào để ko báo lỗi uncaught
		})
		.catch(timer => {
				// cho vào để ko báo lỗi uncaught
		});
		return;
	}
    if(!check){
        let html = `<tr>
                    <td><span class="number-code">${product[1]}</span></td>
                    <td><span id="name-product-${product[1]}">${product[0]}</span><input type="hidden" id="id-product-${product[1]}" value="${product[3]}"></td>
                    <td><span id="price-${product[1]}">${convert_vnd(Number(product[2]))}</span>
				   `
		if(product[4]=="max"){
			html += `<td><input class="form-control form-control-sm" style="width:60px" min="0" type="number" onchange="change_quantity('${product[1]}', this)" id="quantity-${product[1]}" max="999" value="1"></td>`
		}else{
			html += `<td><input class="form-control form-control-sm" style="width:60px" min="0" type="number" onchange="change_quantity('${product[1]}', this)" id="quantity-${product[1]}" max="${product[4]}" value="1"></td>`
		}  
             html+= `<td><span class="total" id="total-${product[1]}" >${convert_vnd(Number(product[2]))}</span></td>
                    <td><span style="color:red; cursor: pointer" onclick="delete_row_product(this)"><i class="fas fa-times-circle"></i></span></td>
                </tr>`
        $('#add_product').append(html)
        total_sale();
    }else{
        let quantity = $(`#quantity-${product[1]}`).val()
        $(`#quantity-${product[1]}`).val(Number(quantity)+1)
        change_quantity(product[1])
    }

}

function delete_row_product(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    total_sale();
}


function change_quantity(code, btn){
	let number = $(`#quantity-${code}`).val()
	let current_product = $(`#quantity-${code}`).attr('max');
	if(number == 0){
		delete_row_product(btn)
	}else{
		let value = convert_number($(`#price-${code}`).text())
		// $(`#total-${code}`).text(convert_vnd(value*number))
		if(Number(current_product) - Number(number) < 0){
            $(`#quantity-${code}`).val(current_product)
            $(`#total-${code}`).text(convert_vnd(value*current_product))
        }else{
            $(`#total-${code}`).text(convert_vnd(value*number))
        }	
    }
		
	
    total_sale();
}


function total_sale(){
    let money = 0;
	//let payment = convert_number($('#payment').val());
    $(".total").each(function () {                  
        money+= convert_number($(this).text()); 
    });


}