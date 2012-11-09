var x = 5;

function f() {
  // use x from outer scope
  return x;
}

function g() {
  // x is hoisted!
  return x;
  // ...
  var x;
}

function h() {
  // x is hoisted
  return x;
  // ...
  // but assignment stay, never be done
  var x = 10;
}

// h is equivalent to h2:
function h2() {
  // all var statements are placed here
  var x;
  return x;
  // ...
  // never be done
  x = 10;
}

console.log(f());
console.log(g());
console.log(h(), h2());
