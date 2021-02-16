export default function chart(infoByDay) {
    const chart = document.getElementById("chart").getContext("2d");
    const chartOptions = {
        scales: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart'
                }
            },
        },
        responsive: true,
    };

    const newConfirmed = [];
    const newRecovered = [];
    const newDeaths = [];
    const dates = [];
    infoByDay.forEach((dayData, i, arr) => {
        if (i < arr.length - 1) {
            // console.log(arr[i + 1]);
            dates.push(dayData.date || formatDate(dayData.date))
            newConfirmed.push(dayData.new_confirmed || arr[i + 1].Confirmed - dayData.Confirmed);
            newRecovered.push(dayData.new_recovered || arr[i + 1].Recovered - dayData.Recovered);
            newDeaths.push(dayData.new_deaths || arr[i + 1].Deaths - dayData.Deaths);
        }
    });
    // console.log(newConfirmed, newRecovered, newDeaths, dates);
    const barChartData = {
        labels: dates,
        datasets: [{
            label: 'Confirmed per day',
            data: removeNegativeValues(newConfirmed),
            backgroundColor: '#a4772b',
            borderColor: 'black',
            borderWidth: 1,

        }, {
            label: 'Recovered per day',
            data: removeNegativeValues(newRecovered),
            backgroundColor: '#29A39E',
            borderColor: 'black',
            borderWidth: 1,

        }, {
            label: 'Deaths per day',
            data: removeNegativeValues(newDeaths),
            backgroundColor: '#B92E32',
            borderColor: 'black',
            borderWidth: 1,
        }]
    }

    console.log("barChartData", barChartData);

    return new Chart(chart, {
        type: 'bar',
        data: barChartData,
        options: chartOptions
    });
}


function removeNegativeValues(arr) {
    return arr.map(value => value = value < 0 ? 0 : value)
}

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD')
}
