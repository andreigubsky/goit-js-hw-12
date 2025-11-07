import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions';

const query = document.querySelector('[name="search-text"]');
const searchButton = document.querySelector('.search-image-btn');
const loadMoreButton = document.querySelector('.load-more-btn');

const emptyResponseMessage = "Sorry, there are no images matching your search query. Please try again!";
const emptyQueryMessage = "Please enter your search query image";
const endSearchResults = "We're sorry, but you've reached the end of search results.";

const newGallery = new SimpleLightbox('.gallery li a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  nav: true,
  captionDelay: 250,
});

let page = 1;
let totalPages = 0;

function showErrorMessage(shownMessage) {
  iziToast.show({
    message: shownMessage,
    messageColor: '#ffffff',
    backgroundColor: '#fe5549',
    progressBar: false,
    position: 'center',
  });
}

searchButton.addEventListener('click', async (event) => {
  event.preventDefault();
  
  if (query.value.trim() === "") {
    showErrorMessage(emptyQueryMessage);
    return;
  }
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  page = 1;

  try {
    const result = await getImagesByQuery(query.value, page);
    hideLoader();

    if (!result.hits || result.hits.length === 0) {
      showErrorMessage(emptyResponseMessage)
      return;
    } 
      
      createGallery(result.hits);
      newGallery.refresh();
      totalPages = Math.ceil(result.totalHits / 15);
      
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

loadMoreButton.addEventListener("click", async (event) => {
  event.preventDefault();
  page += 1;

  showLoader();
  try {
   
    const result = await getImagesByQuery(query.value, page);

    hideLoader();
    createGallery(result.hits);
    newGallery.refresh();

    const { height: cardHeight } =
      document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page >= totalPages) {
      hideLoadMoreButton();
      showErrorMessage(endSearchResults);
      window.scrollBy({ top: -100, behavior: 'smooth' })
      return;
    }

  } catch (error) {
    console.log(error);
    hideLoader();
  }

})
