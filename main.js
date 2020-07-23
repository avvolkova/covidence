const API_URL = 'https://api.covid19api.com/';

function buildUrl(path) {
    return API_URL + path;
}

class DBservice {
    getSummary = async function () {
        const res = await fetch(buildUrl('summary'));
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по странам`)
        }
    };

    // для графика
    async getTotal(country) {
        const res = await fetch(buildUrl(`dayone/country/${country}`));
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по стране ${country}`)
        }
    }
}

const selectCountry = document.getElementById('select-country');
let info;

const dbService = new DBservice();
dbService.getSummary().then(data => {
    // data = data.sort((c1, c2) => c1.Country.localeCompare(c2.Country));
    // эти данные и так отсортированы. оставляю сортировку на всякий случай

    // наполняем поле выбора страны: отдельно global(Total World),отдельно countries
    const optionGlobal = document.createElement('option');
    optionGlobal.textContent = 'Total World';
    optionGlobal.value = 'Global';
    selectCountry.append(optionGlobal);

    info = data;
    const countryArr = data.Countries;
    countryArr.forEach(country => {
        const option = document.createElement('option');
        option.value = country.Slug;
        option.textContent = country.Country;
        selectCountry.append(option);

    });

    setTotal('Global');
});


// заполняем исходные данные таблички(global)

const tableData = document.querySelectorAll('.number');

function setTotal(selectedCountry) {
    let countryStat;
    if (selectedCountry === 'Global') {
        countryStat = info.Global;
    } else {
        countryStat = info.Countries.find((country) => country.Slug === selectedCountry);
    }

    tableData.forEach((td) => {
        let status = td.dataset.status;
        td.textContent = `+${formatNumber(countryStat[status])}`
    });

}

function formatNumber(number) {
    return new Intl.NumberFormat('ru-RU').format(number);
}

//графики

selectCountry.addEventListener('change', () => {
    const selectedCountry = getSelectedCountry();
    setTotal(selectedCountry);
    // получить данные для графика
    dbService.getTotal(selectedCountry).then(countryTotalInfo => {
        buildChart(countryTotalInfo);
    })
});

const chart = document.querySelector('.chart');

const chartHeight = chart.clientHeight;


function buildChart(totalByDay) {
    chart.innerHTML = '';
// копируем массив для того, чтобы найти самый большой confirmed, но не сортировать исходные даные
    let maxConfirmed = [...totalByDay].sort((a, b) => b.Confirmed - a.Confirmed)[0].Confirmed;

    totalByDay.forEach(dayData => {

        const bar = document.createElement('div');
        bar.style.minWidth = getWidth();
        bar.style.height = getHeight();
        bar.classList.add('confirmed-bar-color');
        bar.classList.add('confirmed-display');
        bar.title =
            `${(new Date(dayData.Date).toLocaleDateString())} 
            Confirmed: ${dayData.Confirmed} 
            Recovered: ${dayData.Recovered} 
            Deaths: ${dayData.Deaths}`;
        chart.appendChild(bar);


        function getWidth() {
            return (chart.clientWidth / totalByDay.length - 2.5) + 'px';
        }

        function getHeight() {
            return chartHeight * (dayData.Confirmed) / maxConfirmed + 'px';
        }

        const deathsBar = document.createElement('div');
        deathsBar.style.width = bar.style.minWidth;
        deathsBar.style.height = getDeathsHeight();
        deathsBar.classList.add('deaths-bar-color');
        bar.append(deathsBar);

        function getDeathsHeight() {
            return chartHeight * (dayData.Deaths) / maxConfirmed + 'px';
        }

        const recoverBar = document.createElement('div');
        recoverBar.style.width = bar.style.minWidth;
        recoverBar.style.height = getRecoverHeight();
        recoverBar.classList.add('recover-bar-color');
        bar.append(recoverBar);

        function getRecoverHeight() {
            return chartHeight * (dayData.Recovered) / maxConfirmed + 'px';
        }
        const border = document.createElement('div');
        border.style.width = bar.style.minWidth;
        border.style.height = chartHeight;
        border.classList.add('border');
        chart.append(border);

    });
}


// достучаться до выбранной опции
function getSelectedCountry() {
    return selectCountry.options[selectCountry.selectedIndex].value;
}

//кнопка обновления
const updateButton = document.querySelector('.update-button');
updateButton.addEventListener('click', function () {
    dbService.getSummary().then(data => {
        info = data;
        setTotal(getSelectedCountry())
    })
});