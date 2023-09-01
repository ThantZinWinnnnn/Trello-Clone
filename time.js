function addZero(x, n) {
  while (x.toString().length < n) {
    x = "0" + x;
  }
  return x;
}
var dt = new Date("Aug 31, 2023 03:12:45 PM");
var localDateTime =
  dt.getFullYear() +
  "-" +
  addZero(dt.getMonth() + 1, 2) +
  "-" +
  addZero(dt.getDate(), 2) +
  "T" +
  addZero(dt.getHours(), 2) +
  ":" +
  addZero(dt.getMinutes(), 2) +
  ":" +
  addZero(dt.getSeconds(), 2) +
  "." +
  addZero(dt.getMilliseconds(), 3);

var timezone_offset_min = dt.getTimezoneOffset(),
  offset_hrs = parseInt(Math.abs(timezone_offset_min / 60)),
  offset_min = Math.abs(timezone_offset_min % 60),
  timezone_standard;

if (timezone_offset_min < 0)
  timezone_standard =
    "+" + addZero(offset_hrs, 2) + ":" + addZero(offset_min, 2);
else if (timezone_offset_min > 0)
  timezone_standard =
    "-" + addZero(offset_hrs, 2) + ":" + addZero(offset_min, 2);
else if (timezone_offset_min == 0) timezone_standard = "Z";

var full_datetime = localDateTime + timezone_standard;

console.log("offset",dt.getMonth() + 1);
