import { setMask } from "./masks.js";
import sender from "./sender.js";

export default class Modals {
    static #modalSelector;
    static beforeOpenModalGlobalCallback = () => {};

    static getOriginalModals() {
        return document.querySelectorAll(Modals.#modalSelector);
    }

    static getFakeModals() {
        return document.querySelectorAll('.modal-wrapper');
    }

    static closeBg() {
        const bg = document.getElementById('modal-bg');
        bg?.fadeOut(500, () => {
            bg.remove();
        });
    }

    static init(modalSelector) {
        this.#modalSelector = modalSelector;
        Modals.getOriginalModals().forEach(e => {
            e.style.display = 'none';
        });

        this.#setCloseListener();
    }

    static #setCloseListener() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-wrapper')) {
                Modals.closeAllModal();
            }
        });
    }

    static #createBg(colorBg = 'black') {
        const bg = document.createElement('div');
        bg.setAttribute('id', 'modal-bg');
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.backgroundColor = colorBg;
        bg.style.position = 'fixed';
        bg.style.justifyContent = 'center';
        bg.style.alignItems = 'center';
        bg.style.top = '0';
        bg.style.left = '0';
        bg.style.display = 'none';
        bg.style.zIndex = Modals.#getMaxZIndex() + 10;
        return bg;
    }

    static openModal({ modalElement, duration = 400, opacityBg = 0.4, colorBg = 'black', beforeOpenCallback = () => {  } }) {
        Modals.openBg(duration, opacityBg, colorBg);

        let modal = modalElement.cloneNode(true);
        modal = Modals.#prepareModal(modal);
        Modals.beforeOpenModalGlobalCallback(modal);
        beforeOpenCallback(modal);
        document.body.appendChild(modal);
        modal.fadeIn(duration, 1, 'flex');

        Modals.#disableScroll();
    }

    static openBg(duration, opacityBg, colorBg) {
        const bg = Modals.#createBg(colorBg);
        document.body.appendChild(bg);
        bg.fadeIn(duration, opacityBg, 'flex');
    }

    static #prepareModal(modal) {
        const bgModal = document.createElement('div');

        bgModal.style.display = 'none';
        bgModal.style.position = 'fixed';
        bgModal.style.justifyContent = 'center';
        bgModal.style.alignItems = 'center';
        bgModal.style.top = '0';
        bgModal.style.left = '0';
        bgModal.style.width = '100%';
        bgModal.style.height = '100%';
        bgModal.style.backgroundColor = 'transparent';
        bgModal.classList.add('modal-wrapper');
        bgModal.style.zIndex = Modals.#getMaxZIndex() + 10;

        modal.style.display = 'flex';
        modal.style.margin = '0 auto';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        bgModal.appendChild(modal);

        return bgModal;
    }

    static closeAllModal() {
        Modals.getFakeModals().forEach(modal => {
            const modalWrapper = modal.closest('.modal-wrapper');
            modalWrapper.fadeOut(300, () => {
                modal.remove();
            });
        });
        Modals.closeBg();
        Modals.#enableScroll();
    }

    static #getMaxZIndex() {
        let maxZIndex = 0;
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const zIndex = window.getComputedStyle(element).zIndex;
            if (!isNaN(zIndex) && zIndex !== 'auto') {
                maxZIndex = Math.max(maxZIndex, parseInt(zIndex, 10));
            }
        });
        return Number(maxZIndex);
    }

    static #disableScroll() {
        document.body.disableScroll();
    }

    static #enableScroll() {
        document.body.enableScroll();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Modals.init('.modal');

    Modals.beforeOpenModalGlobalCallback = (modal) => {
        const phoneEl = modal.querySelector('[data-mask-phone]');
        if (phoneEl) {
            setMask(phoneEl);
        }

        modal.querySelectorAll('form.form').forEach(form => {
            const phone = form.querySelector('[data-mask-phone]');
            let phoneValue = null;

            form.onsubmit = async (e) => {
                e.preventDefault();
                phoneValue = clearPhone(phone.value);
                sender({ phone: phoneValue });
            }

        });
    }

    window.openModal = async (modalSelector) => {
        const Modals = (await import('/src/assets/js/modals.js')).default;
        const modal = document.querySelector(modalSelector);
        Modals.openModal({ modalElement: modal });
    }

    window.closeAllModals = async () => {
        const Modals = (await import('/src/assets/js/modals.js')).default;
        Modals.closeAllModal();
    }
});