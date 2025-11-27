import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '/css/animations.css';

const gallery = document.querySelector('ul.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more-btn');
const newGallery = new SimpleLightbox('.gallery li a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  nav: true,
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `<li class="gallery-item js-gallery-item">
                <a class="gallery-link" href="${largeImageURL}">
                  <img class="gallery-image" src="${webformatURL}" width='100px' alt="${tags.split(",").slice(0, 3).join(",")}">
                  <ul class="image-params">
                    <li><b>Likes</b>:<br> ${likes}</li>
                    <li><b>Views</b>:<br> ${views}</li>
                    <li><b>Comments</b>:<br> ${comments}</li>
                    <li><b>Downloads</b>:<br> ${downloads}</li>
                  </ul>
                </a>
              </li>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  newGallery.refresh();
}

export function clearGallery() {
  gallery.innerHTML = "";
}

export function showLoader() {
  gallery.classList.remove('is-shown');
  loader.classList.add('is-shown');
}

export function hideLoader() {
  loader.classList.remove('is-shown');
  gallery.classList.add('is-shown');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.add('is-shown');
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.remove('is-shown');
}