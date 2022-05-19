const { text } = require("./tanach.js");
const sections = ["Torah", "Neviim", "Kesuvim"];

const torah = () => {
  return sections[0];
}

const neviim = function () {
  return sections[1];
}

const kesuvim = function () {
  return sections[2];
}

const tanach = function (sefer, perek, pasuk) {  
  var result = text.filter(el => {
    return el.seferHe === sefer &&
      el.perekNum === perek &&
      el.pasuknum === pasuk;
  });

  return result;
}

exports.sections = sections;
exports.torah = torah;
exports.neviim = neviim;
exports.kesuvim = kesuvim;
exports.tanach = tanach;