'use strict'
export const geoCoding = {
    getPosByName
}

function getPosByName(locationName) {
    const API_KEY = 'AIzaSyAGuxwq8wZl4gxL2ERwdbaBPAb6QQl8z94';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${API_KEY}`)
        .then(res => {return res.data.results[0].geometry.location});
}
