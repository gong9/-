/**
 * 对象的声明
 */

//  字面量
let a = {}
    //使用构造函数，字面量的本质也是使用了构造函数
let a = new Object();


/**
 * 属性操作
 */

let obj = {
        name: 'gxb',
        age: 18
    }
    //.与[]的区别，主要是[]里面可以放置变量，.后面只能是字符串
console.log(obj.name);
console.log(obj["age"]);

//删除
delete obj.age;
console.log(obj);


//展开语法在对象中的使用
let obj = {
    name: 'gxb'
}
console.log({...obj });

// 对象的转换

//检测属性
//不会检测原型链,in会去找原型链
console.log(obj.hasOwnProperty("name"));

//assign实现对象的复制
let obj1 = {
    name: 'gxb',
    age: 18
}
let obj2 = {
    sex: 'man'
}
console.log(Object.assign(obj1, obj2));
console.log(obj1);


//计算属性
//即设置属性的时候，属性可以使用表达式的形式
let num = 0;
let obj = {
    [++num]: "属性值"
}
console.log(obj);


//对象的遍历
let obj = {
    name: 'gxb',
    age: 19,
    sex: 'man'
}
console.log(Object.keys(obj));
console.log(Object.values(obj));
console.log(Object.entries(obj));

for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(obj[key]);
    }
}

for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);

}


//对象的拷贝

//浅拷贝
let obj1 = {
        name: 'zhangsan'
    }
    // 1）使用遍历
let obj2 = {};
for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
        obj2[key] = obj1[key]

    }
}
console.log(obj2);

// 2）使用assign
console.log(Object.assign({}, obj1));

// 3）使用扩展语法
console.log({...obj1 });

//深拷贝
let obj1 = {
    name: 'zhangsan',
    foo: {
        age: 19
    }
}

function copy(object) {
    let obj = object instanceof Array ? [] : {};
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            //判断属性值的类型
            if (typeof object[key] === "object") {
                obj[key] = copy(object[key])
            } else {
                obj[key] = object[key]
            }

        }
    }
    return obj
}
let obj2 = copy(obj1)
console.log(obj2.foo.age);
obj1.foo.age = 20;
console.log(obj2.foo.age);


//属性特征
// 查看对象的属性特征
const obj = {
        name: 'gxb',
        age: 19
    }
    // 查看单一属性
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// 查看所有属性
console.log(Object.getOwnPropertyDescriptors(obj));

// 设置特征,单一属性设置
Object.defineProperty(obj, 'name', {
        value: 20,
        writable: true,
        enumerable: true,
        configurable: true
    })
    //多属性设置
Object.defineProperties(obj, {
    name: {
        value: 20,
        writable: true,
        enumerable: true,
        configurable: true
    },
    age: {
        value: 20,
        writable: true,
        enumerable: true,
        configurable: true
    }
})

//禁止向对象中添加属性
const obj = {
    name: 'gxb'
}
Object.preventExtensions(obj);
obj.age = 18
console.log(obj);
//判断该对象是否允许添加属性
console.log(Object.isExtensible(obj));


//封闭对象，即不可配置，不可添加新属性,不可删除

const obj = {
    name: 'zhangsan'
}

Object.seal(obj);
obj.name = 'li'
obj.age = 19;
console.log(obj);
Object.isSealed(obj)

//冻结对象，即不可写，不可配置，不可添加删除，修改属性
const obj = {
    name: 'zhangsan'
}
Object.freeze(obj)
obj.name = 'lisi'
console.log(obj);
console.log(Object.isFrozen(obj));




// 属性访问器
const obj = {
    data: { name: 'zhangsan' },
    get name() {
        return this.data.name;
    },
    set name(name) {
        this.data.name = name;
    }

}
console.log(obj.name);
obj.name = "lisi"
console.log(obj.name);

//访问器描述符

const obj = {
    name: 'zhangsan',
    age: 19
}
Object.defineProperties(obj, {
    name: {
        get() {
            console.log(`this is name  getter`);
            return value;

        }
    }
})


//代理
//代理属于中介
//setter,getter是对单个对象属性的控制，而代理是对整个对象的控制
//严格模式下set必须有返回值

const obj = {
    name: 'zhangsan'
}

const proxy = new Proxy(obj, {
    get(obj, key) {
        console.log('getter...');
        return obj[key];

    },
    set(obj, key, value) {
        console.log('set..');

        obj[key] = value;
        return true
    }
})
console.log(proxy.name);
proxy.age = 19
console.log(obj);


// 代理函数
function fn(num) {
    return num;
}
const proxy = new Proxy(fn, {
    apply(fn, context, args) {
        console.time("run");
        let res = fn.apply(context, args);
        console.timeEnd("run");
        return res;
    }
})

console.log(proxy.apply(this, [2]));


function factorial(num) {
    return num == 1 ? 1 : num * factorial(num - 1);
}
let proxy = new Proxy(factorial, {
    apply(func, obj, args) {
        console.time("run");
        func.apply(obj, args);
        console.timeEnd("run");
    }
});
proxy.apply(this, [1, 2, 3]);

//json
//序列化和反序列化