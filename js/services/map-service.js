'use strict'
import {utilService} from './util-service.js';

const KEY_DB = 'travelTip';

export const mapService = {
    getLocs
}
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


