'use strict';

// selecting container
const countriesContainers = document.querySelector('.countries');

// selecting button
const btn = document.querySelector('.btn-country');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
   <img class="country__img" src="${data.flag}" />
   <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} people</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
   </div>
  </article>`;
  countriesContainers.insertAdjacentHTML('beforeend', html);
  countriesContainers.style.opacity = 1;
};

const renderError = function (message) {
  countriesContainers.insertAdjacentText('beforeend', message);
  countriesContainers.style.opacity = 1;
};

const getGeolocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getCoordinates = async function () {
  try {
    const geolocation = await getGeolocation();
    const coordinates = geolocation.coords;
    return [coordinates.latitude, coordinates.longitude];
  } catch (error) {
    console.error(error.message);
    renderError(`${error.message}💥\n`);
  }
};

const reverseGeocoding = async function () {
  try {
    const [latitude, longitude] = await getCoordinates();
    const response = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=492077701698496338072x121071 `
    );
    // if (!response.ok) {
    //   throw new Error('Wrong coordinates');
    // }
    const data = await response.json();
    return data.country;
  } catch (error) {
    console.error(`Wrong Coordinates: ${error.message}`);
  }
};

const getCountryData = async function () {
  try {
    const countryName = await reverseGeocoding();
    const response = await fetch(
      `https://restcountries.com/v2/name/${countryName}`
    );
    if (!response.ok) {
      throw new Error('Country not found!');
    }
    const [data] = await response.json();
    renderCountry(data);
    return data.borders[1];
  } catch (error) {
    console.error(error.message);
    renderError(`${error.message}💥`);
  }
};

const getNeighbourCountry = async function () {
  try {
    const neighbourCountry = await getCountryData();
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${neighbourCountry}`
    );
    if (!response.ok) {
      throw new Error('No neighbour country found!');
    }
    const data = await response.json();
    renderCountry(data, 'neighbour');
  } catch (error) {
    console.error(error.message);
    renderError(`${error.message}💥`);
  }
};

btn.addEventListener('click', function () {
  getNeighbourCountry();
});
