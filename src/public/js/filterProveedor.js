$(document).ready(function () {
    // Al cargar la página, mostrar todos los proveedores
    $('#SelectCategory').val('Todos');
    filterProveedores();

    // Manejar el evento del cambio de categoría en el select
    $('#SelectCategory').change(function () {
        filterProveedores();
    });

    // Manejar el evento de búsqueda en el input del buscador
    $('#searchInput').keyup(function () {
        filterProveedores();
    });

    function filterProveedores() {
        const selectedCategory = $('#SelectCategory').val().toLowerCase();
        const searchTerm = $('#searchInput').val().toLowerCase();

        // Obtener todos los elementos de proveedoresContainer
        const $proveedoresContainer = $('#proveedoresContainer');
        const $proveedores = $proveedoresContainer.find('.col-md-6.col-lg-4.mt-4');

        // Mostrar todos los elementos antes de aplicar el filtrado
        $proveedores.show();

        // Filtrar los proveedores por categoría y término de búsqueda
        $proveedores.each(function () {
            const $card = $(this).find('.card.h-100');
            const cardCategory = $card.data('category').toLowerCase();
            const cardName = $card.data('name').toLowerCase();

            const categoryMatch = selectedCategory === 'todos' || cardCategory === selectedCategory;
            const searchMatch = cardName.includes(searchTerm);

            // Mostrar u ocultar el proveedor según los criterios de filtrado
            if (!(categoryMatch && searchMatch)) {
                $(this).hide();
            }
        });
    }
});
