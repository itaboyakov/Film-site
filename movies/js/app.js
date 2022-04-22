const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_FILM = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const API_TRAILER = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
let page='1';
let API_SEARCH ='';
getMovies(`${API_URL_POPULAR}1`,showMovies);
async function getMovies(url,func){
    const resp = await fetch(url,{
        headers: {
            "Content-type" : "application/json",
            'X-API-KEY': API_KEY
        }
    });
    const respData = await resp.json();
    func(respData);
}

function showFilmInfo(data){
    const contentRoot = document.querySelector('.modal-container');
    const content = `
        <div class="film-name">
            ${data.nameRu}
        </div>
        <div class="desc-fild">
        <img class="poster" src="${data.posterUrl}" alt="">
        <div class="right-desc" >
        <div class="description">${data.description || ''}</div>
        </div>
        </div>`;
    contentRoot.insertAdjacentHTML('beforeend', content);
}
function nottr(cntroot){
    const content = `<div>
            <h1>Трейлер не найден</h1>
            </div> `
    cntroot.insertAdjacentHTML('beforeend', content);
}
function showTrailer(data){
    const contentRoot = document.querySelector('.right-desc');
    if(data.items.length === 0){
        nottr(contentRoot)
    } else
    for(let i=0;i <data.items.length;i++){
         let url = data.items[i].url;
         if(url.includes('youtube.com')){
             url = url.replace('watch?v=','embed/');
             url = url.replace('v/','embed/');
             const content = `<iframe src="${url}?autoplay=1" class="trailer" allow="fullscreen"></iframe>`
             contentRoot.insertAdjacentHTML('beforeend', content);
             break
         }
         if(i === data.items.length-1){
             nottr(contentRoot)
         }
    }
}

function showMovies(data){
    document.querySelector('.movies').innerHTML= '';
    const pagination = document.querySelector('.pgnumber');
    pagination.innerHTML=''
    for(let i=1; i<=20;i++){
        if(data.pagesCount < i) break;
        pagination.insertAdjacentHTML('beforeend', `<button type='button' class="numb btn btn-outline-primary" value="${i}"> ${i}</button>`);
    }
    pagination.childNodes[page-1].classList.add('sel');
    const moviesEl = document.querySelector('.movies');
    data.films.forEach(movie => {
        let movieEl =  `
            <div class="movie">
                <div class="filmId" style="display: none">${movie.filmId}</div>
                <div class="movie-cover-inner">
                    <img src=${movie.posterUrlPreview} alt="" class="movie-cover">
                        <div class="movie-cover--darkened"></div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.nameRu || movie.nameEn}</div>
                    <div class="movie-category">${movie.genres.map(genre => ` ${genre.genre}`)}</div>
                    ${ movie.rating && movie.rating !== 'null' &&(movie.rating.indexOf('%')=== -1 && 1 ) ? 
                     `<div class="movie-average movie-average--${getRateColor(movie.rating)}">${movie.rating}</div>` :''}
                </div>
                
            </div>`

    moviesEl.insertAdjacentHTML('beforeend',movieEl);
    })
}

function getRateColor(rate){
    if(rate>7.5){
        return "green"
    } else if(rate>5) {
        return "orange"
    } else return "red"
}
const form = document.querySelector("form");
const search = document.querySelector(".header-search");
form.addEventListener("submit", e => {
    e.preventDefault();
    API_SEARCH = `${API_URL_SEARCH}${search.value}&page=`;
    if(search.value){
        page='1';
        getMovies(API_SEARCH + page,showMovies);
        search.value = '';
    }else {
        API_SEARCH=''
        page='1';
        getMovies(API_URL_POPULAR+page,showMovies);
    }
})
document.addEventListener('click', function(event) {
    search.value=''
    if ([...event.target.classList].includes("numb")) {
        event.preventDefault();
        page = `${event.target.value}`;

        if(API_SEARCH == '') {
            getMovies(API_URL_POPULAR + page,showMovies);
        } else {
            getMovies(API_SEARCH + page,showMovies);
        }
    } else if([...event.target.classList].includes("movie-cover--darkened")) {
        const modalRoot = event.target.closest('.movie-cover-inner');
        let fId = modalRoot.previousElementSibling.innerText;
        const modalPage = `
        <div class="modalk">
            <div class="modal-container"></div>
        </div>
        <div class="fon"></div>  `;
        document.querySelector('body').insertAdjacentHTML('afterbegin',modalPage);
         getMovies(API_FILM+fId,showFilmInfo);
        getMovies(API_TRAILER+fId+'/videos',showTrailer);
    } else if ([...event.target.classList].includes('fon')){
        document.querySelector('.modalk').remove();
        document.querySelector('.fon').remove();
    }
})
