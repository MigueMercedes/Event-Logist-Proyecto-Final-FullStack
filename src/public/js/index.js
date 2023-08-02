// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    currentYear();
    removeAlerts();
});

// Función para obtener el año actual
const currentYear = () => {
    const currentYearElement = document.querySelector('#currentYear');
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = `${currentYear} | Event Logist.`;
};

const removeAlerts = () => {
    const messageAlerts = document.querySelectorAll('.alert');
    if (messageAlerts) {
        setTimeout(() => {
            messageAlerts.forEach((alert) => {
                alert.remove();
            });
        }, 4000);
    }
};
