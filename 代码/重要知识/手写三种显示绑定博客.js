// 从this的隐士绑定入手

// 然而调用位置会使用obj的上下文来引用对象，这时绑定规则就会把调用函数的this绑定到此上下文中，故此时this.a==Object.a


Function.prototype.myCall = function(context = window) {
    context.fn = this;
    let res = context.fn(...([...arguments].slice(1)));
    delete context.fn;
    return res;

}
Function.prototype.myApply = function(context = window, arr) {
    context.fn = this;
    let res;
    if (!arr) {
        res = context.fn();
    } else {
        res = context.fn(...arr);
    }


    delete context.fn;
    return res;

}
console.log(...[1, 2, 3]);

Function.prototype.myBind = function(context) {
    let that = this;
    let args = [...arguments].slice(1);
    return function() {
        return that.apply(context, args);
    }
}

function a(b, c) {
    console.log(this.d, b, c);

}
let e = {
    d: 1
}
a.myApply(e, [2, 3])
a.myCall(e, 2, 3)
a.myBind(e, 2, 3)()