class Modals {
    constructor(modalSelector) {
        Modals.findModals(modalSelector);
    }

    static findModals(selector) {
        document.querySelectorAll(selector).forEach(e => {

            console.log(e);

        });
    }

    static getModals() {

    }


}

document.addEventListener('DOMContentLoaded', () => {

    new Modals('.modal');

});