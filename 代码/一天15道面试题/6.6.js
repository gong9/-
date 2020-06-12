/**
 * 这也太痛苦了吧
 */






/**
 * 1
 * typeof类型判断
 * typeof是否能够正确判断类型，instance能够正确判读对象的原理是什么
 */

//对于基本类型来说

// 对于null会显示object
console.log(typeof 1);
console.log(typeof "1");
console.log(typeof undefined);
console.log(typeof false);
console.log(typeof null);
console.log(typeof Symbol());
// number
// string
// undefined
// boolean
// object
// symbol

//对于复杂数据类型了
//对于复杂类型来说，除了function都是obj
console.log(typeof []);
console.log(typeof {});
console.log(typeof
    function() {});
// object
// object
// function

// 如果我们想判断一个对象的正确类型，这个时候就可以考虑instanceof，它的内部机制是通过原型链来判断的
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str = 'hello world'
str instanceof String // false

var str1 = new String('hello world')
str1 instanceof String // true

/**2. 
 * 
 * 类型转换
 * 在js中类型转换只有三种情况分别是：
 * 转换为布尔
 * 转换为数字
 * 转换为字符串
 * 
 * 
 * 在条件判断时，除了 `undefined`，` null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象
 * 
 * 对象转化为原始值的
 */
console.log('a' + +'1');

/**
 * ==和===
 * 对于==来说如果双方的类型不一样的话就会发生类型转换
 */
console.log(null == undefined);

for (var i = 1; i <= 5; i++) {
    {
        var i = i
        setTimeout(function timer() {
            console.log(i)
        }, i * 1000)
    }
}