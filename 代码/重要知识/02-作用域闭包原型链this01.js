for (var i = 0; i <= 5; i++) {
    (function() {
        var j = i;
        setTimeout(function() { console.log(j); }, 1000)
    })()
}

// 现在的写法
/**
 * 创建6个词法作用域，这也是闭包。虽然词法作用域和函数调用的位置是相同的，但是setTimeout的调用者确实全局，其中回调的实际调用位置呢？这个回调的真正调用位置显然不在此词法作用域中。故其实标准的闭包，其let i，即i的值被绑定在每一个生成的块级作用域中
 */
for (let i = 0; i <= 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000)
}

/**
 * 再来看一下模块模式更强大的用法
 */

/**
 * 函数拥有多个原型，protopype是属于它实例对象使用的，__proto__是函数对象使用的
 */
function User() {};
User.__proto__.view = function() {
    console.log("view");

}
User.prototype.show = function() {
    console.log("show");

}
User.view();
new User().show();

/**
 * 对象中的展开语法,展开语法同样适用于对象哦
 */
let obj = { name: 'zhansan', age: 12 };
let info = {...obj, sex: '男' }
console.log(info);

function upload(params) {
    let config = {
        type: "*.jpeg,*.png",
        size: 10000
    };
    params = {...config, ...params };
    console.log(params);
}
upload({ size: 999 })


/**
 * 对象参与计算时的自动转换
 */



/**
 * 函数参数的使用
 * 自动解构了
 */

function foo([a, b]) {
    console.log(a, b);

}
foo([1, 2])


function foo({ name, age }) {
    console.log(name, age);

}
foo({ name: 'zhangsan', age: 19 })


/**
 * 对象的属性管理
 * - 添加
 * - 删除
 * - 检测
 */

let obj = {};

obj.name = 'zhangsan';
delete obj.name;

obj.name = 'zhangsan';
//  hasOwnProperty只检测对象自身，不会去看原型链
console.log(obj.hasOwnProperty('name'));
//  in会连原型链一块检测
console.log("name" in obj);


// Object.assign方法
let hd = { a: 1, b: 2 };
hd = Object.assign(hd, { f: 1 }, { m: 9 });
console.log(hd); //{a: 1, b: 2, f: 1, m: 9}


/**计算属性
 * 对象的属性可以通过表达式计算定义
 */

let id = 0;
let obj = {
    [`id-${id++}`]: id,
    [`id-${id++}`]: id,
    [`id-${id++}`]: id,
    [`id-${id++}`]: id,
}
console.log(obj);


/**对象的遍历 */
const obj = {
    name: 'zhangsan',
    age: 18,
    sex: 'man'
}
console.log(Object.keys(obj));
console.log(Object.values(obj));
console.log(Object.entries(obj));
//for in

for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key);
    }
}

//for of
//原生的js对象没有实现iterator接口
for (const iterator of obj) {
    console.log(iterator);

}


/**
 * 对象的拷贝
 */

//浅拷贝

let obj = {
    name: 'zhangsan',
    age: 12,
    sex: 'man'
}
let newObj = {};
for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];

    }
}
console.log(newObj);


//使用assign实现浅拷贝

let obj = {
    name: 'zhangsan',
    age: 18
}
let newObj = Object.assign({}, obj);
console.log(newObj);
console.log(obj == newObj);

// 使用展开运算符也可以实现
let obj = {
    name: 'zhangsan',
    age: 18
}
let newObj = {...obj };
console.log(newObj == obj);

/**深拷贝 */
let obj1 = {
    name: 'zhangsan',
    age: 12
}
let obj2 = {
    foo: 'foo',
    obj1
}
let obj = {
    name: '后盾人',
    user: {
        name: 'hdcms'
    }
}
let newObj = {...obj }
console.log(newObj.user == obj.user);


function copy(object) {
    let obj = {};
    for (const key in object) {
        obj[key] = object[key];
    }
    return obj

}
console.log(copy(obj));


//要完全的复制一个对象
let obj = {
    name: "后盾人",
    user: {
        name: "hdcms"
    },
    data: []
};

