document.addEventListener('DOMContentLoaded', function () {
    const creados = parseInt(document.querySelector('#creadosValue').innerText) || 0;
    const completados = parseInt(document.querySelector('#completadosValue').innerText);
    const aceptados = parseInt(document.querySelector('#aceptadosValue').innerText);
    const editando = parseInt(document.querySelector('#editandoValue').innerText);
    const rechazados = parseInt(document.querySelector('#rechazadosValue').innerText);
    const pagados = parseInt(document.querySelector('#pagadosValue').innerText);
    const noPagados = parseInt(document.querySelector('#noPagadosValue').innerText);
    const pendientes = parseInt(document.querySelector('#pendientesValue').innerText);

    // Cálculo de porcentajes para la primera gráfica (Completados, Aceptados, Editando, Rechazados)
    let totalStatus = completados + aceptados + editando + rechazados;
    let porcentajeCompletados = creados === 0 ? 0 : (completados / totalStatus) * 100;
    let porcentajeAceptados = creados === 0 ? 0 : (aceptados / totalStatus) * 100;
    let porcentajeEditando = creados === 0 ? 0 : (editando / totalStatus) * 100;
    let porcentajeRechazados = creados === 0 ? 0 : (rechazados / totalStatus) * 100;

    let statusPieChartOptions = {
        series: [
            porcentajeCompletados,
            porcentajeAceptados,
            porcentajeEditando,
            porcentajeRechazados,
        ],
        chart: {
            type: 'pie',
            height: 400,
            toolbar: {
                show: false,
            },
        },
        colors: ['#246dec', '#367952', '#f5b74f', '#ff0000'],
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
            offsetY: 5,
            onItemClick: {
                toggleDataSeries: true,
            },
            onItemHover: {
                highlightDataSeries: true,
            },
        },
        labels: ['Completados', 'Aceptados', 'Editando', 'Rechazados'],
    };

    let statusPieChart = new ApexCharts(
        document.querySelector('#status-pie-chart'),
        statusPieChartOptions
    );

    // Cálculo de porcentajes para la segunda gráfica (Pago, No Pago, Pendiente)
    let porcentajePagados = creados === 0 ? 0 : (pagados / creados) * 100;
    let porcentajeNoPagados = creados === 0 ? 0 : (noPagados / creados) * 100;
    let porcentajePendientes = creados === 0 ? 0 : (pendientes / creados) * 100;

    let paymentPieChartOptions = {
        series: [porcentajePagados, porcentajeNoPagados, porcentajePendientes],
        chart: {
            type: 'pie',
            height: 400,
            toolbar: {
                show: false,
            },
        },
        colors: ['#33cc33', '#cc3c43', '#ff9933'],
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
            offsetY: 5,
            onItemClick: {
                toggleDataSeries: true,
            },
            onItemHover: {
                highlightDataSeries: true,
            },
        },
        labels: ['Pagados', 'No Pagados', 'Pendientes de Pago'],
    };

    let paymentPieChart = new ApexCharts(
        document.querySelector('#payment-pie-chart'),
        paymentPieChartOptions
    );

    // Renderizar las gráficas y luego actualizar los colores si no hay creados
    statusPieChart.render().then(() => {
        paymentPieChart.render().then(() => {
            if (creados === 0) {
                statusPieChart.updateOptions({
                    colors: ['#808080', '#808080', '#808080', '#808080'],
                });
                paymentPieChart.updateOptions({
                    colors: ['#808080', '#808080', '#808080'],
                });
            }
        });
    });
});
