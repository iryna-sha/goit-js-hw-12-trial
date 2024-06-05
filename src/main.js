import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getImages } from './js/pixabay-api.js';
import { imageTemplate } from './js/render-functions.js';

const searchForm = document.querySelector('.search-form');
const imageGallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'Load more';
loadMoreBtn.classList.add('load-more');
imageGallery.parentNode.insertBefore(loadMoreBtn, imageGallery.nextSibling);
loadMoreBtn.style.display = 'none';
const loaderContainer = document.createElement('div');
loaderContainer.appendChild(loader);
loadMoreBtn.parentNode.insertBefore(loaderContainer, loadMoreBtn.nextSibling);

let imageName = '';
let currentPage = 1;
let totalHits = 0;

searchForm.addEventListener('input', (event) => {
  imageName = event.target.value.trim();
});

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  imageGallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  showLoader();

  if (!imageName) {
    showInfoMessage('Please enter a search query!', 'blue');
    hideLoader();
    return;
  }

  try {
    const data = await getImages(imageName, currentPage);
    totalHits = data.totalHits;
    if (data.hits.length === 0) {
      showInfoMessage('Sorry, there are no images matching your search query. Please try again!', 'red');
      return;
    }

    renderImages(data.hits);
    lightbox.refresh();
    checkLoadMoreVisibility();
  } catch (error) {
    showInfoMessage('An error occurred while fetching images. Please try again later.', 'orange');
    console.error(error);
  } finally {
    hideLoader();
  }

  event.target.reset();
}

async function onLoadMore() {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImages(imageName, currentPage);
    renderImages(data.hits);
    lightbox.refresh();
    scrollPage();
    checkLoadMoreVisibility();
  } catch (error) {
    showInfoMessage('An error occurred while fetching images. Please try again later.', 'orange');
    console.error(error);
  } finally {
    hideLoader();
  }
}

function renderImages(images) {
  const markup = imageTemplate(images);
  imageGallery.insertAdjacentHTML('beforeend', markup);
}

function checkLoadMoreVisibility() {
  if (currentPage * 15 >= totalHits) {
    loadMoreBtn.style.display = 'none';
    showInfoMessage("We're sorry, but you've reached the end of search results.", 'blue');
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

function scrollPage() {
  const { height } = document.querySelector('.gallery-item').getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

function showLoader() {
  loader.style.display = 'inline-block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showInfoMessage(message, bgColor) {
  iziToast.info({
    position: 'topRight',
    timeout: 1800,
    maxWidth: 300,
    icon: 'none',
    message: message,
    backgroundColor: bgColor,
  });
}

// Initialize SimpleLightbox
let lightbox = new SimpleLightbox(".gallery a", { captionDelay: 250, captionsData: "alt" });