function copy(object) {
    let obj = object instanceof Array ? [] : {};
    for (const [k, v] of Object.entries(object)) {

    }
}

/**
 * 使用setPrototypeOf和getPrototypeOf获取与设置原型
 */
let hd = {};
let obj = {
    name: 'zhangsan'
}
Object.setPrototypeOf(hd, obj);
console.log(hd.__proto__)
console.log(Object.getPrototypeOf(hd));


/**
 * 原型检测
 * instanceof检测构造函数的prototype属性是否出现在某个实例对象的原型上
 */
function A() {}

function B() {}

function C() {}

function A() {}

function B() {}

function C() {}
const c = new C();
B.prototype = c;
const b = new B();
A.prototype = b;
const a = new A();
console.dir(a instanceof A); //true
console.dir(a instanceof B); //true
console.dir(a instanceof C); //true
console.dir(b instanceof C); //true
console.dir(c instanceof B); //false

/**使用isPrototypeOf检测一个对象是否在另一个对象的原型链中 */
let a = {}
let b = {}
let c = {}
Object.setPrototypeOf(a, b)
Object.setPrototypeOf(b, c)
console.log(b.isPrototypeOf(a));
console.log(b.isPrototypeOf(c));
console.log(c.isPrototypeOf(a));


/**
 * 借用原型 
 * 使用call或apply可以借用其他原型的方法完成功能
 * 
 * */

let hd = {
    name: 'zhangsan',
    show() {
        console.log(this.name);

    }
}
let wd = {
    getName() {
        console.log(this.name);

    }
}
wd.getName.call(hd)

let hd = {
    data: [1, 2, 3, 4, 5]
}
Object.setPrototypeOf(hd, {
    max: function() {
        return this.data.sort((a, b) => b - a)[0];
    }
})
let xj = {

}

// 很多应用场景，如dom数组是类数组对象是不可以使用我们数组的方法的，我们除了把他们转成真正的数组，另一个方法就是借用数组原型上的方法


let hd = {
    name: "后盾人"
};
let houdunren = {
    name: "向军",
    show() {
        return this.name;
    }
};
hd.__proto__ = houdunren;
console.log(hd.show());

// 问为什么一般原型中只保存方法属性
// 答：因为原型链的存在，属性会被多个对象多共享

/**
 * Object.create会创建一个新对象，它的第一个参数可以指定该对象的原型，第二个对象为该对象的特征
 * proto
在实例化对象上存在 proto 记录了原型，所以可以通过对象访问到原型的属性或方法。
__proto__ 不是对象属性，理解为prototype 的 getter/setter 实现，他是一
个非标准定义
__proto__ 内部使用getter/setter 控制值，所以只允许对象或null
建议使用 Object.setPrototypeOf 与Object.getProttoeypOf 替代
__proto__
下面修改对象的 __proto__ 是不会成功的，因为_proto__ 内部使用getter/setter 控
制值，所以只允许对象或null
下面定义的__proto__ 就会成功，因为这是一个极简对象，没有原型对象所以不会影响
__proto__赋值。
下面通过改变对象的 __proto__ 原型对象来实现继承，继承可以实现多层,
let user = {
show() {
return this.name;
}
};
let hd = Object.create(user);
hd.name = "向军";
console.log(hd.show());
let user = {
show() {
return this.name;
}
};
let hd = Object.create(user, {
name: {
value: "后盾人"
}
});
console.log(hd);
let xj = {};
xj.__proto__ = "向军";
console.log(xj);
let hd = Object.create(null);
hd.__proto__ = "向军";
console.log(hd); //{__proto__: "向军"}
 */


let a = {}

function User() {}
const lisi = new User();
const wangwu = new User();
lisi.name = "小明";
console.log(lisi.name);
console.log(lisi.hasOwnProperty("name"));
//修改原型属性后
lisi.__proto__.name = "张三";
console.log(wangwu.name);
delete lisi.name;
console.log(lisi.hasOwnProperty("name"));
console.log(lisi.name);

/**
 * 怎样判断一个属性是在对象上还是在原型上啊
 * 使用in与hasOwnPrototype
 */

