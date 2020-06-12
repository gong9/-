/**
 * 远古方式
 * 使用回调
 */

let fs = require("fs");
let path = require("path")
fs.readFile(path.join(__dirname, "./test.txt"), "utf8", (err, data) => {
    console.log(data);

})

/**
 * 远古方式
 * 改进：使用发布订阅模式
 */
class Event {
    constructor() {
        this.subs = [];
    }
    on(fn) {
        this.subs.push(fn)
    }
    emit(data) {
        this.subs.forEach(fn => fn(data));
    }
}
let fs = require("fs");
let path = require("path")
let e = new Event();
e.on((val) => {
    console.log(val);

})
fs.readFile(path.join(__dirname, "./test.txt"), "utf8", (err, data) => {
    if (err) return;
    e.emit(data);

})

/**
 * 接近现代
 */
let fs = require("fs");
let path = require("path")
let p = new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "./test.txt"), "utf8", (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data)
        }


    })
})
p.then(data => {
    console.log(data);

})

/**
 * 无线接近现代
 */

let fs = require("fs");
let path = require("path");

function* read() {
    let data = yield new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "./test.txt"), "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        })
    });
}
let it = read();
it.next().value.then(data => {
    console.log(data);
});

/**
 * 手写promise
 */
const PENDING = "PENDING";
const SUCCESS = "SUCCESS";
const FUL = "FUL";
class MyPromise {
    constructor(exector) {
        this.status = PENDING;
        this.res = undefined;
        this.val = undefined;
        let resolve = (val) => {
            if (this.status != PENDING) return;
            this.val = val;
            this.status = SUCCESS;
        }
        let reject = (err) => {
            if (this.status != PENDING) return;
            this.res = err;
            this.status = FUL;
        }
        exector(resolve, reject);
    }
    then(onfulfilled, onrejected) {
        if (this.status === SUCCESS) {
            onfulfilled(this.val);
        }
        if (this.status === FUL) {
            onrejected(this.res);
        }
    }
}
new MyPromise((resolve, reject) => {
    resolve(11);
}).then((data) => {
    console.log(data);

})

/**
 * 改进promise
 */
const resolvePromise = (promise2, x, resolve, reject) => {
    if (typeof x === "object" || typeof x === "function") {
        let then = x.then;
        if (typeof then === "function") {
            then.call(x, y => {
                resolvePromise(promise2, y, resolve, reject)
            }, z => {
                reject(z);
            })
        }
    } else {
        resolve(x);
    }
}
const PENDING = "PENDING";
const SUCCESS = "SUCCESS";
const FUL = "FUL";
class MyPromise {
    constructor(exector) {
        this.status = PENDING;
        this.res = undefined;
        this.val = undefined;
        this.onfulfilledCb = [];
        this.onrejectedCb = [];
        let resolve = (val) => {
            if (this.status != PENDING) return;
            this.val = val;
            this.status = SUCCESS;
            this.onfulfilledCb.forEach(fn => fn())
        }
        let reject = (err) => {
            if (this.status != PENDING) return;
            this.res = err;
            this.status = FUL;
            this.onrejectedCb.forEach(fn => fn());
        }

        try {
            exector(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onfulfilled, onrejected) {

        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === SUCCESS) {
                setTimeout(() => {
                    let x = onfulfilled(this.val);
                    resolvePromise(promise2, x, resolve, reject)
                }, 0)
            }
            if (this.status === FUL) {
                setTimeout(() => {
                    let x = onrejected(this.res);
                    resolvePromise(promise2, x, resolve, reject)
                }, 0)
            }

            // 异步
            if (this.status === PENDING) {
                this.onfulfilledCb.push(() => {
                    setTimeout(() => {
                        let x = onfulfilled(this.val);
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                });
                this.onrejectedCb.push(() => {
                    setTimeout(() => {
                        let x = onrejected(this.res);
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                });
            }
        })

        return promise2;
    }
}

let p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1000)
    }, 1000)
});
p.then(data => {
    console.log(data);
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve(1000)
        }, 1000)
    })

}).then(data => {
    console.log(data);

})

let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1000)
    }, 1000)
});
p.then(data => {
    console.log(data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1000)
        }, 1000)
    })

}).then(data => {
    console.log(data);

})