function printPage() {
    let originalContent = document.body.innerHTML; // Almacenamos el contenido original
    let contentToPrint = document.getElementById('printJS-form').innerHTML; // Obtenemos el contenido a imprimir

    document.body.innerHTML = contentToPrint; // Sobrescribimos el contenido de la página con el contenido a imprimir
    window.print(); // Imprimimos la página
    document.body.innerHTML = originalContent; // Restauramos el contenido original
}
