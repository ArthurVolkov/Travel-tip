'use strict'

import { geoCoding } from './services/geocoding-service.js';
import { mapService } from './services/map-service.js';
import { weather } from './services/weather-service.js';


var gMap;
console.log('Main!');

window.onSearch = onSearch;
window.onGoTo = onGoTo;
window.onRemove = onRemove;
window.onCurrLoc = onCurrLoc;


// mapService.getLocs()
//     .then(locs => console.log('locs', locs))

window.onload = () => {
    // geoCoding.getPosByName('tokyo');
    // document.querySelector('.btn').addEventListener('click', (ev) => {
    //     console.log('Aha!', ev.target);
    //     panTo(32.013186, 34.748019);
    // })

    mapService.getLocs()
        .then(res => renderLocs(res))

    initMap()
        .then(() => {
            getPosition()
                .then(pos => {
                    console.log('User position is:', pos.coords);
                    panTo(pos.coords.latitude, pos.coords.longitude)
                    addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                    weather.getWeatherByPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                        .then(weather => { renderWeather(weather) })
                })
            // addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    // getPosition()
    //     .then(pos => {
    //         console.log('User position is:', pos.coords);
    //         panTo(pos.coords.latitude, pos.coords.longitude)
    //         addMarker({lat: pos.coords.latitude, lng: pos.coords.longitude})
    //     })
    //     .catch(err => {
    //         console.log('err!!!', err);
    //     })
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAGuxwq8wZl4gxL2ERwdbaBPAb6QQl8z94';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function onSearch(ev) {
    ev.preventDefault()
    let value = document.getElementById('search').value
    console.log('value: ', value);
    geoCoding.getPosByName(value)
        .then(place => {
            panTo(place.placePos.lat, place.placePos.lng)
            addMarker({ lat: place.placePos.lat, lng: place.placePos.lng })
            renderLocInfo(place.placeName)
            weather.getWeatherByPos(place.placePos)
                .then(weather => {
                    mapService.addLoc({
                        maps: place,
                        weather,
                    })
                    renderWeather(weather)
                    mapService.getLocs()
                        .then(locs => {
                            renderLocs(locs)
                            console.log('onSearch locs:', locs)
                        })
                })
            // addLocation(place, weater)
        })
}

function renderLocInfo(info) {
    document.querySelector('.to-render-loc-info').innerText = info
}

function renderWeather(weather) {
    var elContainer = document.querySelector('.weather-info-container .weather')
    var strHTML = `<img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="icon"/>
        <div class="weather-row-1">
            <div class="weather-place"></div>
            <div class="weather-desc"></div>
        </div>
        <div class="weather-row-2">
            <div class="weather-temp"></div>
            <div class="weather-temp-diff"></div>
            <div class="weather-wind"></div>
        </div>`
    elContainer.innerHTML = strHTML
}


function renderLocs(places) {
    console.log('res locs:', places)
    document.querySelector('.places-list').innerHTML = places.map(place => {
        console.log('place:', place.name)
        return `<li class="flex justify-between align-center">
            <div class="place-name">${place.name}</div>
            <div class="place-btns flex justify-between">
                <button onclick="onGoTo('${place.name}')">Go</button>
                <button onclick="onRemove('${place.name}')">❌</button>
            </div>
        </li>`
    }).join('')
}


function onGoTo(name) {
    const place = mapService.getLocByName(name)
    panTo(place.lat, place.lng)
    addMarker({ lat: place.lat, lng: place.lng })

    renderLocInfo(place.placeName)
    renderWeather(place.weather)
}

function onRemove(name) {
    mapService.deleteLocs(name)
    mapService.getLocs()
        .then(locs => {
            renderLocs(locs)
        })
}


function onCurrLoc() {

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            panTo(pos.coords.latitude, pos.coords.longitude)
            addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        })
        .catch(() => console.log('INIT MAP ERROR'));
}