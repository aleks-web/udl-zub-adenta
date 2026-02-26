document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.pacient-count__count').setIntersectionObserver((e) => {
        e.countAnimate(e.innerText, 300);
    }, { root: null, rootMargin: "0px", threshold: 0.2 });

    document.querySelectorAll('section').forEach(el => {
        el.setIntersectionObserver((e) => {
            e.fadeIn(900)
        })
    });
})