# 1.  promise的基本结构

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('FULFILLED')
  }, 1000)
})
```
首先我们要知道promise构造函数要接收一个函数作为参数，我们暂时称其为handel，而handle的参数有resolve和reject两个，他两也是函数

首先我们要定义一个名字叫MyPromise的class
它接收一个handle作为参数

```js
// 辅助函数判断变量否为function
const isFunction = variable => typeof variable === 'function'
```
```js
class MyPromise {
  constructor (handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
  }
}
```
# 2. promise状态和值
我们都知道promise对象有以下三种状态
- 进行时
- 已成功
- 已失败

状态的改变只有两种情况
- 进行时->已成功
- 进行时->已失败
一旦状态发生了改变之后就不会再发生变化了，会一直保持这个状态


什么叫做promise的值？
我们可以把它认为是状态改变时传递给回调函数的值

什么可以改变promise的状态呢？
- resolve
- reject

resolve 和 reject

- resolve : 将Promise对象的状态从 Pending(进行中) 变为 Fulfilled(已成功)
- reject : 将Promise对象的状态从 Pending(进行中) 变为 Rejected(已失败)
- resolve 和 reject 都可以传入任意类型的值作为实参，表示 Promise 对象成功（Fulfilled）和失败（Rejected）的值


## 接下来为我们的promise添加状态属性和值

事先定义三种状态常量
```js
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
```

实现
```js
class MyPromise {
  constructor (handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    // 添加状态
    this._status = PENDING
    // 添加状态
    this._value = undefined
    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this)) 
    } catch (err) {
      this._reject(err)
    }
  }
  // 添加resovle时执行的函数
  _resolve (val) {
    if (this._status !== PENDING) return
    this._status = FULFILLED
    this._value = val
  }
  // 添加reject时执行的函数
  _reject (err) { 
    if (this._status !== PENDING) return
    this._status = REJECTED
    this._value = err
  }
}
```

# 3. promise的then方法接收两个参数
```js
promise.then(onFulfilled, onRejected)
```
参数可选
- 如果 onFulfilled 或 onRejected 不是函数，其必须被忽略
- 如果 onFulfilled 是函数：当 promise 状态变为成功时必须被调用，其第一个参数为 promise 成功状态传入的值（ resolve 执行时传入的值）
- 如果 onRejected 是函数：当 promise 状态变为失败时必须被调用，其第一个参数为 promise 失败状态传入的值（ reject 执行时传入的值）
- 其调用次数不会超过一次

`返回值`
then的返回值也是一个promise对象，因此支持链式调用

```js
promise1.then(onFulfilled1, onRejected1).then(onFulfilled2, onRejected2);
```

这里涉及到了promise的执行规则，包括值的传递和错误捕获机制

这里涉及到 Promise 的执行规则，包括“值的传递”和“错误捕获”机制：

1、如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)

- 若 x 不为 Promise ，则使 x 直接作为新返回的 Promise 对象的值， 即新的onFulfilled 或者 onRejected 函数的参数.
- 若 x 为 Promise，就会等待该 Promise 对象(即 x )的状态发生变化，才会被调用，并且新的 Promise 状态和 x 的状态相同。

2、如果 onFulfilled 或者onRejected 抛出一个异常 e ，则 promise2 必须变为失败（Rejected），并返回失败的值 

3. 如果onFulfilled 不是函数且 promise1 状态为成功（Fulfilled）， promise2 必须变为成功（Fulfilled）并返回 promise1 成功的值

4.如果 onRejected 不是函数且 promise1 状态为失败（Rejected），promise2必须变为失败（Rejected） 并返回 promise1 失败的值



我们了解了上面的规则之后，来完善我们的promise吧，修改construction，增加执行队列
由于then方法支持多次调用，我们可以将每次then方法注册时的回调函数添加到数组中，等待执行
```js
constructor (handle) {
  if (!isFunction(handle)) {
    throw new Error('MyPromise must accept a function as a parameter')
  }
  // 添加状态
  this._status = PENDING
  // 添加状态
  this._value = undefined
  // 添加成功回调函数队列
  this._fulfilledQueues = []
  // 添加失败回调函数队列
  this._rejectedQueues = []
  // 执行handle
  try {
    handle(this._resolve.bind(this), this._reject.bind(this)) 
  } catch (err) {
    this._reject(err)
  }
}
```

### 添加then方法
首先then会返回一个promise，且将回调放到执行队列里

```js
// 添加then方法
then (onFulfilled, onRejected) {
  const { _value, _status } = this
  switch (_status) {
    // 当状态为pending时，将then方法回调函数加入执行队列等待执行
    case PENDING:
      this._fulfilledQueues.push(onFulfilled)
      this._rejectedQueues.push(onRejected)
      break
    // 当状态已经改变时，立即执行对应的回调函数
    case FULFILLED:
      onFulfilled(_value)
      break
    case REJECTED:
      onRejected(_value)
      break
  }
  // 返回一个新的Promise对象
  return new MyPromise((onFulfilledNext, onRejectedNext) => {
  })
}
```
接下就要考虑返回的这个新的promise什么时候改变状态了，它又改变成何种状态呢？
根据上文的then方法的规则，我们知道了返回新的promise对象的状态依赖于当前的then方法回调函数的执行情况及返回值，例如当前then的参数是否是一个函数、回调函数执行是否出错，返回值是否是一个promise

进一步完善then方法(`第一个需要攻克的难点也是本文的最大难点`)
```js
// 添加then方法
then (onFulfilled, onRejected) {
  const { _value, _status } = this
  // 返回一个新的Promise对象
  return new MyPromise((onFulfilledNext, onRejectedNext) => {
    // 封装一个成功时执行的函数
    let fulfilled = value => {
      try {
        if (!isFunction(onFulfilled)) {
          onFulfilledNext(value)
        } else {
          let res =  onFulfilled(value);
          if (res instanceof MyPromise) {
            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
            res.then(onFulfilledNext, onRejectedNext)
          } else {
            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
            onFulfilledNext(res)
          }
        }
      } catch (err) {
        // 如果函数执行出错，新的Promise对象的状态为失败
        onRejectedNext(err)
      }
    }
    // 封装一个失败时执行的函数
    let rejected = error => {
      try {
        if (!isFunction(onRejected)) {
          onRejectedNext(error)
        } else {
            let res = onRejected(error);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res)
            }
        }
      } catch (err) {
        // 如果函数执行出错，新的Promise对象的状态为失败
        onRejectedNext(err)
      }
    }
    switch (_status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this._fulfilledQueues.push(fulfilled)
        this._rejectedQueues.push(rejected)
        break
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        fulfilled(_value)
        break
      case REJECTED:
        rejected(_value)
        break
    }
  })
}
```

回调函数队列的处理函数什么时候剔除呢？其对应的promise状态发生了变化之时，触发了回调

当resolove或者reject方法执行时，我们依次提取成功或者失败处理函数队列的方法，并清空队列。从而实现then方法的多次调用，实现代码如下：

```js
// 添加resovle时执行的函数
_resolve (val) {
  if (this._status !== PENDING) return
  // 依次执行成功队列中的函数，并清空队列
  const run = () => {
    this._status = FULFILLED
    this._value = val
    let cb;
    while (cb = this._fulfilledQueues.shift()) {
      cb(val)
    }
  }
  // 为了支持同步的Promise，这里采用异步调用
  setTimeout(() => run(), 0)
}
// 添加reject时执行的函数
_reject (err) { 
  if (this._status !== PENDING) return
  // 依次执行失败队列中的函数，并清空队列
  const run = () => {
    this._status = REJECTED
    this._value = err
    let cb;
    while (cb = this._rejectedQueues.shift()) {
      cb(err)
    }
  }
  // 为了支持同步的Promise，这里采用异步调用
  setTimeout(run, 0)
}
```
这里还有一种特殊的情况，就是当 resolve 方法传入的参数为一个 Promise 对象时，则该 Promise 对象状态决定当前 Promise 对象的状态。
```js
// 添加resovle时执行的函数
_resolve (val) {
  const run = () => {
    if (this._status !== PENDING) return
    this._status = FULFILLED
    // 依次执行成功队列中的函数，并清空队列
    const runFulfilled = (value) => {
      let cb;
      while (cb = this._fulfilledQueues.shift()) {
        cb(value)
      }
    }
    // 依次执行失败队列中的函数，并清空队列
    const runRejected = (error) => {
      let cb;
      while (cb = this._rejectedQueues.shift()) {
        cb(error)
      }
    }
    /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
      当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
    */
    if (val instanceof MyPromise) {
      val.then(value => {
        this._value = value
        runFulfilled(value)
      }, err => {
        this._value = err
        runRejected(err)
      })
    } else {
      this._value = val
      runFulfilled(val)
    }
  }
  // 为了支持同步的Promise，这里采用异步调用
  setTimeout(run, 0)
}
```
## catch方法
```js
// 添加catch方法
catch (onRejected) {
  return this.then(undefined, onRejected)
}
```



```js
// 添加静态resolve方法
static resolve (value) {
  // 如果参数是MyPromise实例，直接返回这个实例
  if (value instanceof MyPromise) return value
  return new MyPromise(resolve => resolve(value))
}
```

```js
// 添加静态reject方法
static reject (value) {
  return new MyPromise((resolve ,reject) => reject(value))
}
```

```js
// 添加静态all方法
static all (list) {
  return new MyPromise((resolve, reject) => {
    /**
     * 返回值的集合
     */
    let values = []
    let count = 0
    for (let [i, p] of list.entries()) {
      // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
      this.resolve(p).then(res => {
        values[i] = res
        count++
        // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
        if (count === list.length) resolve(values)
      }, err => {
        // 有一个被rejected时返回的MyPromise状态就变成rejected
        reject(err)
      })
    }
  })
}
```

```js
// 添加静态race方法
static race (list) {
  return new MyPromise((resolve, reject) => {
    for (let p of list) {
      // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
      this.resolve(p).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    }
  })
}
```

```js
finally (cb) {
  return this.then(
    value  => MyPromise.resolve(cb()).then(() => value),
    reason => MyPromise.resolve(cb()).then(() => { throw reason })
  );
};
```