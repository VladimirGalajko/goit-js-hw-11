

export const createMarkup = function(arr) {
    return arr
      .map(
        ({
          largeImageURL,
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<div class="photo-card">
               <a  class="gallery__link" href="${largeImageURL}">
                   <img src= "${webformatURL}" alt="${tags}" loading="lazy" />
                   </a>
               <div class="info-item">
               <div>
                  <p><b>Likes</b> ${likes}</p>
                  <p><b>Views</b> ${views}</p>
               </div>
               <div>
                  <p><b>Comments</b> ${comments}</p>
                  <p><b>Downloads</b> ${downloads}</p>
               </div>
  
                
              </div>       
          </div>
      `
      )
      .join('');
  }