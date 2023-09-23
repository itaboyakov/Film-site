import * as URLConstants from './../constants.js';
export class FilmCard {
    constructor (filmInformation) {
        this.filmInformation = filmInformation;
        this.card = document.createElement('div');
        this.card.innerHTML = `
            <div class="movie">
                <div class="movie-cover-inner">
                    <img src=${filmInformation.posterUrlPreview} alt="" class="movie-cover">
                        <div class="movie-cover--darkened"></div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${filmInformation.nameRu || filmInformation.nameEn}</div>
                    <div class="movie-category">${filmInformation.genres.map(genre => ` ${genre.genre}`)}</div>
                    ${ filmInformation.rating && !filmInformation.rating.includes('%') && Number(filmInformation.rating) ?
        `<div class="movie-average movie-average--${this.getRateColor(filmInformation.rating)}">${filmInformation.rating}</div>` :''}
                </div>
            </div>`;
        this.card.addEventListener('click', this.openFIlmCard.bind(this));
    }
    openFIlmCard() {
        const modalPage = document.createElement('div');
        modalPage.innerHTML = `
            <div class="modalk">
                <div class="modal-container"></div>
            </div>
            <div class="fon"></div>  `;
        document.querySelector('body').prepend(modalPage);
        document.getElementsByClassName('fon')[0].addEventListener('click', this.closeWindow.bind(this));
        this.showFilmInformation();
        this.showTrailer();
    }

    closeWindow() {
        document.getElementsByClassName('fon')[0].removeEventListener('click', this.closeWindow);
        document.querySelector('.modalk').remove();
        document.querySelector('.fon').remove();
    }
    async getFilmData() {
        const url = URLConstants.API_FILM+this.filmInformation.filmId;
        const filmInformation = await this.makeRequestToServer(url);
        return filmInformation;
    }
    async showFilmInformation() {
        const data = await this.getFilmData();
        const contentRoot = document.querySelector('.modal-container');
        if (!data) {
            contentRoot.insertAdjacentHTML('beforeend', '<div>Данные отсутствуют</div>');
            return;
        }
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
    async makeRequestToServer(url) {
        try {
            const responce = await fetch(url,{
                headers: {
                    'Content-type' : 'application/json',
                    'X-API-KEY': URLConstants.API_KEY,
                },
            });
            if (!responce.ok) {
                throw new Error ('Ошибка при загрузке данных');
            }
            const respData = await responce.json();
            return respData;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
    getTrailers() {
        const url = URLConstants.API_TRAILER+this.filmInformation.filmId+'/videos';
        return this.makeRequestToServer(url).then(result => result);
    }
    async showTrailer() {
        const trailers = await this.getTrailers();
        const contentRoot = document.querySelector('.right-desc');
        if (!trailers) {
            return;
        }
        if (trailers && trailers.total){
            const trailer = trailers.items && trailers.items.find(trailerInfo => trailerInfo.url.includes('youtube.com'));
            if (trailer) {
                const url = trailer.url.replace('watch?v=','embed/').replace('v/','embed/');
                const content = `<iframe src="${url}?autoplay=1" class="trailer" allow="fullscreen"></iframe>`;
                contentRoot.insertAdjacentHTML('beforeend', content);
            }
        }
    }
    getRateColor(rate) {
        if (rate>7.5){
            return 'green';
        } else if (rate>5) {
            return 'orange';
        } else return 'red';
    }
    mountCard(mountPoint) {
        mountPoint.append(this.card);
    }
}