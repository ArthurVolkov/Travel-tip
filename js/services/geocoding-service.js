'use strict'
export const geoCoding = {
    getPosByName
}

function getPosByName(locationName) {
    const parseLocation = locationName.replace(' ',',+');
    const API_KEY = 'AIzaSyAGuxwq8wZl4gxL2ERwdbaBPAb6QQl8z94';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${parseLocation}&key=${API_KEY}`)
        .then(res => {
            return {
                placePos: res.data.results[0].geometry.location,
                placeName: res.data.results[0].formatted_address
            }
        });
}
