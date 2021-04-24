"use strict";
exports.__esModule = true;
function convertDurationToTimeString(duration) {
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor(duration % 3600 / 60);
    var seconds = duration % 60;
    var timeString = [hours, minutes, seconds].map(function (unit) { return String(unit).padStart(2, '0'); }).join(':');
    return timeString;
}
exports["default"] = convertDurationToTimeString;
