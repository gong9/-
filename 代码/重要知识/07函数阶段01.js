/**
 * 函数阶段
 * 
 */

/**
 * 函数声明
 * 赋值式声明和函数式声明主要的差别就是有无变量提升的问题
 */

let hd = new Function("title", "console.log(title)");
hd("gongxiaobai");

function gxb(name) {
    console.log(name);
}
gxb("gongxiaobai")

/**
 * 立即执行函数
 * 作用：定义一个私有作用域，防止它污染全局
 * 
 */
(function() { console.log("gxb"); }())

/**
 * arguments
 * 
 * 收集所有的参数，是个类数组对象，不过现在使用剩余参数
 */
function add() {
    return [...arguments].reduce((total, num) => total += num)
}
console.log(add(1, 2, 3));

// 方式2 转换其形式
function add() {
    return Array.prototype.reduce.call(arguments, (total, num) => total += num);
}
console.log(add(1, 2, 3));

//方式3 直接使用剩余语法

function sum(...args) {
    return args.reduce((total, num) => total += num)
}
console.log(sum(1, 2, 3, 4));

/**
 * 箭头函数
 * 在使用递归、构造函数、事件处理器时不建议使用。他没有上下文一说，它会继承它的父级上下文
 */


/**
 * 标签函数，解析标签字符串的函数
 */

function gxb(str, ...args) {
    console.log(str);
    console.log(args);
}
let name = 'gxb'
let age = 18;
gxb `我是${name}，今天${(function() { return 1+2+2 }())}了`