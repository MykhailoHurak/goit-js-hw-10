import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchcountries';

const URL = 'https://restcountries.com/v3.1/name/';
const OPTIONS = '?fields=name,capital,population,flags,languages';
const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const list = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function search(element) {
  const name = element.target.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(countries => {
      if (countries.length > 18) {
        clearCountriesList();
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length > 1) {
        clearCountriesInfo();
        markupCountriesList(countries);
      } else if (countries.length === 1) {
        clearCountriesList();
        markupCountryInfo(countries);
      }
    })
    .catch(error => Notify.failure('❌ Oops, there is no country with that name'));
}

function markupCountriesList(countries) {
  const countryList = countries
    .map(
      country =>
    `<li class="country-list-item">
      <img src="${country.flags.svg}" alt="Country flag">
      <h2 class="country-list-name">${country.name.common}</h2>
    </li>`)
    .join('');
  countriesList.innerHTML = countryList;
}

function clearCountriesList() {
  const countryList = '';
  countriesList.innerHTML = countryList;
}

function clearCountriesInfo() {
  const countryPropertys = '';
  list.innerHTML = countryPropertys;
}

function markupCountryInfo(countries) {
  const countryPropertys = countries
    .map(
      country =>
    `<div class="country-info_title">
      <img src="${country.flags.svg}" alt="Country flag">
      <h1 class="country-info_name">${country.name.official}</h1>
    </div>
    <ul class="country-info_list">
      <li name="capital">Capital: ${country.capital}</li>
      <li name="population">Population: ${country.population}</li>
      <li name="languages">Languages: ${Object.values(country.languages)}</li>
    </ul>`,
    )
    .join('');
  list.innerHTML = countryPropertys;
}