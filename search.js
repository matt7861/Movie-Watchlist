/* 
    1.) Possible ID saved for each movie? add that ID to local storage and then loop api query for all movies
    2.) Second solution could be to store all data as json in a data attribute on the button > add that to local storage > then retreive as js object and iterate over to pull movies in
*/

const searchForm = document.getElementById("search-form");
const movieList = document.getElementById("movie-list");
const localList = localStorage.getItem("watchlist");
const movieWatchlist = localList ? JSON.parse(localList) : [];

searchForm.addEventListener("submit", getMovies);
document.addEventListener("click", (e) => {
  if (e.target.dataset.id) addToWatchlist(e.target.dataset.id);
});

async function getMovies(e) {
  e.preventDefault();

  const formData = new FormData(searchForm);
  const searchValue = formData.get("search");

  const res = await fetch(
    `https://www.omdbapi.com/?s=${searchValue}&type=movie&page=1&apikey=e18e4510`
  );
  const data = await res.json();

  // TODO: Check if has results > throw error
  movieList.innerHTML = renderMovies(data.Search);
}

function renderMovies(data) {
  return data
    .map((movie) => {
      return `
          <div>
          <img src="${movie.Poster}">
          <h3>${movie.Title}</h3>
          <button class="add-to-watchlist" data-id="${movie.imdbID}">Watchlist</button>
          </div>
      `;
    })
    .join("");
}

function addToWatchlist(id) {
  if (movieWatchlist.includes(id)) {
    // TODO: change this to a better notification
    alert("already added");
  } else {
    movieWatchlist.push(id);
    localStorage.setItem("watchlist", JSON.stringify(movieWatchlist));
  }
}
