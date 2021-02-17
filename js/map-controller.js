'use strict'

import { geoCoding } from './services/geocoding-service.js';
import { mapService } from './services/map-service.js';
import { weather } from './services/weather-service.js';


var gMap;
console.log('Main!');

window.onSearch = onSearch;

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    geoCoding.getPosByName('tokyo');
    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(32.013186, 34.748019);
    })


    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
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
        .then(res => {
            panTo(res.placePos.lat, res.placePos.lng)
            renderLocInfo(res.placeName)
            weather.getWeatherByPos(res.placePos)
        })
}

function renderLocInfo(info) {
    document.querySelector('.to-render-loc-info').innerText = info
}