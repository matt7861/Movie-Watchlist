/* 
    1.) Possible ID saved for each movie? add that ID to local storage and then loop api query for all movies
    2.) Second solution could be to store all data as json in a data attribute on the button > add that to local storage > then retreive as js object and iterate over to pull movies in
*/

const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list");
const palceholder = document.getElementById("placeholder");
const localList = localStorage.getItem("watchlist");
const movieWatchlist = localList ? JSON.parse(localList) : [];
let movieListHtml = "";

searchForm.addEventListener("submit", getMovies);
document.addEventListener("click", (e) => {
  if (e.target.dataset.id) addToWatchlist(e.target.dataset.id);
});

async function getMovies(e) {
  e.preventDefault();

  // TODO: loading after search results
  palceholder.innerHTML = '<div class="loading"></div>';
  const formData = new FormData(searchForm);
  const searchValue = formData.get("search");
  movieListHtml = "";

  const res = await fetch(
    `https://www.omdbapi.com/?s=${searchValue}&type=movie&page=1&apikey=e18e4510`
  );
  const data = await res.json();

  // TODO: make its own function
  if (data.Search) {
    for (let movie of data.Search) {
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
                  <button class="add-to-watchlist" data-id="${data.imdbID}">Watchlist</button>
              </div>
              <p>${data.Plot}</p>
          </div>
      </div>
    `;
    }

    movieList.innerHTML = movieListHtml;
  } else {
    palceholder.innerHTML =
      "<p class='no-results'>Unable to find what you’re looking for. </br>Please try another search.</p>";
  }
}

function addToWatchlist(id) {
  if (movieWatchlist.includes(id)) {
    // TODO: change this to a better notification. Maybe just change inner text to "Already added to watchlist!"
    alert("already added");
  } else {
    movieWatchlist.push(id);
    localStorage.setItem("watchlist", JSON.stringify(movieWatchlist));
  }
}
