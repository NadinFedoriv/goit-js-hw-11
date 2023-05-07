import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import axios from 'axios';
import 'simplelightbox/dist/simple-lightbox.min.css';



const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = '36084705-51b248dff385c7068eea210ac';

const lightbox = new SimpleLightbox('.gallery a', {});

const perPage = 40;
let page = 12;
let query = '';

loadMoreBtn.style.display = 'none';

async function searchImages(query, page) {
  
  try {
       const response = await axios.get('https://pixabay.com/api/', {
         params: {
           key: apiKey,
           q: query,
           image_type: 'photo',
           orientation: 'horizontal',
           safesearch: true,
           per_page: perPage,
           page: page,
         },
       });
    
    gallery.innerHTML = '';
               
    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    
    if (images.length === 0) {
      loadMoreBtn.style.display = 'none';
       Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    else {
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      
      const cards = images.map((image) => {
        return `<div class="card">
          <a href="${image.largeImageURL}" class="card-link">
            <img class="card-image" src="${image.webformatURL}" alt="${image.tags}"></a>
            <div class="card-info">
              <p class="info-item"><span class="info-title">Likes: </span>${image.likes}</p>
              <p class="info-item"><span class="info-title">Views: </span> ${image.views}</p>
              <p class="info-item"><span class="info-title">Comments: </span> ${image.comments}</p>
              <p class="info-item"><span class="info-title">Downloads: </span> ${image.downloads}</p>
            </div>
          </div>`;
      })
      .join('');
      gallery.insertAdjacentHTML('beforeend', cards);

      lightbox.refresh();
      
      const totalPages = Math.ceil(totalHits / perPage);
        if (page < totalPages) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.");
      }                         
    } 
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  page = 1;
  query = searchInput.value.trim();
  if (!query) {
   return Notiflix.Notify.info('Search query is empty.Please try again.');
  }
  gallery.innerHTML = '';
  await searchImages(query, page);
  });


loadMoreBtn.addEventListener('click', async() => {
  page++;
  await searchImages(query, page);
   const { height: cardHeight } = document
     .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
   window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});





