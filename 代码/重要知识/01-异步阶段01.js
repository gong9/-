//简单的AOP
let oldPush = Array.prototype.push;

function push(...args) {
    console.log("数据的劫持");
    oldPush.call(this, ...args);

}
let arr = [1, 2, 3];
push.call(arr, 4, 5, 6)
console.log(arr);

//wrappers
function preform(anyMethod, wrappers) {
    //初始化方法运行
    // 核心方法运行
    // close方法运行
}

// after 在什么什么之后
function after(times, cb) {
    return function() {
        if (--times === 0) {
            cb();
        }
    }
}
const fn = after(3, function() {
    console.log("执行了");

})
fn()
fn()
fn()


/**
 * 开始介入异步的区域
 * 解决异步方法一：回调
 */


function fn01() {
    setTimeout(function() {
            let data = 2;
        },
        1000
    )
}

function fn02() {
    setTimeout(function() {
            let data = 3;
        },
        1000
    )
}
/**
 * 发布订阅解决异步
 * 
 */
let fs = require("fs")
let path = require("path")


let event = {
    _arr: [],
    on(fn) {
        this._arr.push(fn);
    },
    emit() {
        this._arr.forEach(fn => fn());
    }
}
event.on(function() {
    console.log("读取成功");
})

fs.readFile(path.join(__dirname, './test.txt'), "utf-8", function(err, data) {
    if (!err) {
        console.log(data);
        event.emit();
    }
})

/**
 * 观察者和发布订阅
 * 
 * 观察者与被观察者有关系且基于发布订阅模式
 */

class Dep {
    constructor() {
        this.status = 0;
        this.subs = [];
    }

    attach(w) {
        this.subs.push(w)
    }
    setStatus() {
        console.log("我状态改变了");
        this.subs.forEach(w => w.updata());
    }

}
class Watch {
    constructor(name) {
        this.name = name;
    }
    updata() {
        console.log(`${this.name} 知道了`);

    }

}
const w1 = new Watch("w1");
const w2 = new Watch("w2");
const w3 = new Watch("w3");
const dep1 = new Dep();
dep1.attach(w1);
dep1.attach(w2);
dep1.attach(w3);
dep1.setStatus();

/**
 * promise
 * 三状态：运行时，成功时，失败时
 * 特定：一旦成功便不能转失败
 * 优点：解决嵌套
 * 缺点：还是基于回调的
 */
let promise = new Promise((resole, reject) => {
    resole(11);
})
promise.then(function(val) {
    console.log(val);
})

/**
 * promise v1.0 版本
 *   
 */
const PENDING = "PENDING";
const SUCCESSS = "SUCCESSS";
const FUl = "FUl"
class Promise01 {
    constructor(executor) {
        this.status = PENDING;
        this.val = undefined; //成功值
        this.res = undefined; //错误原因
        let resolve = (val) => {
            if (this.status != PENDING) return;
            this.val = val;
            this.status = SUCCESSS;


        }
        let reject = (res) => {
            if (this.status != PENDING) return;
            this.res = res;
            this.status = FUl

        }
        try {
            executor(resolve, reject);
        } catch (error) {
            this.res = error;
        }
    }
    then(onfulfilled, omrejected) {
        if (this.status === SUCCESSS) {
            onfulfilled(this.val)
        }
        if (this.status === FUl) {
            omrejected(this.res);
        }
    }
}

let p = new Promise01((res, rej) => {
    res(3);
}).then(function(val) {
    console.log(val);

})

/**
 * 思考我们上面写的
 * 我们传入的executor是个异步任务
 * 导致我们调then的时候，该promise实例的状态还是运行态。那不就是卡住了吗
 * 
 * 
 */
const PENDING = "PENDING";
const SUCCESSS = "SUCCESSS";
const FUl = "FUl"
class Promise01 {
    constructor(executor) {
        this.status = PENDING;
        this.val = undefined; //成功值
        this.res = undefined; //错误原因
        this.onResolveCb = [];
        this.onRejectCb = [];
        let resolve = (val) => {
            if (this.status != PENDING) return;
            this.val = val;
            this.status = SUCCESSS;
            this.onResolveCb.forEach(fn => fn());


        }
        let reject = (res) => {
            if (this.status != PENDING) return;
            this.res = res;
            this.status = FUl;
            this.onRejectCb.forEach(fn => fn());

        }
        try {
            executor(resolve, reject);
        } catch (error) {
            this.res = error;
        }
    }
    then(onfulfilled, omrejected) {
        if (this.status === SUCCESSS) {
            onfulfilled(this.val)
        }
        if (this.status === FUl) {
            omrejected(this.res);
        }
        // 如果是异步的话先订阅
        if (this.status === PENDING) {
            this.onResolveCb.push(onfulfilled);
        }
    }
}

let p = new Promise01((res, rej) => {
    res(3);
}).then(function(val) {
    console.log(val);

})

