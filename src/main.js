import sender from "./assets/js/sender.js";
import "./assets/js/utils.js";
import "./assets/js/modals.js";
import "./assets/js/goto.js";
import "./assets/js/quiz.js";
import "./scss/index.scss";
import "./assets/js/animations.js";
import "./assets/js/masks.js";
import Modals from "./assets/js/modals.js";

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('form.form').forEach(form => {
        const phone = form.querySelector('[data-mask-phone]');
        let phoneValue = null;

        form.onsubmit = async (e) => {
            e.preventDefault();

            window.imasks.forEach(el => {
                if (el.phoneEl === phone && !phoneValue && el.mask.value) {
                    phoneValue = clearPhone(el.mask.value);
                }
            })

            sender({ phone: phoneValue });
        }
    });

    document.addEventListener('fetchLeadSuccess', (e) => {
       document.querySelector('.loading')?.remove();
       Modals.closeAllModal();
       console.clear();
       Modals.openModal({ modalElement: document.querySelector('.modal-success') });
    });
});