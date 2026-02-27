document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('[data-goto]');
    els.forEach(el => {
        const element = document.getElementById(el.dataset.goto);
        el.addEventListener('click', (e) => {
            e.preventDefault();
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        });
    });
});