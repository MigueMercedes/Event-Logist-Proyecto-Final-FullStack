$(document).ready(function () {
    function getCellValue(row, index) {
        return $(row).children('td').eq(index).text();
    }

    function sortTable(table, columnIndex, order) {
        let rows = table.find('tbody tr').get();
        rows.sort(function (rowA, rowB) {
            let cellA = getCellValue(rowA, columnIndex);
            let cellB = getCellValue(rowB, columnIndex);
            if (columnIndex === 1) {
                // Columna de Fecha (Convertir a fecha para ordenar correctamente)
                cellA = new Date(cellA);
                cellB = new Date(cellB);
            } else if (columnIndex === 6) {
                // Columna de Costo (Eliminar símbolos y convertir a número)
                cellA = Number(cellA.replace(/[^0-9.-]+/g, ''));
                cellB = Number(cellB.replace(/[^0-9.-]+/g, ''));
            }
            if (order === 'asc') {
                return cellA > cellB ? 1 : -1;
            } else {
                return cellA < cellB ? 1 : -1;
            }
        });

        $.each(rows, function (index, row) {
            table.children('tbody').append(row);
        });
    }

    $('.presupuesto-index th').on('click', function () {
        let table = $('.presupuesto-index');
        let columnIndex = $(this).index();
        let order = $(this).attr('data-order') === 'asc' ? 'desc' : 'asc';

        sortTable(table, columnIndex, order);

        // Resaltar cabecera de columna ordenada
        $('.presupuesto-index th').removeAttr('data-order').css('background-color', '');
        $(this).attr('data-order', order).css('background-color', '#f2f2f2');

        // Mostrar ícono de orden en la cabecera
        $('.presupuesto-index th .sort-icon').remove();
        let sortIconClass = order === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
        $(this).append(`<i class="${sortIconClass} sort-icon"></i>`);
    });

    // Handler para el input de búsqueda y el select de categoría
    $('#searchInput, #SelectCategory').on('input change', function () {
        var searchTerm = $('#searchInput').val().toLowerCase();
        var selectedCategory = $('#SelectCategory').val().toLowerCase();

        $('.presupuesto-index tbody tr').each(function () {
            // Excluimos la primera fila (cabecera de la tabla) del filtro
            if ($(this).hasClass('table-header')) {
                return;
            }

            var rowText = $(this).text().toLowerCase();
            var rowType = $(this).find('td:nth-child(4)').text().toLowerCase();

            var showRow =
                (searchTerm === '' || rowText.includes(searchTerm)) &&
                (selectedCategory === 'todos' || rowType.includes(selectedCategory));

            if (showRow) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
