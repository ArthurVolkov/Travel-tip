'use strict'
export const weather = {
    getWeatherByPos
}

function getWeatherByPos(pos) {
    const API_KEY = '5352808304e9484b44aff35cb0fbf76f';
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.lat}&lon=${pos.lng}&units=metric&appid=${API_KEY}`)
        .then(res => {
            console.log('weather:',res.data);
            return res.data;
        });
}
