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

        // Obtener todos los elementos con la clase "proveedor"
        const $proveedores = $('.proveedor');

        // Mostrar todos los elementos antes de aplicar el filtrado
        $proveedores.show();

        // Filtrar los proveedores por categoría y término de búsqueda
        $proveedores.each(function () {
            const $card = $(this).find('.card.h-100');
            const cardCategory = $card.data('category').toLowerCase();
            let cardName = $card.data('name');

            // Verificar si cardName existe y es una cadena antes de aplicar includes()
            if (typeof cardName !== 'string') {
                cardName = '';
            }

            const categoryMatch = selectedCategory === 'todos' || cardCategory === selectedCategory;
            const searchMatch = cardName.includes(searchTerm);

            // Mostrar u ocultar el proveedor según los criterios de filtrado
            if (!(categoryMatch && searchMatch)) {
                $(this).hide();
            }
        });
    }
});
