/**
 * generator 初体验
 * 特点就是可以暂停
 * 生成一个iterator
 */

function* read() {
    yield 1;
    yield 2;
    yield 3;
    return 9;
}
let it = read();
console.log(it.next());


/**
 * 
 */