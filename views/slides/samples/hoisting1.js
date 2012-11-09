// f is function
console.log(typeof(f));
f.x = 5;

// function declaration statement
function f() {
  return f.x;
}

// 5
console.log(f());

// ---------
// g is undefined
console.log(typeof(g));

// function expression
var g = function() {
  return g.x;
};

// Don't do this, ReferenceError
//console.log(h);
