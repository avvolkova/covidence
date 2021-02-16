const errMessage = document.querySelector(".error-message");

// Запрос для получения ежедневной мировой статистики. Для первоначального заполнения графика
async function getGlobalInfoAllDays() {
    try {
        const ftch = await fetch(`https://corona-api.com/timeline`);
        const { data } = await ftch.json();
        localStorage.setItem('dataByDay', JSON.stringify(data));

        return data;
    } catch (e) {
        errMessage.style.display = 'block';
        setTimeout(() => {
            errMessage.style.display = 'none';
        }, 2000)
    }
}

// Запрос для получения сводной общемировой статистики + статистики по cтранам. 
async function getLatestInfo() {
    try {
        const ftch = await fetch(`https://api.covid19api.com/summary`);
        const res = await ftch.json();
        await localStorage.setItem('countries', JSON.stringify(res.Countries));
        await localStorage.setItem('Global', JSON.stringify(res.Global));
        return data;
    } catch (e) {
        errMessage.style.display = 'block';
        setTimeout(() => {
            errMessage.style.display = 'none';
        }, 2000)
    }
}

async function getCountryInfoAllDays(country) {
    const res = await fetch(`https://api.covid19api.com/dayone/country/${country}`);
    if (res.ok) {
        return res.json();
    } else {
        throw new Error(`Не удалось получить данные по стране ${country}`)
    }
}

export { getGlobalInfoAllDays, getLatestInfo, getCountryInfoAllDays }
