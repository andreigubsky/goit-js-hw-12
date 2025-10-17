import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions';

const query = document.querySelector('[name="search-text"]');
const button = document.querySelector('.search-image-btn');
const loadMoreButton = document.querySelector('.load-more-btn');

const emptyResponseMessage = "Sorry, there are no images matching your search query. Please try again!";
const emptyQueryMessage = "Please enter your search query image";
const endSearchResults = "We're sorry, but you've reached the end of search results.";

let page = 1;
function showErrorMessage(shownMessage) {
  iziToast.show({
    message: shownMessage,
    messageColor: '#ffffff',
    backgroundColor: '#fe5549',
    progressBar: false,
    position: 'center',
  });
}

button.addEventListener('click', async () => {
  event.preventDefault();
  if (!query.value.trim() === "") {
    query.value = "";
    await showErrorMessage(emptyQueryMessage);
    return;
  }
  clearGallery();
  showLoader();
  page = 1;

  try {
    const result = await getImagesByQuery(query.value, page);
    console.log(result.totalHits);
    if (!result.hits || result.hits.length === 0) {
      showErrorMessage(emptyResponseMessage)
      hideLoader();
    } else {
      hideLoader();
      createGallery(result.hits);
      showLoadMoreButton();
      query.value = "";
    }
  } catch (error) {
    console.log(error);
  }
})

loadMoreButton.addEventListener("click", async () => {
  event.preventDefault();
  try {
    console.log(1)
  } catch (error) {
    console.log(error);
  }

})
