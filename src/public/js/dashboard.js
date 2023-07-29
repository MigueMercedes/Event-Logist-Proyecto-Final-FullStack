document.addEventListener('DOMContentLoaded', () => {
    const barChartElement = document.getElementById('bar-chart');

    if (barChartElement) {
        // BAR CHART

        let datos = [249, 230, 19, 8];
        let total = datos[0]; // Calculamos la suma de los valores en el arreglo "datos"

        //2do arreglo
        let porcentajes = datos.map((valor) => (valor / total) * 100);

        let barChartOptions = {
            series: [
                {
                    data: porcentajes,
                },
            ],
            chart: {
                type: 'bar',
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            colors: ['#246dec', '#367952', '#f5b74f', '#cc3c43'],
            plotOptions: {
                bar: {
                    distributed: true,
                    borderRadius: 4,
                    horizontal: false,
                    columnWidth: '45%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            xaxis: {
                categories: ['Total Creados', 'Pagados', 'Pendientes de Pago', 'Rechasados'],
            },
            yaxis: {
                title: {
                    text: 'Porcentaje',
                },
                min: 0,
                max: 100,
                tickAmount: 5, //de 20 en 20
                labels: {
                    formatter: function (value) {
                        return value + '%'; //A;adir simbolo
                    },
                },
            },
        };

        let barChart = new ApexCharts(barChartElement, barChartOptions);
        barChart.render();
    }
});
