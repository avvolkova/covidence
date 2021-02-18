import chart from "./chart.js";
import DBService from "./fetch.js";
const errMessage = document.querySelector(".error-message");
const selectCountriesMenu = document.getElementById("select-country");

async function init() {
  /* заполняем исходные данные таблички и графика(global) */
  const dbService = new DBService();
  let myChart;
  const chartData = await dbService.getGlobalInfoAllDays();
  myChart = await chart(JSON.parse(chartData).slice(1, 11));

  await dbService.getLatestGlobalInfo();
  await fillSelectMenu("Global");
  await setTableData("Global");

  const countries = await dbService.getLatestCountryInfo();
  await JSON.parse(countries).forEach((item) => {
    fillSelectMenu(item.Country);
  });

  /* при переключении страны отображаем актуальные данные таблицы и  графика*/
  selectCountriesMenu.addEventListener("change", async () => {
    const currentCountry = selectCountriesMenu.options[selectCountriesMenu.selectedIndex].value;
    const currentSlug = JSON.parse(localStorage.getItem("countries")).find(
      (count) => count.Country === currentCountry
    ).Slug;
    const countryData = await dbService.getCountryInfoAllDays(currentSlug);
    const latestCountryData = await JSON.parse(countryData);
    await setTableData(currentSlug);
    await myChart.destroy();
    myChart = await chart(latestCountryData.slice(-11, -1));
  }); 
}

// наполняем поле выбора страны: отдельно global(Total World),отдельно countries
function fillSelectMenu(opt) {
  const option = document.createElement("option");
  option.textContent = opt;
  option.value = opt;
  selectCountriesMenu.append(option);
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

init();
