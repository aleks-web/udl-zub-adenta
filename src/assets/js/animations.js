document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section').forEach(el => {
        el.setIntersectionObserver((e) => {
            e.fadeIn(900)
        })
    });
});