const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': 'es-Mx' || navigator.language,
    },
});
const API_URL = 'https://api.themoviedb.org/3/';

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if(item) {
        movies = item;
    } else {
        movies = {};
    }
    return movies;
};

function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    if(likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
    if (location.hash == ''){
        homePage();
      };
};

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
});

async function getAndAppendMovies(movies, parentContainer, clean = true) {
    if(clean) {
        parentContainer.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#details=${movie.id}`;
        });
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('data-img', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
        lazyLoader.observe(movieImg);
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src','https://images.rawpixel.com/image_400/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yNTEtbWluZC0xNC1lLmpwZw.jpg');
            movieContainer.classList.add('movie-container--default');
            const title = document.createElement('span');
            title.textContent = `${movie.title}`;
            movieContainer.append(title);
        });
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click',(e) => {
            e.stopPropagation();
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        });
        movieContainer.append(movieImg);
        movieContainer.append(movieBtn);
        parentContainer.append(movieContainer);
    });
};

async function getAndAppendCategories(categories, container) {
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', `id${category.id}`);
        categoryTitle.addEventListener('click', ()=> {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        categoryTitle.innerText = category.name;
        categoryContainer.append(categoryTitle);
        container.append(categoryContainer);
    });
}

async function getTrendingPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    getAndAppendMovies(movies, trendingMoviesPreviewList);
};

async function getCategoriesPreview() {
    const { data } = await api(`genre/movie/list`);
    const categories = data.genres;

    getAndAppendCategories(categories, categoriesPreviewList);
};

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
          with_genres: id,
        },
      });
      const movies = data.results;
      maxPage = data.total_pages;
    
      getAndAppendMovies(movies, genericSection);
};

function getPaginateCategory(id) {
    return async function () {
        const { scrollTop,scrollHeight,clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
        
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('discover/movie', {
                params: {
                with_genres: id,
                page,
                },
            });
            const movies = data.results;
            
            getAndAppendMovies( movies, genericSection, false);
        };
    }
};

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
          query,
        },
      });
      const movies = data.results;
      maxPage = data.total_pages;
    
      getAndAppendMovies(movies, genericSection);
};

function getPaginateSearch(query) {
    return async function () {
        const { scrollTop,scrollHeight,clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
        
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                query,
                page,
                },
            });
            const movies = data.results;
            
            getAndAppendMovies( movies, genericSection, false);
        };
    }
};

async function getMoviesByTrending() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    getAndAppendMovies(movies, genericSection, { lazyLoad: true, clean: true });
};

async function getPaginateTrending() {
    const { scrollTop,scrollHeight,clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
      
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
            page,
            },
        });
        const movies = data.results;
        
        getAndAppendMovies( movies, genericSection, false);
    };
};

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`);
    const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})
    `;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    getAndAppendCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMovies(id);
};

async function getRelatedMovies(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    getAndAppendMovies(relatedMovies, relatedMoviesContainer);
};

async function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);
    getAndAppendMovies(moviesArray, likedMoviesPreviewList);
};