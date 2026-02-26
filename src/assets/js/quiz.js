const nextBtn = document.querySelector('.quiz__control-button--next');
const prevBtn = document.querySelector('.quiz__control-button--prev');
const controls = document.querySelector('.quiz__controls');
const quizForm = document.querySelector('.quiz__questions-form');
const questionsList = document.querySelector('.quiz__questions-list');
const progressList = document.querySelector('.quiz__progress-list');
const progressItems = document.querySelectorAll('.quiz__progress-item')

const phoneInput = document.querySelector('.quiz__input');
const submitBtn = document.querySelector('.quiz__submit');

let activeIndex = 0;

const quizAnswers = { phone: '' };

/* =======================
   HELPERS
======================= */

const setDisabled = (el, disabled) => {
    if (!el) return;
    el.disabled = !!disabled;
    if (disabled) el.setAttribute('disabled', 'disabled');
    else el.removeAttribute('disabled');
};


const normalizeRuDigits = (raw) => {
    const digits = String(raw ?? '').replace(/\D/g, '');
    let cleaned = digits;

    if (cleaned.startsWith('8')) cleaned = '7' + cleaned.slice(1);
    if (!cleaned.startsWith('7') && cleaned.startsWith('9')) {
        cleaned = '7' + cleaned;
    }

    return cleaned.slice(0, 11);
};

const formatQuizPhone = (raw) => {
    const cleaned = normalizeRuDigits(raw);
    const rest = cleaned.startsWith('7') ? cleaned.slice(1) : cleaned;

    const p1 = rest.slice(0, 3);
    const p2 = rest.slice(3, 6);
    const p3 = rest.slice(6, 8);
    const p4 = rest.slice(8, 10);

    return `+7 (${p1.padEnd(3, '_')}) - ${p2.padEnd(3, '_')} - ${p3.padEnd(
        2,
        '_'
    )} - ${p4.padEnd(2, '_')}`;
};

const toE164 = (raw) => {
    const cleaned = normalizeRuDigits(raw);
    const rest = cleaned.startsWith('7') ? cleaned.slice(1) : cleaned;
    return '+7' + rest.slice(0, 10);
};

const shouldActivateMask = (val) =>
    /^(\+|7|8|\d)/.test(String(val ?? '').trim());

const isPhoneValid = (val) => {
    const digits = normalizeRuDigits(val);
    return digits.length === 11 && digits.startsWith('7');
};

const hasAnswerOnSlide = (slideEl) =>
    !!slideEl?.querySelector('input[type="radio"]:checked');

const setCaretToNextPlaceholder = (input) => {
    const idx = input.value.indexOf('_');
    const pos = idx === -1 ? input.value.length : idx;
    input.setSelectionRange(pos, pos);
};

/* =======================
   QUIZ
======================= */

document.addEventListener('DOMContentLoaded', () => {
    if (!quizForm || !questionsList) return;

    const slidesCount = questionsList.children.length;
    const lastIndex = slidesCount - 1;

    let maskActive = false;

    const updateProgress = () => {
        if (!progressItems?.length) return;

        // если последний слайд (телефон) — считаем что всё пройдено
        const maxActive = Math.min(activeIndex, progressItems.length - 1);

        progressItems.forEach((item, i) => {
            item.classList.toggle('quiz__progress-item--active', i <= maxActive);
        });
    };

    const updateNextAvailability = () => {
        if (activeIndex >= lastIndex) {
            setDisabled(nextBtn, true);
            return;
        }
        setDisabled(
            nextBtn,
            !hasAnswerOnSlide(questionsList.children[activeIndex])
        );
    };

    const updateSubmitAvailability = () => {
        if (!submitBtn) return;
        setDisabled(submitBtn, !isPhoneValid(phoneInput?.value));
    };

    const updateSlide = () => {
        questionsList.style.transform = `translate(${-100 * activeIndex}%)`;
        updateNextAvailability();
        updateProgress();

        const isFinal = activeIndex >= lastIndex;
        progressList.style.display = isFinal ? 'none' : '';
        prevBtn.style.display = activeIndex <= 0 ? 'none' : '';
        nextBtn.style.display = isFinal ? 'none' : '';
    };

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (
            activeIndex < lastIndex &&
            hasAnswerOnSlide(questionsList.children[activeIndex])
        ) {
            activeIndex++;
            updateSlide();
        }
    });

    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (activeIndex > 0) {
            activeIndex--;
            updateSlide();
        }
    });

    questionsList.addEventListener('change', (e) => {
        const input = e.target;
        if (!(input instanceof HTMLInputElement) || input.type !== 'radio') return;

        const questionItem = input.closest('.quiz__question-item');
        if (!questionItem) return;

        const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

        const title = clean(
            questionItem.querySelector('.quiz__question-title')?.textContent
        );
        const answer = clean(
            input.closest('label')?.querySelector('.quiz__answer')?.textContent
        );

        quizAnswers[input.name || `question${activeIndex + 1}`] =
            `${title}: ${answer}`;

        activeIndex++;
        updateSlide();
    });

    /* =======================
       PHONE
    ======================= */

    if (phoneInput) {
        const clearPhone = () => {
            maskActive = false;
            phoneInput.value = '';
            quizAnswers.phone = '';
            updateSubmitAvailability();
        };

        const renderDigits = (digits) => {
            phoneInput.value = formatQuizPhone(digits);
            quizAnswers.phone = toE164(phoneInput.value);
            setCaretToNextPlaceholder(phoneInput);
            updateSubmitAvailability();
        };

        phoneInput.addEventListener('input', () => {
            if (!maskActive) {
                if (!shouldActivateMask(phoneInput.value)) {
                    quizAnswers.phone = '';
                    updateSubmitAvailability();
                    return;
                }
                maskActive = true;
            }

            phoneInput.value = formatQuizPhone(phoneInput.value);
            quizAnswers.phone = toE164(phoneInput.value);
            setCaretToNextPlaceholder(phoneInput);
            updateSubmitAvailability();
        });

        phoneInput.addEventListener('keydown', (e) => {
            if (!maskActive) return;
            if (e.key !== 'Backspace' && e.key !== 'Delete') return;

            e.preventDefault();

            const { selectionStart, selectionEnd, value } = phoneInput;
            if (selectionStart === 0 && selectionEnd === value.length) {
                clearPhone();
                return;
            }

            const digits = normalizeRuDigits(phoneInput.value);
            if (!digits || digits === '7') {
                clearPhone();
                return;
            }

            renderDigits(digits.slice(0, -1));
        });

        phoneInput.addEventListener('blur', updateSubmitAvailability);
    }

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isPhoneValid(phoneInput?.value)) return;
        sender(quizAnswers);
    });

    updateSlide();
    updateSubmitAvailability();
});