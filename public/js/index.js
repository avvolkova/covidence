import chart from "./chart.js";
import {
  getGlobalInfoAllDays,
  getLatestInfo,
  getCountryInfoAllDays,
} from "./fetch.js";
const errMessage = document.querySelector(".error-message");
const selectCountriesMenu = document.getElementById("select-country");

const loader = document.getElementById("loader");

let myChart;
// заполняем исходные данные таблички и графика(global)
checkStorage();

if (!localStorage.getItem("dataByDay")) {
  loader.style.display = "block";
  getGlobalInfoAllDays().then((data) => {
    loader.style.display = "none";
    chart(data.slice(1, 11));
  });
}

if (!localStorage.getItem("countries")) {
  getLatestInfo().then(() => {
    fillSelectMenu("Global", "countries");
    setTableData("Global");
  });
}

fillSelectMenu("Global", "countries");
setTableData("Global");

myChart = chart(JSON.parse(localStorage.getItem("dataByDay")).slice(1, 11));

// при переключении страны отображаем актуальные данные таблицы и графика
selectCountriesMenu.addEventListener("change", async () => {
  const currentCountry =
    selectCountriesMenu.options[selectCountriesMenu.selectedIndex].value;
  setTableData(currentCountry);
  const data = await getCountryInfoAllDays(currentCountry);
  localStorage.setItem(
    currentCountry,
    JSON.stringify(
      data.splice(data.length - 10, 10).sort((a, b) => b.Date - a.Date)
    )
  );
  myChart.destroy();
  myChart = chart(JSON.parse(localStorage.getItem(currentCountry)));
});

function checkStorage() {
  const currentDate = moment().format("YYYY-MM-DD");
  if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate);
  }
}

// наполняем поле выбора страны: отдельно global(Total World),отдельно countries
function fillSelectMenu(globalOpt, countryOpt) {
  const optionGlobal = document.createElement("option");
  optionGlobal.textContent = globalOpt;
  optionGlobal.value = globalOpt;
  selectCountriesMenu.append(optionGlobal);

  if (localStorage.getItem("countries")) {
    JSON.parse(localStorage.getItem(countryOpt)).forEach((entry) => {
      const opt = document.createElement("option");
      opt.textContent = entry.Country;
      opt.value = entry.Slug;
      selectCountriesMenu.append(opt);
    });
  }
}

function setTableData(currCountry) {
  const tableData = document.querySelectorAll(".number");

  if (currCountry === "Global") {
    const countryData = JSON.parse(localStorage.getItem("Global"));
    fillTables(countryData);
  } else {
    const countryData = JSON.parse(localStorage.getItem("countries")).find(
      (count) => count.Slug === currCountry
    );
    fillTables(countryData);
  }

  function fillTables(dataArr) {
    tableData.forEach((td) => {
      let status = td.dataset.status;
      td.textContent = `+${formatNumber(dataArr[status])}`;
    });
  }

  function formatNumber(number) {
    return new Intl.NumberFormat("ru-RU").format(number);
  }
}
