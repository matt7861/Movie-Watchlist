const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list-results");
const placeholder = document.getElementById("placeholder");
const localList = localStorage.getItem("watchlist");
const movieWatchlist = localList ? JSON.parse(localList) : [];
let movieListHtml = "";

searchForm.addEventListener("submit", getMovies);
document.addEventListener("click", (e) => {
  if (e.target.dataset.id) addToWatchlist(e.target.dataset.id, e.target);
});

async function getMovies(e) {
  e.preventDefault();

  // Reset and display loading
  placeholder.innerHTML = '<div class="loading"></div>';
  movieList.innerHTML = "";
  movieListHtml = "";

  // get form data
  const formData = new FormData(searchForm);
  const searchValue = formData.get("search");

  // fetch movie and generate movie details html
  const res = await fetch(
    `https://www.omdbapi.com/?s=${searchValue}&type=movie&page=1&apikey=e18e4510`
  );
  const data = await res.json();

  if (data.Search) {
    await getMovieDetails(data.Search);
    movieList.innerHTML = movieListHtml;
    // remove loading
    placeholder.innerHTML = "";
    // Check if movie is already in watchlist
    updateButtons();
  } else {
    // no results found
    placeholder.innerHTML =
      "<p class='no-results'>Unable to find what you’re looking for. </br>Please try another search.</p>";
  }
}

async function getMovieDetails(data) {
  for (let movie of data) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${movie.imdbID}&type=movie&apikey=e18e4510`
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
                  <button class="add-to-watchlist" data-id="${data.imdbID}"><img src="/images/add.svg"><span>Watchlist</span></button>
              </div>
              <p>${data.Plot}</p>
          </div>
      </div>
    `;
  }
}

function updateButtons() {
  for (let id of movieWatchlist) {
    if (document.querySelector(`[data-id='${id}']`)) {
      document.querySelector(`[data-id='${id}']`).innerHTML =
        '<img src="/images/remove.svg"><span>Remove</span>';
    }
  }
}

function addToWatchlist(id, button) {
  if (movieWatchlist.includes(id)) {
    button.innerHTML = '<img src="/images/add.svg"><span>Watchlist</span>';
    movieWatchlist.splice(movieWatchlist.indexOf(id), 1);
    localStorage.setItem("watchlist", JSON.stringify(movieWatchlist));
  } else {
    button.innerHTML = '<img src="/images/remove.svg"><span>Remove</span>';
    movieWatchlist.push(id);
    localStorage.setItem("watchlist", JSON.stringify(movieWatchlist));
  }
}
