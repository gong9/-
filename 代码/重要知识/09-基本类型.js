/**
 * string
 */

//声明1，使用对象形式。2，使用字面的形式

//常用API
let str = 'aa'
str.toUpperCase(); //转大写
str.toLowerCase() //转小写

//  移出两端空白
// trim

//获取单个字符
// charAt()


// 截取字符串

let str = 'gongxiaobai'
console.log(str.slice(2));

let str = 'gongxiaobai'
console.log(Array.prototype.reverse.call(str));
console.log([1, 2, 3, 4].reverse());


// 获取单个字符
let str = 'abcd'
console.log(str[0]);
console.log(str.charAt(0));

// 截取字符串
let str = 'abcdefg'
console.log(str.slice(0, 1));
console.log(str.substring(0, 1));
console.log(str.substr(3, 1));

//字符串查找

let str = 'abcd'
console.log(str.indexOf('a'));
//lastIndexOf与它的搜索方向相反


//search方法用于检测一个片段字符串的位置
let str = "houdunren.com";
console.log(str.search("com"));

//includes方法用于检测字符串串中是否有对应子字符串,第二个参数是指定查找开始的位置

let str = 'abcd'
console.log(str.includes('ab'));

//startWith，是指字符串是否以某个东西开始，第二个可选参数为开始查找的位置

let str = 'abcd'
console.log(str.startsWith('ab'));

//与startWith对应的是endWith,指的是是否以某个东西结束

// 替换字符串
let str = 'abcdef'
console.log(str.replace('abc', 'gongxiaobai'));


//重复
let str = 'abc';
console.log(str.repeat(4));

//类型转换

//转数组split
//js中每个数据结构都有toString
//隐式类型转换  9+''
//显示转字符串，使用string的构造函数


/**
 * boolean
 */

//声明
new Boolean(true)
let flag = true;

//基本是所有的数据类型都可以隐式转换为bookean类型
//  空字符串转为false，非空的转为true
// 非0的number转为true，0转为false
// 所有的对象转为true
// null和NAN转为false


//当与boolean类型进行比较的时候，会先进行隐式转换false转为0,true转为1.在进行计算
console.log(1 == true)
    //字符串与boolean比较的时候，两边先转成数值再进行比较

console.log(Number('1'));
console.log('1' == true);

console.log(Number('abc'));
console.log('abc' == true);

//数组的表现形式和字符串一样，也是先转为number再比较
console.log(Number([]));
console.log(Number([1, 2, 3]));
console.log(Number([1]));
console.log([] == false);
console.log([1, 2, 3] == true);
console.log([2] == true);

if ([]) {
    console.log("[]");

}
if ({}) {
    console.log('{}');

}

//显示转换
let hd = '';
console.log(!!hd); //false
hd = 0;
console.log(!!hd); //false
hd = null;
console.log(!!hd); //false

// 使用Boolean的构造函数可以直接显示转换


/**
 * number
 * 
 */

//声明，还是两种

let num = 1;
let num = new Number(2)


//判断是否为整数

console.log(Number.isInteger(1.2));
//指定小数位数
let num = 1.234;
console.log(num.toFixed(2));

//NaN表示一个无效的数值，
console.log(NaN == NaN);
console.log(Number.isNaN(NaN));
console.log(Object.is(NaN, NaN));

//  使用Number的构造函数基本是可以转换所有的数据类型
console.log(Number('houdunren')); //NaN
console.log(Number(true)); //1
console.log(Number(false)); //0
console.log(Number('9')); //9
console.log(Number([])); //0
console.log(Number([5])); //5
console.log(Number([5, 2])); //NaN
console.log(Number({})); //NaN

//parseInt
console.log(parseInt('  99ho99udunren')); //99
console.log(parseInt('18.55')); //18
console.log(parseInt(18.55)); //18

//parseFloat
console.log(parseFloat('  99houdunren')); //99
console.log(parseFloat('18.55')); //18.55

//浮点数精度问题

let num = 0.1 + 0.2;
console.log(num);
// 因为0.1和0.2转为二进制是无穷的
// 处理方式:使用toFixed
//使用一些针对一些数学计算的库


//Symbol

//Symbol是为了防止属性名冲突产生的
// 它的值是唯一的

// 声明
let s = Symbol();
console.log(s);
//Symbol函数可加参数，该参数是对应描述符，使用description可以获取描述
let s = Symbol("描述")
console.log(s.description);

// Symbol.for:根据描述获取symbol，如果不存在则新建一个
let s1 = Symbol.for('gxb');
let s2 = Symbol.for('gxb');
console.log(s1 === s2);

//Symbol.for,使用for会在系统中进行注册，使用Symbol不会
let s1 = Symbol("s1")
let s2 = Symbol.for('s1')
console.log(s1 === s2);

//Symbol.keyFor，获取注册过的symbol的描述
let hd = Symbol.for("后盾人");
console.log(Symbol.keyFor(hd)); //后盾人

let edu = Symbol("houdunren");
console.log(Symbol.keyFor(edu)); //undefined

// 用于对象属性
const s = Symbol('gxb')
let obj = {
    [s]: 'gongxiaobai'
}
console.log(obj[s]);
console.log(typeof s);

