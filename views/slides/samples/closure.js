var generator = function(start, increment) {
  var x = start || 0;
  var inc = increment || 1;
  return function() {
    var result = x;
    x += inc;
    return result;
  };
};
var g0 = generator();
console.log(g0(), g0(), g0()); // 0 1 2

var g1 = generator(1);
console.log(g1(), g1(), g1()); // 1 2 3

var odd = generator(1, 2);
console.log(odd(), odd(), odd()); // 1 3 5

var dots = generator('.', '.');
console.log(dots(), dots(), dots()); // . .. ...
