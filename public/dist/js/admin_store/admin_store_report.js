$(document).ready(() => {
    get_data();
})
function get_data() {

    let data = {
        _csrf: $('#_csrf').val()
    }
    $.ajax({
        url: '/admin_store_report/get_data',
        method: 'POST',
        data: data,
        success: function (data) {
            if (data.status == 1) {
                drawCanvas_now(data.data.gettotalAmount, data.data.gettotalCostPrice, data.data.newCustomers[0]);
                drawCanvas_lastmonth(data.data.gettotalAmountLastMonth, data.data.gettotalCostPriceLastMonth, data.data.newCustomersLastMonth[0]);
                drawTopSell(data.data.topSell, data.data.totalSell)
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
function drawTopSell(data, totalSell) {

    let html = `<p class="text-center bg-danger">
                    <strong>Top dịch vụ - sản phẩm </strong>
                </p>
    `
    data.forEach(item => {
        html += `
                <div class="progress-group">
                    ${item.product_service[0].name}
                    <span class="float-right"><b>${item.total}</b>/${totalSell}</span>
                    <div class="progress progress-sm">
                      <div class="progress-bar bg-primary" style="width: ${Math.round(item.total/totalSell*100)}%"></div>
                    </div>
                </div>
        `
    });
    $('#topSell').html(html)
}
function drawCanvas_now(revenue = revenue || 0, totalCostPrice = totalCostPrice || 0, newCustomers) {

    let profit = revenue - totalCostPrice
    $('#revenue').text(convert_vnd(revenue))
    $('#profit').text(convert_vnd(profit))
    var ticksStyle = {
        fontColor: '#495057',
        fontStyle: 'bold'
    }

    var mode = 'index'
    var intersect = true

    var $salesChart = $('#sales-chart')
    var salesChart = new Chart($salesChart, {
        type: 'bar',
        data: {
            labels: ['Tháng Này'],
            datasets: [
                {
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    data: [revenue]
                },
                {
                    backgroundColor: '#ced4da',
                    borderColor: '#ced4da',
                    data: [profit]
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: mode,
                intersect: intersect
            },
            hover: {
                mode: mode,
                intersect: intersect
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    // display: false,
                    gridLines: {
                        display: true,
                        lineWidth: '4px',
                        color: 'rgba(0, 0, 0, .2)',
                        zeroLineColor: 'transparent'
                    },
                    ticks: $.extend({
                        beginAtZero: true,

                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return Number(value) > 10 ? convert_vnd(value) : convert_vnd(0)
                        }
                    }, ticksStyle)
                }],
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: ticksStyle
                }]
            }
        }
    })
    let newCustomerPercent = Number(newCustomers.money) / Number(revenue) * 100
    $('#new_customer').html(newCustomers.customers)
    $('#new_customer_payment').html(newCustomers.money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' <sup style="font-size: 20px">VND</sup>')
    $('#new_customer_sell_percent').html(Math.round(newCustomerPercent) + ' <sup style="font-size: 20px">%</sup>')
}
function drawCanvas_lastmonth(revenue = revenue || 0, totalCostPrice = totalCostPrice || 0, newCustomers) {
    let profit = revenue - totalCostPrice
    $('#revenue_lastmonth').text(convert_vnd(revenue))
    $('#profit_lastmonth').text(convert_vnd(profit))
    var ticksStyle = {
        fontColor: '#495057',
        fontStyle: 'bold'
    }

    var mode = 'index'
    var intersect = true

    var $salesChart = $('#sales-chart-last-month')
    var salesChart = new Chart($salesChart, {
        type: 'bar',
        data: {
            labels: ['Tháng Trước'],
            datasets: [
                {
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    data: [revenue]
                },
                {
                    backgroundColor: '#ced4da',
                    borderColor: '#ced4da',
                    data: [profit]
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: mode,
                intersect: intersect
            },
            hover: {
                mode: mode,
                intersect: intersect
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    // display: false,
                    gridLines: {
                        display: true,
                        lineWidth: '4px',
                        color: 'rgba(0, 0, 0, .2)',
                        zeroLineColor: 'transparent'
                    },
                    ticks: $.extend({
                        beginAtZero: true,

                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return convert_vnd(value)
                        }
                    }, ticksStyle)
                }],
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: ticksStyle
                }]
            }
        }
    })
    let newCustomerPercent = Number(newCustomers.money) / Number(revenue) * 100
    $('#new_customer_lastmonth').html(newCustomers.customers)
    $('#new_customer_payment_lastmonth').html(newCustomers.money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' <sup style="font-size: 20px">VND</sup>')
    $('#new_customer_sell_percent_lastmonth').html(Math.round(newCustomerPercent) + ' <sup style="font-size: 20px">%</sup>')

}