/**
 * then的用法
 * 链式调用
 * 明确一点，如果promise的then返回来一个promise的话，这个promise会自动执行，并且采用它的状态
 * 
 * 如果我不想再向下走then，该怎么办？
 *    - 放一个空的promise
 * 
 * 明确then仍是返回一个promise实例
 * 实现中怎么写？
 * 1. 判断是不是promise，如果是promise就采用它的状态
 * 2. 如果不是promise直接将结果传递下去即可
 * 
 * 下面代码的两种解释
 * - 为啥子加定时器
 * 要拿到promise2
 * - 但是写定时器之后它内部的错误是无法被外面的try catch捕获的
 * 故内部也要加
 */
const PENDING = "PENDING";
const SUCCESSS = "SUCCESSS";
const FUl = "FUl"

const resolvePromise = (promise2, x, resolve, reject) => {
    //判断x的类型
    if (promise2 === x) {
        return reject("类型错误");
    }
    if (typeof promise2 === "object" || typeof promise2 === "function") {
        let then = x.then;
        if (typeof then === "function") {
            then.call(x, y => {
                //  resolve(y);//这个y能直接扔吗？
                resolvePromise(promise2, y, resolve, reject);

            }, r => {
                reject(r);
            })
        }

    }
    //普通值
    else {
        resolve(x);
    }

}
class Promise01 {
    constructor(executor) {
        this.status = PENDING;
        this.val = undefined; //成功值
        this.res = undefined; //错误原因
        this.onResolveCb = [];
        this.onRejectCb = [];
        let resolve = (val) => {
            if (this.status != PENDING) return;
            this.val = val;
            this.status = SUCCESSS;
            this.onResolveCb.forEach(fn => fn());


        }
        let reject = (res) => {
            if (this.status != PENDING) return;
            this.res = res;
            this.status = FUl;
            this.onRejectCb.forEach(fn => fn());

        }
        try {
            executor(resolve, reject);
        } catch (error) {
            this.res = error;
        }
    }
    then(onfulfilled, omrejected) {
        let promise2 = new Promise01((resolve, reject) => {
            if (this.status === SUCCESSS) {
                // 整一个宏任务
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.val);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }
            if (this.status === FUl) {
                let x = omrejected(this.res);
            }
            // 如果是异步的话先订阅
            if (this.status === PENDING) {
                this.onResolveCb.push(onfulfilled);
            }
        });
        return promise2;
    }
}






/**
 * 
 * 
 * 把then整成可选参数
 * 
 * 
 * 
 */

const PENDING = "PENDING";
const SUCCESSS = "SUCCESSS";
const FUl = "FUl"

const resolvePromise = (promise2, x, resolve, reject) => {
    //判断x的类型
    if (promise2 === x) {
        return reject("类型错误");
    }
    if (typeof promise2 === "object" || typeof promise2 === "function") {
        let then = x.then;
        if (typeof then === "function") {
            then.call(x, y => {
                //  resolve(y);//这个y能直接扔吗？
                resolvePromise(promise2, y, resolve, reject);

            }, r => {
                reject(r);
            })
        }

    }
    //普通值
    else {
        resolve(x);
    }

}
class Promise01 {
    constructor(executor) {
        this.status = PENDING;
        this.val = undefined; //成功值
        this.res = undefined; //错误原因
        this.onResolveCb = [];
        this.onRejectCb = [];
        let resolve = (val) => {
            if (this.status != PENDING) return;
            this.val = val;
            this.status = SUCCESSS;
            this.onResolveCb.forEach(fn => fn());


        }
        let reject = (res) => {
            if (this.status != PENDING) return;
            this.res = res;
            this.status = FUl;
            this.onRejectCb.forEach(fn => fn());

        }
        try {
            executor(resolve, reject);
        } catch (error) {
            this.res = error;
        }
    }
    then(onfulfilled, onrejected) {
        onfulfilled = typeof onfulfilled === "function" ? onfulfilled : data => data;

        onrejected = typeof onrejected === "function" ? onrejected : err => {
            throw err;
        }

        let promise2 = new Promise01((resolve, reject) => {
            if (this.status === SUCCESSS) {
                // 整一个宏任务
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.val);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }
            if (this.status === FUl) {
                let x = onrejected(this.res);
            }
            // 如果是异步的话先订阅
            if (this.status === PENDING) {
                this.onResolveCb.push(onfulfilled);
            }
        });
        return promise2;
    }
}

/**
 * promise.all
 * 等到全部promise执行
 * 静态方法 
 */
Promise.all = function(val) {
    return new Promise((reslove, reject) => {
        let arr = [];
        let index = 0; //解决多个异步并发要使用计时器

        function processData(k, v) {
            arr[k] = v;
            index++;
            if (index === val.length) {
                reslove(arr);
            }
        }
        for (let i = 0; i < val.length; i++) {
            let current = arr[i];

            if (isPromise(current)) {
                current.then((data) => {
                    processData(i, date)
                }, err => {
                    reject(err);
                })
            } else {
                processData(i, current);
            }
        }
    })
}

/**
 * finnally方法
 * 返回promise实例，无论成功失败都执行
 * 先来示范一下用法
 */
let p = new Promise((resolve, reject) => {
    resolve(10);
})

p.finally(() => {
        console.log(111);

    }).then(data => {
        console.log(data);

    }, err => {
        console.log(err);

    })
    /**
     * 实现finally
     */
Promise.finally = function(cb) {

}