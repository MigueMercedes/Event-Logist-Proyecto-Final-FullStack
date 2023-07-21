// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    currentYear();
});

// Función para obtener el año actual
function currentYear() {
    const currentYearElement = document.querySelector('#currentYear');
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = `${currentYear} | Event Logist.`;
}
