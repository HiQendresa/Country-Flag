"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const currencyArray = Object.values(data.currencies);
  const languageArray = Object.values(data.languages);
  const flagArray = Object.values(data.flags);
  const country = Object.values(data.name);

  const html = `
        <article class="country ${className}">
          <img class="country__img" src="${flagArray[0]}" />
          <div class="country__data">
            <h3 class="country__name">${country[1]}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${languageArray[0]}</p>
            <p class="country__row"><span>💰</span>${currencyArray[0].name} ${
    currencyArray[0].symbol
  }</p>
          </div>
        </article>
      `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};
const getJSON = function (url, errorMsg = `Something went wrong`) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

const getCountryData = function (country) {
  ///Country 1
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    "Country not found "
  )
    .then((data) => {
      renderCountry(data[0]);

      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error("No nighbour found!");

      //Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        "Country not found"
      );
    })
    .then((data) => renderCountry(data[0], "neighbour"))
    .catch((err) => {
      console.error(`${err} ⚡⚡⚡`);

      renderError(`Something went wrong ⚡⚡ ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  getCountryData("portugal");
});
