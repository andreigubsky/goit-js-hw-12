import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery, perPage } from './js/pixabay-api';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions';

let page = 1;
let totalPages = 0;

const refs = {
  query: document.querySelector('.js-input-field'),
  form: document.querySelector('.js-form'),
  loadMoreButton: document.querySelector('.js-load-more-btn'),
  gallery: document.querySelector('.js-gallery'),

}

const messages = {
  emptyResponseMessage: "Sorry, there are no images matching your search query. Please try again!",
  emptyQueryMessage: "Please enter your search query image",
  endSearchResults: "We're sorry, but you've reached the end of search results.",
}

let queryState = '';

function showErrorMessage(shownMessage) {
  iziToast.show({
    message: shownMessage,
    messageColor: '#ffffff',
    backgroundColor: '#fe5549',
    progressBar: false,
    position: 'center',
  });
}

function checkResults(hits) {
  if (!hits || hits.length === 0) {
    showErrorMessage(messages.emptyResponseMessage)
    return;
  }
}

refs.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  page = 1;
  if (refs.query.value.trim() === '') {
    showErrorMessage(messages.emptyQueryMessage);
    return;
  }
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    queryState = refs.query.value;
    const result = await getImagesByQuery(queryState, page);
    hideLoader();
    checkResults(result.hits);
    createGallery(result.hits);
    totalPages = Math.ceil(result.totalHits / perPage);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    hideLoader();
  }
})

refs.loadMoreButton.addEventListener('click', async (event) => {
  event.preventDefault();
  page += 1;

  try {

    const result = await getImagesByQuery(queryState, page);
    showLoader();
    checkResults(result.hits);
    console.log(result.hits)

    if (!result.hits) {
      showErrorMessage(messages.endSearchResults);
      return;
    }
    if (page >= totalPages) {
      hideLoadMoreButton();
      showErrorMessage(messages.endSearchResults);
      return;
    }

    createGallery(result.hits);
    hideLoader();
    showLoadMoreButton();

    const rect = refs.gallery.querySelector('li').getBoundingClientRect();
    console.log(rect)
    window.scrollBy({
      top: rect.height * 2,
      behavior: 'smooth',
    });

  } catch (error) {
    console.log(error);
  }


})
