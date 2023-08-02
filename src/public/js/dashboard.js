document.addEventListener('DOMContentLoaded', function () {
    let creados = 249;
    let pagados = 230;
    let pendientes = 19;
    let rechazados = 8;
    let total = creados;

    // Actualizar el valor de las variables en el HTML
    document.getElementById('creadosValue').innerText = creados;
    document.getElementById('pagadosValue').innerText = pagados;
    document.getElementById('pendientesValue').innerText = pendientes;
    document.getElementById('rechazadosValue').innerText = rechazados;

    // Cálculo de porcentajes
    let porcentajePagados = (pagados / total) * 100;
    let porcentajePendientes = (pendientes / total) * 100;
    let porcentajeRechazados = (rechazados / total) * 100;

    let pieChartOptions = {
        series: [porcentajePagados, porcentajePendientes, porcentajeRechazados],
        chart: {
            type: 'pie',
            height: 400,
            toolbar: {
                show: false,
            },
        },
        colors: ['#367952', '#f5b74f', '#cc3c43'],
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(1) + '%';
            },
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '14px',
            offsetY: 10,
            onItemClick: {
                toggleDataSeries: true,
            },
            onItemHover: {
                highlightDataSeries: true,
            },
        },
        labels: ['Pagados', 'Pendientes de Pago', 'Rechazados'],
    };

    let pieChart = new ApexCharts(document.querySelector('#pie-chart'), pieChartOptions);
    pieChart.render();
});
