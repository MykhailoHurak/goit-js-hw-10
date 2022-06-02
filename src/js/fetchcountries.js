const URL = 'https://restcountries.com/v3.1/name/';
const OPTIONS = '?fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${URL}${name}${OPTIONS}`).then(response => {
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

export default fetchCountries;