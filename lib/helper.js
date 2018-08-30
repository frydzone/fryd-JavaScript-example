/**
 * Public
 */

module.exports = {
  uuid: (a) => {return a?(a ^ Math.random() * 16 >> a / 4).toString(16):([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,module.exports.uuid)},
  coinflip: function() {
    return Math.random() < 0.5;
  },
  roundToThree: function(num) {
    return +(Math.round(num + 'e+3')  + 'e-3');
  },
  rollInteger: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  formatDate: (date) => {
    var day = date.getDate();
    var month = date.getMonth();
    var hours = date.getHours();
    var mins  = date.getMinutes();
    var secs = date.getSeconds();

    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;
    hours = (hours < 10 ? '0' : '') + hours;
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;

    return `${day}-${month} ${hours}:${mins}:${secs}`;
  },
  arraySum: function(array)  {
    return array.reduce(add, 0);
  },
  absArraySum: function(array)  {
    return array.reduce(addAbs, 0);
  },

}

/**
 * Private
 */

function add(a, b) {
  return a + b;
};

function addAbs(a, b) {
  return Math.abs(a) + Math.abs(b);
};
