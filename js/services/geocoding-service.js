'use strict'
export const geoCoding = {
    getPosByName
}

function getPosByName(locationName) {
    const API_KEY = 'AIzaSyAGuxwq8wZl4gxL2ERwdbaBPAb6QQl8z94';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`)
        .then(res => console.log('Im Here!!!!::::', res.data.results[0].geometry.location));
}
