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
    timeout: 10000,
  });
}



refs.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  page = 1;
  queryState = '';


  hideLoadMoreButton();
  clearGallery();
  showLoader();
  await new Promise(requestAnimationFrame);

  if (refs.query.value.trim() === '') {
    hideLoader();
    showErrorMessage(messages.emptyQueryMessage);
    return;
  }

  try {
    queryState = refs.query.value.trim();
    const result = await getImagesByQuery(queryState, page);
    totalPages = Math.ceil(result.totalHits / perPage);

    if (!result.hits || result.hits.length === 0) {

      hideLoader();
      showErrorMessage(messages.emptyResponseMessage)
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
  } finally {
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
  } finally {
    hideLoader();
  }
})
