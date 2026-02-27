import IMask from 'imask';

export const maskOptions = {
    mask: '+{7} (000) 000-00-00',
    prepare: (str, masked) => {
        const ch = String(str);
        if (!masked.value && ch === "8") return "7";
        return ch;
    }
};

export const setMask = (element, options = maskOptions) => {
    IMask(element, options);
}

document.addEventListener('DOMContentLoaded', (e) => {
    const phoneElements = document.querySelectorAll('[data-mask-phone]');

    window.imasks = [];
    phoneElements.forEach(phoneEl => {
        const mask = IMask(phoneEl, maskOptions);
        window.imasks.push({ phoneEl, mask });
    });
});