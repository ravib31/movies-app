const apiKey = "18354e4f1ee70160787ff076e321db6c";
const imgURL = "https://image.tmdb.org/t/p/w1280";
const root = document.getElementById("root");
let page = 1;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

function createMovieCard(movie) {
  const { poster_path, original_title, release_date, overview, popularity } =
    movie;
  const posterPath = poster_path ? imgURL + poster_path : "./img-01.jpeg";
  const title =
    original_title.length > 15
      ? original_title.slice(0, 15) + "..."
      : original_title;
  const description = overview || "No overview yet...";
  const release = `Release On : ${release_date}` || "No release date";
  const popularityText = popularity
    ? `Popularity: ${popularity}`
    : "Popularity: No";

  return `
        <div class="col">
            <div class="card">
                <a class="card-media">
                    <img src="${posterPath}" alt="${title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-cont-header">
                        <div class="cont-left">
                            <h3 style="font-weight: 600">${title}</h3>
                            <span style="color: #12efec">${release}</span>
                            <h3 style="font-weight: 400">${popularityText}</h3>
                        </div>
                        <div class="cont-right">
                            <a href="${posterPath}" target="_blank" class="btn">See image</a>
                        </div>
                    </div>
                    <div class="describe">${description}</div>
                </div>
            </div>
        </div>`;
}

async function fetchAndShowResults(url) {
  const data = await fetchData(url);
  const content = data.map(createMovieCard).join("");
  root.innerHTML = content || "<p>Something went wrong!</p>";
}

function handleLoadMore() {
  const nextPageURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${++page}`;
  fetchAndShowResults(nextPageURL);
}

function init() {
  const initialURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1`;
  fetchAndShowResults(initialURL);
}

init();

window.addEventListener("scroll", () => {
  const scrolledToBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (scrolledToBottom) {
    handleLoadMore();
  }
});

const form = document.getElementById("search-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("query").value;
  if (query) {
    const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    fetchAndShowResults(searchURL);
  }
  document.getElementById("query").value = "";
});
