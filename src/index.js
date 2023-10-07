import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });

let search = '';
let page = 1;
let totalHits = 500;
let maxTotal = 40 * page;
const refs = {
  form: document.querySelector('.search-form'),
  searchBtn: document.querySelector('.js-btn-load'),
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
refs.loadMore.addEventListener('click', getloadMore);

async function handleSearch(e) {
  e.preventDefault();
  search = e.currentTarget.searchQuery.value.trim();
  if (!search) {
    Notify.info(`Введіть текст для пошуку`);
    return;
  }
  try {
    const result = await searchData(search);
    const optionsHTML = createMarkup(result.hits);
    refs.gallery.insertAdjacentHTML('beforeend', optionsHTML);
    if (result.hits.length == 0) {
      Notify.failure(`Картинок не знайдено, спробуйте ще раз`);
    }
    console.log(result.hits); 
    lightbox.refresh();
    console.log(refs.loadMore)
    refs.loadMore.removeAttribute('hidden')
  } catch {
    console.log('err');
  } finally {
    refs.form.reset();
  }
}

async function searchData(search,page) {
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

function createMarkup(arr) {
  return arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
             <a  class="gallery__link" href="${largeImageURL}">
                 <img src= "${webformatURL}" alt="${tags}" loading="lazy" />
             </a>
             <div class="info-item">
                <p><b>Likes</b>  ${likes}</b>
                </p><p><b>Views</b>  ${views}</b>
               </p><p><b>Comments</b>  ${comments}</b>
               </p><p><b>Downloads</b> ${downloads}</b>
               </p>
            </div>
        </div>
    `
    )
    .join('');
}


async function getloadMore(){
    page += 5   
    const response = await searchData(search,page) 
    const optionsHTML = createMarkup(response.hits);
    refs.gallery.insertAdjacentHTML('beforeend', optionsHTML);
    lightbox.refresh();
    console.log(response)
}



    // new SimpleLightbox('.gallery__link', {
    //   captions: 'true',
    //   captionsData: 'alt',
    //   captionDelay: 300,
    // });