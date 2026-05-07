const { File } = require('node:buffer');

const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

console.log(typeof file);
console.log(typeof file.size);
console.log(typeof file.type);
console.log(file.size);
console.log(file.type);
