import t from "tcomb-form";

const emailRegex = /(.)+@(.)+\.(.)+/g
export const email = t.refinement(t.String, (str) => {
  return emailRegex.test(str);
}, "email");


export const ipv4Address = t.refinement(t.String, (str) => {
  if(typeof(str) !== "string"){
    return false;
  }
  var split = str.split(".");
  if(split.length !== 4){
    return false;
  }
  return parseInt(split[0]) < 256 && parseInt(split[0]) > -1 &&
    parseInt(split[1]) < 256 && parseInt(split[1]) > -1 &&
    parseInt(split[2]) < 256 && parseInt(split[2]) > -1 &&
    parseInt(split[3]) < 256 && parseInt(split[3]) > -1;
}, "ipv4Address");

const zipRegex = /[0-9][0-9][0-9][0-9][0-9]/g
export const zipCode = t.refinement(t.String, (str) => {
  return zipRegex.test(str);
}, "zipCode");

export const integer = t.refinement(t.Number, (num) => {
  return Math.floor(num) === num;
}, "integer");

export const positive = t.refinement(t.Number, (num) => {
  return num > 0;
}, "positive");

export const zeroOrMore = t.refinement(t.Number, (num) => {
  return num >= 0;
}, "zeroOrMore");

export const negative = t.refinement(t.Number, (num) => {
  return num < 0;
}, "negative");

export const futureDate = t.refinement(t.Date, (date) => {
  return date > Date.now();
}, "futureDate");

export const pastDate = t.refinement(t.Date, (date) => {
  return date < Date.now();
}, "pastDate");
