/**
 * 手写一些call吧
 * xx.call(tar,xx,xx...);
 */
Function.prototype.Call = function(context) {
    context = context ? Object(context) : window
    context.fn = this
    let args = [...arguments].slice(1)
    let res = context.fn(...args)
    delete context.fn
    return res
}

Function.prototype.myCall = function(context = window) {
    context.fn = this;
    let args = [...arguments].slice(1);
    let res = context.fn(...args);
    delete context.fn;
    return res;

}

/**
 * 手写一下apply
 */

Function.prototype.apply = function(context, arr) {
    context = context ? Object(context) : window
    context.fn = this
    let res
    if (!arr) {
        res = context.fn()
    } else {
        res = context.fn(...arr)
    }
    delete context.fn
    return res
}

/**
 * 手写一下bind
 */
// 函数实现
function bind(fn, context) {
    let args = Array.prototype.slice.call(arguments, 2)
    return function() {
        return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)))
    }
}
// 原型链修改
Function.prototype.bind = function(context) {
    let that = this
    let args = Array.prototype.slice.call(arguments, 1)
    return function() {
        return that.apply(context, args.concat(Array.prototype.slice.call(arguments)))
    }
}

// 更为完整的方法
Function.prototype.bind2 = function(context) {

    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function() {};

    var fBound = function() {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}

/**
 * 手写一下bind
 */
Function.prototype.myBind = function(context) {
    let that = this;
    let arg = [...arguments].slice(1);
    return function() {
        that.apply(context, arg);
    }
}

function a(c, d) {
    console.log(this.test, c, d);

}
let b = {
    test: 111
}

// 我们思考一下， 怎么才可以让a中的this是指向b的呢？
// 很简单
let b = {
        test: 111,
        fn: a
    }
    // 这样我们使用b.fn去调用函数b的时候
a.myBind(b, 1, 3)();