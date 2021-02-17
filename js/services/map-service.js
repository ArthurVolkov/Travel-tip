'use strict'
import {utilService} from './util-service.js';

const KEY_DB = 'travelTip';

export const mapService = {
    getLocs,
    deleteLocs,
    addLoc,
    getLocByName
}

var gLocs;

function getLocs() {
    gLocs = utilService.loadFromStorage(KEY_DB) || [];
    return Promise.resolve(gLocs);
}

function deleteLocs(locName) {
    var locIdx = gLocs.findIndex(function (currLoc) {
        return locName === currLoc.name;
    })
    gLocs.splice(locIdx, 1);
    utilService.saveToStorage(KEY_DB,gLocs);
}

function addLoc(loc) {
<<<<<<< HEAD
    debugger;
=======
>>>>>>> 5280eecb0713c135646f130abc82948a62cea6ac
    var locIdx = gLocs.findIndex(function (currLoc) {
        return loc.maps.placeName === currLoc.name;
    })
    if (locIdx === -1){
        var newLoc = createLoc(loc)
        gLocs.push(newLoc)
        utilService.saveToStorage(KEY_DB,gLocs);
    }
}

function getLocByName(locName) {
    var loc = gLocs.find(function (loc) {
        return locName === loc.name
    })
    return loc
}

function createLoc(loc) {
    return {
        id: utilService.makeId(),
        name: loc.maps.placeName, 
        lat: loc.maps.placePos.lat,
        lng: loc.maps.placePos.lng,
        weather: loc.weather,
        createdAt: Date.now()
    }
}

/*var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}
*/

