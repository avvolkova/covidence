class DBService {
    getSummary = async function () {
        const res = await fetch('https://api.covid19api.com/summary')

        if (res.ok) {
            return res.json()
        } else {
            throw new Error('Не удалось получить summary')
        }
    }
}

const selectField = document.querySelector('.select-country');
let savedInfo;

new DBService().getSummary().then(data => {
    const optionGlobal = document.createElement('option');
    optionGlobal.textContent = 'Global';
    optionGlobal.value = 'Global';
    selectField.append(optionGlobal);


    savedInfo = data;
    savedInfo.Countries.forEach(country => {
        const option = document.createElement('option');
        option.textContent = country.Country;
        option.value = country.Slug;
        selectField.append(option);
    });

    setData()
});

const confirmed = document.querySelector('.confirmed-number');
const recovered = document.querySelector('.recover-number');
const deaths = document.querySelector('deaths-number');
const byDay = document.querySelector('day-number');

function setData(selectedCountry) {
    let countryStat;
    if (selectedCountry === 'Global') {
        countryStat = savedInfo.Global;
    } else {
        countryStat = savedInfo.Countries;
    }

    confirmed.textContent = countryStat.TotalConfirmed;
}