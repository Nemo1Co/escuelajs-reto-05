const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const nextFetch = 'next_fetch';
const prevFetch = 'prev_fetch';

const getData = async (api) => {
  let response = await fetch(api);
  await response.json()
    .then((response) => {
      sessionStorage.setItem(nextFetch, response.info.next);
      sessionStorage.setItem(prevFetch, response.info.prev);
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
    .catch((error) => console.log(error));
}

const loadData = () => {
  const myStorageNext = sessionStorage.getItem(nextFetch);
  const myStoragePrev = sessionStorage.getItem(prevFetch);
  if (myStorageNext) {
    getData(myStorageNext);
  } else {
    if (myStoragePrev) {
      intersectionObserver.unobserve($observe);
      window.alert('Ya no hay personajes...');
    } else {
      getData(API);
    }
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
  sessionStorage.clear();
});
