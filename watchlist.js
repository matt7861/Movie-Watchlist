const movieList = document.getElementById("movie-list-results");
const localList = localStorage.getItem("watchlist");
const movieWatchlist = localList ? JSON.parse(localList) : [];
let movieListHtml = "";

document.addEventListener("click", (e) => {
  if (e.target.dataset.id) addToWatchlist(e.target.dataset.id, e.target);
});

async function getMovieDetails(data) {
  // Reset and display loading
  placeholder.innerHTML = '<div class="loading"></div>';
  movieList.innerHTML = "";
  movieListHtml = "";
  for (let movie of data) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${movie}&type=movie&apikey=e18e4510`
    );
    const data = await res.json();
    movieListHtml += `
        <div class="movie">
          <img class="movie__thumbnail" src="${data.Poster}"" alt="">
          <div class="movie__details">
              <div class="movie__title">
                  <h3>${data.Title}</h3>
                  <div class="movie__rating">
                      <img src="/images/star.svg" alt="star icon">
                      <p>${data.imdbRating}</p>
                  </div>
              </div>
              <div class="movie__info">
                  <p>${data.Runtime} min</p>
                  <p>${data.Genre}</p>
                  <button class="add-to-watchlist" data-id="${data.imdbID}"><img src="/images/remove.svg"><span>Remove</span></button>
              </div>
              <p>${data.Plot}</p>
          </div>
      </div>
    `;
  }
}

async function renderHtml() {
  if (movieWatchlist.length > 0) {
    await getMovieDetails(movieWatchlist);
    movieList.innerHTML = movieListHtml;
    placeholder.innerHTML = "";
  } else {
    movieList.innerHTML = "";
    placeholder.innerHTML = `
        <p class="light">Your watchlist is looking a little empty...</p>
            <a href="index.html">
                <img src="images/add.svg" alt="add icon">
                Let's add some movies!
            </a>
      `;
  }
}

renderHtml();

function addToWatchlist(id) {
  if (movieWatchlist.includes(id)) {
    movieWatchlist.splice(movieWatchlist.indexOf(id), 1);
    localStorage.setItem("watchlist", JSON.stringify(movieWatchlist));
    renderHtml();
  }
}
