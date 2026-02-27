// const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
// let monthNow = new Date().getMonth();
// document.querySelectorAll('[data-date]').forEach(date => {
//     date.innerHTML = "до " + daysInMonth[monthNow] + " " + months[monthNow];
// });

export default function sender(userData) {
    let utmSource = tryGetUrlParameter('utm_source');
    let utmCampaign = tryGetUrlParameter('utm_campaign');
    let utmContent = tryGetUrlParameter('utm_content');
    let utmTerm = tryGetUrlParameter('utm_term');
    let utmMedium = tryGetUrlParameter('utm_medium');

    if (utmSource != null)
        removeUtmFromStorage();

    utmSource = getStorageItem(utmSource, 'utm_source');
    utmCampaign = getStorageItem(utmCampaign, 'utm_campaign');
    utmContent = getStorageItem(utmContent, 'utm_content');
    utmTerm = getStorageItem(utmTerm, 'utm_term');
    utmMedium = getStorageItem(utmMedium, 'utm_medium');

    let domen = window.location.hostname;
    utmSource = (utmSource == '') ? domen : utmSource;

    let data =
        {
            source: 'website',
            domen: window.location.hostname,
            city: 72,
            title: `Сделай Все на 4 - 120.000₽ \nЗаявка с сайта ${window.location.hostname}`,
            utm_source: utmSource,
            utm_campaign: utmCampaign,
            utm_content: utmContent,
            utm_term: utmTerm,
            utm_medium: utmMedium,
            ...userData
        };


    function sendToBackup(data) {
        const backupUrl = 'https://test1.ud-core.ru/7nLch9FFRxA1j03T75e9CQxn6ElL6XwP/logsaver/';

        fetch(backupUrl, {
            mode: "no-cors",
            method: 'POST',
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify(data),
        })
        .catch((error) => {
            console.error('Ошибка резервной отправки:', error);
        });
    }

    fetchLead("form", data, () => { document.dispatchEvent(new CustomEvent('fetchLeadSuccess', { detail: { data } })) }, '^\\+7\\d{10}$', errorCallback => (console.log("Ошибка маски")));
    sendToBackup(data);
}