/**
 * 开始体验继承，注意继承是原型的继承而不是改变原型
 */

/**
 * 完全重写构造函数的原型只对后面应用的对象有效
 * 
 * 
 */
function A() {}
let a = new A();
A.prototype = {
    show() {
        console.log("show");
    }

}
let b = new A();
b.show();
a.show();

/**
 * 方法重写
 */
function Fa() {}
Fa.prototype.getName = function() {
    console.log("fa 的方法");

}

function Son() {}
Son.prototype = Object.create(Fa);
Son.prototype.constructor = Son;

Son.prototype.getName = function() {
    Fa.prototype.getName.call(this);
    console.log("这是子类扩展的");

}
let gxb = new Son()
gxb.getName();

/**
 * 多态
 * 什么叫做多态呢？
 * 根据不同的形态产生不同的效果
 */

function Use() {}
Use.prototype.show = function() {
    console.log(this.showGz());

}

function Admin() {}
Admin.prototype = Object.create(Use.prototype);
Admin.prototype.showGz = function() {
    return "admin"
}

function Member() {}
Member.prototype = Object.create(Use.prototype)
Member.prototype.showGz = function() {
    return "会员"
}
new Admin().show()
new Member().show()


/**
 * 深挖继承
 * 
 * 我们希望子类原型中能够使用父类的构造函数
 */
function User(name) {
    this.name = name;

}
User.prototype.getUserName = function() {
    return this.name;
};

function Admin(name) {
    User(name);
}
Admin.prototype = Object.create(User.prototype);
Admin.prototype.role = function() {};
let xj = new Admin("向军大叔");
console.log(xj.getUserName()); //undefined

//怎么解决呢，还是使用call。apply
function User(name) {
    this.name = name;

}
User.prototype.getUserName = function() {
    return this.name;
};

function Admin(name) {
    User.call(this, name)
}
Admin.prototype = Object.create(User.prototype);
Admin.prototype.role = function() {};
let xj = new Admin("向军大叔");
console.log(xj.getUserName());

/**
 * 原型工厂
 * 
 *  */

function extend(sub, sup) {
    sub.prototype = Object.create(sup.prototype);
    sub.prototype.constructor = sub;
}

function Fu() {}

function Son() {}
extend(Son, Fu);
console.log(Son.prototype.__proto__ == Fu.prototype);

/**
 * 对象工厂
 */

/**
 * 混入
 */

/**
 * 7大继承写法
 * 1. 原型链继承
 * 2. 借用构造函数
 * 3. 组合继承
 * 4. 原型式继承
 * 5. 寄生式继承
 * 6. 寄生组合式继承
 * 7. es6
 */

// 1.原型链继承
// 基本思想：把父类的实例对象换成子类的原型
function A() {};

function B() {};


B.prototype = new A();
// 缺点：拿不到B的构造函数了,原先实例属性变成了原型属性

//2 借用构造函数
function A(name) {
    this.name = name
}

function B(name) {
    A.call(this, name)
}

// 优点：可以向父类中传递参数
// 缺点：方法都在构造函数中写了，函数复用一说无从谈起

//原型式继承

function obj(o) {
    function Foo() {};
    Foo.prototype = o;
    return new Foo();
}


//寄生式继承
function createAnoter(o) {
    let clone = obj(o)
    clone.prototype.sayHi = function() {};
    return clone;

}

//寄生组合式继承
function extend(fa, son) {

    son.prototype = Object.create(fa.prototype);
    son.prototype.constructor = son

}

function Fa(name) {
    this.name = name;
}

function Son(name, age) {
    Fa.call(this, name, age)
}
extend(Fa, Son)


//es6

class Fa {
    constructor(name) {
        this.name = name
    }
    show() {
        console.log(`${this.name}`);

    }
}
class Son extends Fa {
    constructor(name, age) {
        super(name);
        this.age = age;
    }

}
new Son("xiaobao").show();
//

/**
 * 相关题目
 * 描述new一个对象的过程
 * 
 */

console.log(new Set("1234"));

console.log("nihao");


//ni