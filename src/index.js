const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const nextFetch = 'next_fetch';

const getData = async (api) => {
  let response = await fetch(api);
  await response.json()
    .then((response) => {
      localStorage.setItem(nextFetch, response.info.next);
      const characters = response.results;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = () => {
  const myStorage = localStorage.getItem(nextFetch);
  if (myStorage) {
    getData(myStorage);
  } else {
    getData(API);
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);

window.addEventListener("beforeunload", (element) => {
  localStorage.removeItem(nextFetch);
});
