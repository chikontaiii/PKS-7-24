// scroll-animations.js – анимация при прокрутке для всех страниц

let observer;

function initScrollObserver() {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Можно отключить наблюдение после появления, если не нужно повторно
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // 10% элемента видно – запускаем анимацию
}

function observeElements() {
    if (!observer) initScrollObserver();
    // Наблюдаем за всеми элементами с классом fade-on-scroll, а также за карточками и блоками
    const targets = document.querySelectorAll('.fade-on-scroll, .stat-card, .card, .absence-day, .nb-day');
    targets.forEach(el => {
        if (!el.classList.contains('observed')) {
            observer.observe(el);
            el.classList.add('observed');
        }
        // Если элемент уже виден при загрузке, сразу показываем
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initScrollObserver();
    observeElements();
});

// Наблюдаем за изменениями в DOM (для динамически подгружаемых блоков)
const domObserver = new MutationObserver(() => {
    observeElements();
});
domObserver.observe(document.body, { childList: true, subtree: true });