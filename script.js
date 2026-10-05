const API_URL =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";


const searchInput = document.getElementById("search-input");
const marketCapButton = document.getElementById("market-cap-btn");
const percentageButton = document.getElementById("percentage-btn");

const cryptoTable = document.getElementById("crypto-table");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");


let cryptoData = [];


// ========================================
// 1. FETCH USING ASYNC / AWAIT
// ========================================

async function fetchCryptoData() {

    try {

        // Send request to API
        const response = await fetch(API_URL);


        // Check if API request was successful
        if (!response.ok) {
            throw new Error("API request failed");
        }


        // Convert response into JSON
        const data = await response.json();


        // Store API data
        cryptoData = data;


        // Display data
        displayCryptoData(cryptoData);


        // Hide loading message
        loading.style.display = "none";

    }

    catch (error) {

        console.error(error);

        loading.style.display = "none";

        errorMessage.textContent =
            "Unable to load cryptocurrency data.";

    }

}


// ========================================
// 2. DISPLAY DATA
// ========================================

function displayCryptoData(data) {

    cryptoTable.innerHTML = "";

    data.forEach(coin => {

        const row = document.createElement("tr");

        const percentage =
            coin.price_change_percentage_24h ?? 0;

        const percentageClass =
            percentage >= 0 ? "green" : "red";


        row.innerHTML = `

            <td>
                <div class="coin-name">

                    <img
                        src="${coin.image}"
                        alt="${coin.name}"
                    >

                    <span>${coin.name}</span>

                </div>
            </td>

            <td class="symbol">
                ${coin.symbol}
            </td>

            <td>
                $${coin.current_price.toLocaleString()}
            </td>

            <td>
                $${coin.total_volume.toLocaleString()}
            </td>

            <td class="${percentageClass}">
                ${percentage.toFixed(2)}%
            </td>

            <td>
                Mkt Cap :
                $${coin.market_cap.toLocaleString()}
            </td>

        `;

        cryptoTable.appendChild(row);

    });
}


// ========================================
// 3. SEARCH
// ========================================

searchInput.addEventListener("input", () => {

    const searchValue =
        searchInput.value.toLowerCase().trim();


    const filteredData = cryptoData.filter(coin => {

        return (
            coin.name.toLowerCase().includes(searchValue) ||
            coin.symbol.toLowerCase().includes(searchValue)
        );

    });


    displayCryptoData(filteredData);

});


// ========================================
// 4. SORT BY MARKET CAP
// ========================================

marketCapButton.addEventListener("click", () => {

    const sortedData = [...cryptoData].sort((a, b) => {

        return b.market_cap - a.market_cap;

    });

    displayCryptoData(sortedData);

});


// ========================================
// 5. SORT BY PERCENTAGE
// ========================================

percentageButton.addEventListener("click", () => {

    const sortedData = [...cryptoData].sort((a, b) => {

        return (
            b.price_change_percentage_24h -
            a.price_change_percentage_24h
        );

    });

    displayCryptoData(sortedData);

});


// ========================================
// START
// ========================================

fetchCryptoData();