const errMessage = document.querySelector(".error-message");
const loader = document.getElementById("loader");

class DBService {
    constructor() {}

    // Запрос для получения ежедневной мировой статистики. Для первоначального заполнения графика
    async getGlobalInfoAllDays() {
        try {
            loader.style.display = "block";
            if (!localStorage.getItem("dataByDay")) {
                const ftch = await fetch(`https://corona-api.com/timeline`);
                const { data } = await ftch.json();
                localStorage.setItem("dataByDay", JSON.stringify(data));
                loader.style.display = "none";
                return new Promise((res, rej) => {
                    res(localStorage.getItem("dataByDay"));
                });
            } else {
                loader.style.display = "none";
                return new Promise((res, rej) => {
                    res(localStorage.getItem("dataByDay"));
                });
            }
        } catch (e) {
            errMessage.style.display = "block";
            setTimeout(() => {
                errMessage.style.display = "none";
            }, 2000);
        }
    }

    // Запросы для получения сводной общемировой статистики + статистики по cтранам.
    async getLatestGlobalInfo() {
        try {
            if (!localStorage.getItem("Global")) {
                const ftch = await fetch(`https://api.covid19api.com/summary`);
                const res = await ftch.json();
                await localStorage.setItem("Global", JSON.stringify(res.Global));
                return new Promise((res, rej) => {
                    res(localStorage.getItem("Global"));
                });
            } else {
                return new Promise((res, rej) => {
                    res(res(localStorage.getItem("Global")));
                });
            }
        } catch (e) {
            errMessage.style.display = "block";
            setTimeout(() => {
                errMessage.style.display = "none";
            }, 2000);
        }
    }

    async getLatestCountryInfo() {
        try {
            if (!localStorage.getItem("countries")) {
                const ftch = await fetch(`https://api.covid19api.com/summary`);
                const res = await ftch.json();
                await localStorage.setItem("countries", JSON.stringify(res.Countries));

                return new Promise((res, rej) => {
                    res(localStorage.getItem("countries"));
                });
            } else {
                return new Promise((res, rej) => {
                    res(res(localStorage.getItem("countries")));
                });
            }
        } catch (e) {
            errMessage.style.display = "block";
            setTimeout(() => {
                errMessage.style.display = "none";
            }, 2000);
        }
    }

    // Запрос для получения данных по отдельной стране.
    async getCountryInfoAllDays(country) {
        try {
            if (!localStorage.getItem(country)) {
                const ftch = await fetch(
                    `https://api.covid19api.com/dayone/country/${country}`
                );
                const res = await ftch.json();
                await localStorage.setItem(country, JSON.stringify(res));

                return new Promise((res, rej) => {
                    res(localStorage.getItem(country));
                });
            } else {
                return new Promise((res, rej) => {
                    res(res(localStorage.getItem(country)));
                });
            }
        } catch (error) {
            errMessage.style.display = "block";
            setTimeout(() => {
                errMessage.style.display = "none";
            }, 2000);
        }
    }
}

export default DBService;
