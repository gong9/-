import { log } from "util";

/**
 * - new Array()
 * - 字面量
 */
const arr = [1, 2, 3]

/**
 * 数组的一种添加元素的方式
 */
let arr = [];
arr[2] = 1;
console.log(arr); //会自动填充前面的值
console.log(arr[0]);


/**
 * 
 * 数组使用new创建时的知识点
 * 
 * 
 */


let arr = new Array(1, 2, 3);
console.log(arr); //[ 1, 2, 3 ]

//只写一个值的时候
let arr = new Array(4);
console.log(arr); //[ <4 empty items> ]

// es6中给我们的解决方法
let arr = Array.of(4);
console.log(arr); //[ 4 ]

/**
 * 数组的类型检测与类型转换 
 */

console.log(Array.isArray([]));

//数组转字符串
console.log([1, 2, 3].toString());
console.log(String([1, 2, 3]));
console.log([1, 2, 3].join());

//使用Array.from可以将类数组转为真数组，什么是类数组呢？；类数组指的是包含length属性或可迭代的对象

let str = "zhangsan";
console.log(Array.from(str)[7]);

let user = {
    "0": 'zhangsan',
    "1": 19,
    length: 2
}
Array.from(user, function(item) {
    console.log(item);

});
// 使用展开语法也可以将类数组转为真的数组


/**
 * 数组的合并
 */

let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6];
console.log(arr1.concat(arr2));
console.log([...arr1, ...arr2]);


/**
 * 
 * 数组的解构赋值
 * 
 */

let [name, url] = ['gongxiaobai', 'gongxiaobai.com'];
console.log(name);

/**
 * add many
 * 
 */
let arr = [1, 2, 3, 4]
arr.push(5, 6, 7)
console.log(arr);

/**
 * 
 * 数组的一些api 
 * 
 * */



//fill
let arr = [1, 2, 3]
arr.fill(33, 1)
console.log(arr);

//slice切片,没有参数是切割所有
let arr = [1, 2, 3]
console.log(arr.slice(1));

//splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。
let arr = [1, 2, 3, 4, 5];
// 删除数组元素第一个参数为从哪开始删除，第二个参数为删除的数量
arr.splice(1)
console.log(arr);

//还能怎么删除
let arr = [1, 2, 3]
arr.length = arr.length - 1;
console.log(arr);
//splice的第三个参数
let arr = [1, 2, 3, 4, 5]
arr.splice(1, 2, "gongxiaobai")
console.log(arr);

// 向末尾添加元素
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.splice(arr.length, 0, 'hdcms', '后盾人')); //[]
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, "hdcms", "后盾人"]
// 向数组前添加元素
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.splice(0, 0, 'hdcms', '后盾人')); //[]
console.log(arr); //["hdcms", "后盾人", 0, 1, 2, 3, 4, 5, 6]

/**
 * 清空数组
 */

//  1. 将数组的length设置为0
//  2.使用splice
//  3. 使用pop或shift挨个移出


/**
 * 合并拆分
 */
// 1. 使用join将数组整成字符串
// 2. split将字符串整成数组
// 3. concat连接
// 4. 使用扩展语法
// 5. 使用copyWithin从数组中复制一部分

let arr = [1, 2, 3, 4];
console.log(arr.copyWithin(1, 2));


/**
 * 数组中的多种查找元素
 */
/**
 * 数组排序
 */
/**
 * 循环遍历
 */
/**
 * 迭代器方法
 */
/**
 * 扩展方法
 */