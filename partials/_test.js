const today = new Date();
console.log(today.toISOString());

const a = today.toISOString().slice(0, 7);
const b = today.toISOString().slice(8);

console.log(a);
console.log(b);



