import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
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

refs.form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (refs.query.value.trim() === '') {
    showErrorMessage(messages.emptyQueryMessage);
    return;
  }
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  page = 1;

  try {
    queryState = refs.query.value;
    const result = await getImagesByQuery(queryState, page);
    hideLoader();

    if (!result.hits || result.hits.length === 0) {
      showErrorMessage(messages.emptyResponseMessage)
      return;
    }

    createGallery(result.hits);
    totalPages = Math.ceil(result.totalHits / result.hits.length);

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

  showLoader();
  hideLoadMoreButton();

  try {
    const result = await getImagesByQuery(queryState, page);
    hideLoader();
    createGallery(result.hits);


    const rect = refs.gallery.getBoundingClientRect();
    window.scrollBy({
      top: rect.height * 2,
      behavior: 'smooth',
    });

    if (page >= totalPages) {
      hideLoadMoreButton();
      showErrorMessage(messages.endSearchResults);
      return;
    }

  } catch (error) {
    console.log(error);
    hideLoader();
  }
  showLoadMoreButton();

})
