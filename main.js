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

selectCountry.addEventListener('change', () => {
    const selectedCountry = getSelectedCountry();
    setTotal(selectedCountry);
});

// достучаться до выбранной опции
function getSelectedCountry() {
    return selectCountry.options[selectCountry.selectedIndex].value;
}

// графики
let chartTemplate = document.querySelector('.chart-template');
let newDayItem = chartTemplate.querySelector('.day');
chartTemplate.innerHTML = `
    <div style='height:64px' class="day-confirmed-qty">56</div>
    <div class="day-recover-qty">44</div>
    <div class="day-dead-qty">34</div>
    `;


//кнопка обновления
const updateButton = document.querySelector('.update-button');
updateButton.addEventListener('click', function () {
    dbService.getSummary().then(data => {
        info = data;
        setTotal(getSelectedCountry())
    })
});