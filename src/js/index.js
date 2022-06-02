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

// ======================
// Завдання - пошук країн

// Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою. 
// Подивися демо - відео роботи програми.

// HTTP-запит =======================================
// Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку. 
// Додай мінімальне оформлення елементів інтерфейсу.

// Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту. 
// Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.

// Фільтрація полів =================================
// У відповіді від бекенду повертаються об'єкти, велика частина властивостей яких, тобі не знадобиться. 
// Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів.Ознайомся з документацією синтаксису фільтрів.

// Тобі потрібні тільки наступні властивості:
// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов

// Поле пошуку ======================================
// Назву країни для пошуку користувач вводить у текстове поле input#search-box. 
// HTTP - запити виконуються при введенні назви країни, тобто на події input.
// Але робити запит з кожним натисканням клавіші не можна, оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.

// Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст. 
// Використовуй пакет lodash.debounce.

// Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.

// Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.

// Інтерфейс ========================================
// Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою. 
// Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок "Too many matches found. Please enter a more specific name.".

// Too many matches alert

// Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. 
// Кожен елемент списку складається з прапора та назви країни.

// Country list UI

// Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.

// Country info UI

// УВАГА
// Достатньо, щоб застосунок працював для більшості країн. Деякі країни, як-от Sudan, 
// можуть створювати проблеми, оскільки назва країни є частиною назви іншої країни - South Sudan.
// Не потрібно турбуватися про ці винятки.

// Обробка помилки ===================================
// Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено. 
// Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів.
// Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.

// Error alert

// УВАГА
// Не забувай про те, що fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс, 
// щоб можна було зловити і обробити помилку.