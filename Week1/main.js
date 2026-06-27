import { add } from './math.js';

// 1. Practice let/const (Scope)
const user = "Student"; // Won't change
let score = 0;          // Will change
score = 10;

// 2. Practice Template Literals
console.log(`Hello ${user}, the result is ${add(5, 5)}.`);

// 3. Practice Async/Await
const fetchData = async () => {
    const data = await new Promise(resolve => setTimeout(() => resolve("Success!"), 1000));
    console.log(data);
};

fetchData();