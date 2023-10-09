import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './markup.js';


let search = '';
let page = 1;
let totalHits = '';
let hits = '';
const refs = {
  form: document.querySelector('.search-form'),
  searchBtn: document.querySelector('.js-btn-search'),
  laodBtn: document.querySelector('.loader'),
  loadMore: document.querySelector('.js-btn-load'),
  gallery: document.querySelector('.gallery'),
};

let lightbox = new SimpleLightbox('.gallery__link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', handleSearch);
async function handleSearch(e) {
  refs.loadMore.setAttribute('hidden', true);
  page = 1;
  e.preventDefault();
  search = e.currentTarget.searchQuery.value.trim();
  if (!search) {
    Notify.info(`Введіть текст для пошуку`);
    return;
  }
  try {
    const result = await searchData(search,page);
    totalHits = result.totalHits;
    hits = result.hits.length;
    totalHits -= hits;

    const optionsHTML = createMarkup(result.hits);
    refs.gallery.innerHTML = optionsHTML;

    if (result.total > 0) {
      Notify.success(`Horray! We found ${result.totalHits} images`);
    } else {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
    if (hits >= 40) {
      refs.loadMore.removeAttribute('hidden');
    }
    lightbox.refresh();
  } catch (err) {
    Notify.failure(err.message);
  } finally {
    refs.form.reset();
  }
}

refs.loadMore.addEventListener('click', getloadMore);
async function getloadMore() {
  if (totalHits <= 0) {
    page = 1;
    refs.loadMore.setAttribute('hidden', true);
    Notify.info(`We're sorry, but you've reached the end of search results.`, {
      className: 'notify-warning',
      width: '300px',
      position: 'center-bottom',
      warning: { background: '#ff827e' },
    });
    return;
  }

  try {
    page += 1;
    totalHits -= hits;
    const response = await searchData(search, page);
    const optionsHTML = createMarkup(response.hits);
    refs.gallery.insertAdjacentHTML('beforeend', optionsHTML);
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();   
    window.scrollBy({
      top: cardHeight * 2.6,
      behavior: 'smooth',
    });
  } catch (err) {
    Notify.failure(err.message);
    refs.loadMore.setAttribute('hidden', true);
  }
}

async function searchData(search, page) {  
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '39891458-4c88624de20012882beea7343';
  const params = new URLSearchParams({
    key: API_KEY,
    q: search,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: 40,
  });
 
  const response = await axios.get(`${BASE_URL}?${params}`);
  
  return response.data;
}
