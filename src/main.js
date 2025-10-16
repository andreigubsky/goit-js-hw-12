import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions';

const query = document.querySelector('[name="search-text"]');
const button = document.querySelector('button');

const emptyResponse = "Sorry, there are no images matching your search query. Please try again!";
const emptyQuery = "Please enter your search query image";

function showErrorMessage(shownMessage) {
  iziToast.show({
    message: shownMessage,
    messageColor: '#ffffff',
    backgroundColor: '#fe5549',
    progressBar: false,
    position: 'center',
  });
}

button.addEventListener('click', event => {
  event.preventDefault();
  if (!query.value) {
    showErrorMessage(emptyQuery);
    return;
  }
  clearGallery();
  showLoader();
  getImagesByQuery(query.value)
    .then(result => {
      console.log(result)
      if (!result.hits || result.hits.length === 0) {
        showErrorMessage(emptyResponse)
      } else {
        hideLoader();
        createGallery(result.hits);
        query.value = "";
      }
    })

    .catch(error => console.log(error))

})