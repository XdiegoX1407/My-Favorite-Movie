let maxPage;
let page = 1;
let infiniteScroll;
arrowBtn.addEventListener('click', () => location.hash = window.history.back());
trendingBtn.addEventListener('click', () => location.hash = '#trends');
searchFormBtn.addEventListener('click', () => location.hash = `#search=${searchFormInput.value.trim()}`);

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive:false });
        infiniteScroll = undefined;
    }
    location.hash.startsWith('#trends')    ? trendsPage()       :
    location.hash.startsWith('#search=')   ? searchPage()       :
    location.hash.startsWith('#details=')  ? detailsPage()      :
    location.hash.startsWith('#category=') ? categoriesPage()   :
    homePage()

    smoothscroll();

    if(infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive:false });
    }
};

function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};

function homePage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    likedPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
 
    getTrendingPreview();
    getCategoriesPreview();
    getLikedMovies();
};

function trendsPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    getMoviesByTrending();

    page = 1;
    infiniteScroll = getPaginateTrending;
};

function searchPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    searchForm.style = 'margin-top: 60px';
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);

    page = 1;
    infiniteScroll = getPaginateSearch(query);
};

function detailsPage() {
    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
};

function categoriesPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    const [_, categoryData] = location.hash.split('=');
    const [id, name] = categoryData.split('-');
    const newName = decodeURI(name);
    headerCategoryTitle.innerHTML = newName;
    getMoviesByCategory(id);

    page = 1;
    infiniteScroll = getPaginateCategory(id);
};