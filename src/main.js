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
  toast: document.querySelectorAll('.iziToast'),

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
    timeout: 10000,
  });
}

function hideErrorMessage(toast) {
  iziToast.destroy();
}

refs.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  page = 1;
  queryState = '';

  if (refs.toast) {
    hideErrorMessage(refs.toast)
  }

  showLoader();
  await new Promise(requestAnimationFrame);

  if (refs.query.value.trim() === '') {

    if (refs.toast) {
      hideErrorMessage(refs.toast)
    }
    hideLoader();
    await new Promise(requestAnimationFrame);
    showErrorMessage(messages.emptyQueryMessage);
    return;
  }

  hideLoadMoreButton();
  clearGallery();

  try {
    queryState = refs.query.value.trim();
    const result = await getImagesByQuery(queryState, page);
    totalPages = Math.ceil(result.totalHits / perPage);

    if (!result.hits || result.hits.length === 0) {
      if (refs.toast) {
        hideErrorMessage(refs.toast)
      }
      hideLoader();
      await new Promise(requestAnimationFrame);
      showErrorMessage(messages.emptyResponseMessage)
      return;
    }

    if (!result.hits) {
      const toast = document.querySelectorAll('.iziToast');
      if (toast) {
        hideErrorMessage(toast)
      }
      hideLoader();
      await new Promise(requestAnimationFrame);
      showErrorMessage(messages.endSearchResults);
      return;
    }

    if (page >= totalPages) {
      createGallery(result.hits);
      hideLoader();
      showErrorMessage(messages.endSearchResults);
      return;
    }

    createGallery(result.hits);
    hideLoader();

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
    const previousItemsCount = refs.gallery.children.length;
    hideLoadMoreButton();
    showLoader();
    await new Promise(requestAnimationFrame);
    const result = await getImagesByQuery(queryState, page);

    if (!result.hits || result.hits.length === 0) {
      if (refs.toast) {
        hideErrorMessage(refs.toast)
      }
      hideLoader();
      await new Promise(requestAnimationFrame);
      showErrorMessage(messages.emptyResponseMessage)
      return;
    }

    if (!result.hits) {
      if (refs.toast) {
        hideErrorMessage(refs.toast)
      }
      hideLoader();
      await new Promise(requestAnimationFrame);
      showErrorMessage(messages.endSearchResults);
      return;
    }

    if (page >= totalPages) {

      await new Promise(requestAnimationFrame);
      createGallery(result.hits);
      hideLoader();
      showErrorMessage(messages.endSearchResults);
      return;
    }

    createGallery(result.hits);
    hideLoader();
    if (page < totalPages) {
      showLoadMoreButton();

    } else {
      hideLoadMoreButton();
    }

    const firstNewItem = refs.gallery.children[previousItemsCount];
    if (firstNewItem) {
      const rect = firstNewItem.getBoundingClientRect();
      console.log(rect)
      window.scrollBy({
        top: rect.height * 2,
        behavior: 'smooth',
      });
    }



  } catch (error) {
    console.log(error);
  }



})
