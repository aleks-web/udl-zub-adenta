/*
* Плавное появление
* @param {number} duration - Скорость анимации
* @param {number} opacity - Установка значения opacity при открытии. Итоговое значение. Может пригодиться, например для фона модалки
* @param {string} display - Свойство display, которое нужно установить для элемента
* @param {callback} callback - функция, которая срабатывает после завершения анимации
* */
HTMLElement.prototype.fadeIn = function (duration = 300, opacity = 1, display = 'block', callbackReady = () => {}) {
    this.style.opacity = 0;
    this.style.display = display || 'block';
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);
        this.style.opacity = progress * opacity;

        if (progress < opacity) {
            requestAnimationFrame(animation.bind(this));
        } else {
            callbackReady(this, { duration, opacity, display, callbackReady });
        }
    }

    requestAnimationFrame(animation.bind(this));

    return this;
}

/*
* Плавное исчезновение
* @param {number} duration - Скорость анимации
* @param {callback} callback - функция, которая срабатывает после завершения анимации
* */
HTMLElement.prototype.fadeOut = function (duration = 300, callback = () => {}) {
    this.style.opacity = this.style.opacity ? this.style.opacity : 1;
    let opacityStart = Number(this.style.opacity);
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, opacityStart);
        this.style.opacity = opacityStart - progress;

        if (progress < opacityStart) {
            requestAnimationFrame(animation.bind(this));
        } else {
            this.style.display = 'none';
            callback(this, { duration, callback });
        }
    }

    requestAnimationFrame(animation.bind(this));

    return this;
}

/*
* Плавная прокрутка до числа
* @param {number} count - число до которого нужно прокрутить
* @param {number} speed - скорость прокрутки
* @param {callback} callback - функция, которая срабатывает после завершения анимации
* */
HTMLElement.prototype.countAnimate = function(count, speed = 300, callback = () => {}) {
    function updateTex(counter, text){
        counter.textContent = text;
    }

    const animate = (countTo, duration) => {
        let startTime = null;
        const step = (currentTime) => {
            if (!startTime) { startTime = currentTime; }
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentNum = Math.floor(progress * countTo);
            updateTex(this, currentNum);

            if (progress < 1) { window.requestAnimationFrame(step); } else { window.cancelAnimationFrame(window.requestAnimationFrame(step)); callback({count, speed, callback}); }
        };

        window.requestAnimationFrame(step);
    };

    animate.bind(this)(count, speed);
}

HTMLElement.prototype.setIntersectionObserver = function(callback, options) {
    const observer = new IntersectionObserver((...e) => { callback(this, e) }, options);
    observer.observe(this);
}

window.clearPhone = (string) => {
    return '+' + string.replace(/[^\d]+/g, '');
}

document.body.disableScroll = () => {
    document.body.style.overflow = 'hidden';
}

document.body.enableScroll = () => {
    document.body.style.overflow = 'auto';
}