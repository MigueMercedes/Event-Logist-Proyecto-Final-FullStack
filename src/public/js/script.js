document.addEventListener('DOMContentLoaded', () => {
    currentYear();
});

const currentYear = () => {
    const copyright = document.querySelector('#currentYear');
    copyright.textContent = `${new Date().getFullYear()} | Event Logist.`
}
