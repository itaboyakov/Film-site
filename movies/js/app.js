import * as URLConstants from './constants.js';
import { FilmCard } from './components/filmCard.js';

// Main function
(function init() {
    showPopularMovies();
    createPageToolbar();
    // Поиск
    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const selectedButtons = document.getElementsByClassName('sel');
        selectedButtons[0]?.classList.remove('sel');
        document.getElementsByClassName('numb')[0].classList.add('sel');
        const keyWord = e.target.children[0].value;
        if (keyWord) {
            showMoviesByKeyword(keyWord);
        } else {
            showPopularMovies(1);
        }
    });
    document.querySelector('.pgnumber').addEventListener('click', changePage.bind(this));
})();

// Загрузка фильмов через API
async function getPopularMovies(page) {
    const url = URLConstants.API_URL_POPULAR + page;
    return await makeRequestToServer(url);
}

async function showPopularMovies(page=1) {
    const films = await getPopularMovies(page);
    if (films) {
        showMovies(films);
    }
}

async function getMoviesByKeyword(keyword, page) {
    const url = `${URLConstants.API_URL_SEARCH}${keyword}&page=${page}`;
    return await makeRequestToServer(url);
}

async function showMoviesByKeyword(keyword, page=1) {
    const films = await getMoviesByKeyword(keyword, page);
    if (films) {
        showMovies(films);
    }
}

async function makeRequestToServer(url) {
    try {
        const responce = await fetch(url,{
            headers: {
                'Content-type' : 'application/json',
                'X-API-KEY': URLConstants.API_KEY,
            },
        });
        if (!responce.ok) {
            throw new Error('Ошибка при загрузке данных');
        }
        const respData = await responce.json();
        return respData;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

// Отрисовка карточек с фильмами
function showMovies(data) {
    createPageToolbar(data.pagesCount);
    document.querySelector('.movies').innerHTML= '';
    data.films.forEach(movie => {
        const card = new FilmCard(movie);
        card.mountCard(document.querySelector('.movies'));
    });
}

function createPageToolbar(pagesCount = 20) {
    const pagesTolbar = document.querySelector('.pgnumber');
    const visibleButtonsNumber = document.getElementsByClassName('numb').length;
    if ((pagesCount < 20 || visibleButtonsNumber < 20) && visibleButtonsNumber !== pagesCount ) {
        pagesTolbar.innerHTML='';
        for (let i = 1; i <= (pagesCount > 20 ? 20 : pagesCount); i++) {
            pagesTolbar.insertAdjacentHTML('beforeend', `<button type='button' class="numb btn btn-outline-primary" value="${i}"> ${i}</button>`);
        }
        pagesTolbar.childNodes[0]?.classList.add('sel');
    }
}

function changePage(e) {
    e.preventDefault();
    if (!e.target.classList.contains('numb')) {
        return;
    }
    const selectedButtons = document.getElementsByClassName('sel');
    selectedButtons[0] && selectedButtons[0].classList.remove('sel');
    const page = e.target.value;
    e.target.classList.add('sel');
    if (!document.querySelector('.header-search').value) {
        showPopularMovies(page);
    } else {
        showMoviesByKeyword(document.querySelector('.header-search').value, page);
    }
}