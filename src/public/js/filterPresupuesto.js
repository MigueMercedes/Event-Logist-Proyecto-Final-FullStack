$(document).ready(function () {
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
