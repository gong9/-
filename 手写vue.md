# 手写Vue

## 1. 数据驱动模型

## 2. 虚拟DOM

## 3. 函数柯里化

## 4. 响应式原理

## 5. 发布订阅模式

## 6. Watch与Dep



# 数据驱动

# vnode-dom，dom——vnode

# 响应式





watcher与dep

get的时候进行依赖收集

set的时候进行notice



之前将渲染watcher放到了全局作用



- 渲染watcher

- 计算行为

  -   计算属性也是要监听属性状态的改变的，只有其中一个发生变化就会促使我们的计算属性重新计算，从新计算的行为是由watcher来处理的



- 依赖收集与派发更新是怎么运行起来的 



```
计算属性是会伴随其使用属性的变化而变化的
```

![1590717731526](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590717731526.png)

get时候进行收集

- 即访问此数据了，将它保存下来。即拿了一次此数据收集一次对应属性

set时候进行更新

- set完了，注意是以组件为单位刷新？

**确实比较抽象**

演示收集的意义

![1590718519014](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590718519014.png)

一开始肯定是全部数据都拿了一遍，即所有数据均收集了。

![1590718614771](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590718614771.png)

这时候我改了一下子组件的属性，首先会触发set，set触发更新，更新会做什么操作呢，肯定是要重渲页面。这时就要需要拿数据了，拿数据就要触发get，get就触发收集依赖。故打印如控制台所示。

不会去更新我觉得这里是因为两个组件，即两个watcher。

两个watcher是不一样的，在功能上。一个全局渲染，一个子组件

**升级**

依赖收集：就是告诉当前的watcher什么属性被访问了，那么在这个watcher工作的时候就会将这些收集到的属性进行更新。

我们要做的事情：如何将属性与`当前`watcher关联起来

- 在全局准备一个watcher栈,把所有watcher都存起来。
- 在watcher调用get时，将当前watcher放到全局，在get执行结束之后将watcher移出，更新谁，谁在全局的那个位置

**dep**

每一个属性都有一个dep对象，但是这个dep对象是干啥的呢

什么意思？

页面被渲染的时候，属性肯定是会被访问到的呢

这表示什么呢？此时的watcher正在调用get方法，还没有结束。（为什么没有结束）

watcher的get干了什么呢，调用了渲染函数。渲染肯定得拿数据，mount。

这时在访问数据，即在调用get，这时肯定全局是有一个watcher呢

属性与watcher关联

**dep干的是依赖收集和通知的工作**

这里工作流程是什么样子呢。

- 属性是用当前的渲染watcher渲染的，所以它知道是那个watcher渲染的
- 当前的watcher引用dep收集到的依赖（属性），故当前的watcher知道它要渲染什么属性
- 属性和watcher相互关联，即互相能够拿到对方（双向链表）

dep中的notify

- 内部就是将dep中subs取出来，一次调用update方法，subs中存在啥呢？它存的是知道要渲染什么属性的watcher
- 访问了啥就等于更新谁？

## 新的起点

#### 怎么实现多watcher

- 用一个栈存
- 在watcher调用它的get方法时（即更新渲染），调用pushTarget。为什么呢？即渲染完成之后将此watcher（即当前的全局watcher推入全局watcher栈），get方法结束的时候，调用popTarget。为什么呢？get方法结束之后即代表更新渲染操作完成，此watcher的使用就完成了，即从全局watcher栈中将它踢出
- ![1590721446114](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590721446114.png)
- ![1590721675046](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590721675046.png)

**回到initdata中来**

initdata中做了哪些事呢，首先defineproperty方法在这里，利用它可以数据劫持的特性进行数据的响应式处理，即在get的时候进行依赖收集，在set的时候进行派发更新。

- 怎么依赖收集？收集什么？

  dep.depend()

  就是将当前的dep与当前的watcher互相关联。就是将当前的全局watcher放到subs里面

  同时还需要当前watcher关联到dep

  watcher中有一个方法：addDep

  ![1590722510229](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590722510229.png)

  ![1590722545199](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590722545199.png)

- dep中的通知notify是干啥呢

  当前dep的subs中其关联的watcher，然后依次调watcher的updata。进行更新了 

### 属性、dep、watcher三角恋

有三个属性，页面怎么将它们渲染出来的呢

- 有一个抽象语法树
- 抽象语法树转成虚拟dom（有联合数据，即访问了数据的get，触发依赖收集，属性会与dep，dep关联watcher。watcher被注入了三个依赖（3个属性即3个dep））
- 转换成真正dom（表示get方法执行完了）
- **get**一结束，全局watcher不存在了，但是属性还在，属性还在的话其对应的dep还在，dep中还有引用的watcher呢，所有可以通过dep找过对应watcher，理论上将再调用此watcher页面被重新渲染
- 修改属性，修改不再页面上渲染的额外属性。dep中没有关联watcher，故修改它时不会触发渲染
- ![1590739756291](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590739756291.png)
- 必须去梳理它们之间的个个流程

### 来玩源码

个个文件说明

- compiler：编译
  - 在vue中字符串是模板
- core：核心。vue构造函数，生命周期等方法
- platform：平台
  - 针对运行的环境有不同的实现也是vue的入口
- server：主要是将vue用到服务端时的处理
- sfc：单文件组件，（暂时不考虑）
- shared：公共工具，方法

### 你自己要实现的东西

- 完成响应式
- 柯里化
- 发布订阅模式
- 数据劫持

**## vue响应式原理Observe、dep、watcher理解**

01

对的，我们都知道vue的响应式是通过object.defineProperty实现的，被它修饰过的对象，就会变成【响应化】，也就是触发这个对象属性时。会触发其get、set。进而触发一些视图的更新

02

vue用observer类来管理上述数据劫持的过程

\```js

class Observer {

 constructor() {

  // 响应式绑定数据通过方法

  observe(this.data);

 }

}

 

export function observe (data) {

 const keys = Object.keys(data);

 for (let i = 0; i < keys.length; i++) {

  // 将data中我们定义的每个属性进行响应式绑定

  defineReactive(obj, keys[i]);

 }

}

\```

03

依赖管理

什么是dep呢？dep是用来做什么的呢？

像上面，我们通过数据劫持能够监听到数据的变化了。但是我们怎么通知视图进行页面的更新呢

dep两个主要作用：依赖收集、派发更新

比如下面的代码：data中有两个属性，只有一个是要被渲染在页面上的，这时我们就要把这个属性收集起来

每一个属性对应一个dep，要渲染到页面上的那个属性对应的dep就收集到了一个依赖。

这个依赖是啥呢？这个依赖就是用来管理这个属性变化的

如果这个时候，开发者又使用了watch属性，也要用来监听上面的那个属性

则那个属性的dep中又收集到了一个依赖

如果这个时候开发者又搞了个computer属性，里面又又又用到了上面的属性，则其对应的dep中又来了个依赖

![1590744381937](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590744381937.png)

### 那么如何收集依赖呢？

回想一样我们是如何能够获知data中的哪个属性被使用了呢？

很简单数据劫持的时候啊，一拿数据肯定会触发其get方法。那么就好办了。

我们在get的时候进行依赖的收集

```js
function defineReactive (obj, key, val) {
  let Dep; // 依赖
 
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      console.log('我被读了，我要不要做点什么好?');
      // 被读取了，将这个依赖收集起来
      Dep.depend(); // 本次新增
      return val;
    },
    set: newVal => {
      if (val === newVal) {
        return;
      }
      val = newVal;
      // 被改变了，通知依赖去更新
      Dep.notify(); // 本次新增
      console.log("数据被改变了，我要把新的值渲染到页面上去!");
    }
  })
}
```

#### 接下来还是回到上面开始的时候提到的问题上面去，依赖到底是什么呢？

watcher吧

那么watcher究竟又要干什么呢？

watcher说白了就是一个中介，还是拿上面收集了3个依赖的属性举例

当其属性状态发生改变的时候，就通知这三个中介去做它们要做的事情。或是渲染、或是计算

同时watcher也要有能力控制或者说是知道自己要处理的目标

这么说吧，上面层面举例。我们来看看wacther里面要实现的方法

![1590744952872](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590744952872.png)

### 来谈发布订阅模式

发布订阅模式是一种比较常见的设计模式，其有两个角色即发布者和订阅者。多个订阅者者可以向同一发布者订阅一个事件，当事件发生的时候，发布者会通知所有订阅了此事件的订阅者。

接下来看栗子：

```js
class Dep {
 constructor() {
 this.subs = [];
 }
 // 增加订阅者
 addSub(sub) {
 if (this.subs.indexOf(sub) < 0) {
  this.subs.push(sub);
 }
 }
 // 通知订阅者
 notify() {
 this.subs.forEach((sub) => {
  sub.update();
 })
 }
}
 
const dep = new Dep();
 
const sub = {
 update() {
 console.log('sub1 update')
 }
}
 
const sub1 = {
 update() {
 console.log('sub2 update');
 }
}
 
dep.addSub(sub);
dep.addSub(sub1);
```

#### 动起小手吧

了解了object.defineProperty和发布订阅模式后。我们已经知道了vue就是基于这两玩意完成的响应式处理

通过发布订阅模式我们为对象的每一个属性都创建一个dep即发布者，当有其他订阅者（watcher）



# 怎么实现的响应式的呢

换句话说我们要实现响应式要解决什么问题呢？

- 我们需要一个手段，通过它知道我们的数据变了
- 知道数据变了之后我们怎么去进行同步更新呢

手段1：

这个方法我们已经什么的熟悉了，就是采用数据劫持

手段2：

就是采用发布订阅模式

从初始化开始我们在渲染视图的时候，就会生成一个watcher

先考虑下面的问题：

- watcher如何去更新视图
- 数据又是怎么和watcher实现联动的呢



# vue的原理

为什么会考？

- 知其然知其所以然！
- 了解了原理才能更好的应用啊
- 大厂造轮子（有钱有资源，业务定制一些跨框架是满足不了自己的需求的）

什么方式考？如何去考？

- 考察重点而不是**细节**。掌握好2/8原则
- **和使用相关联**的如vdom、模板渲染
- 流程的**全面性**。vue的工作流程，**流程的闭环**
- 热门技术的深度

范围？比较重要的知识？

- 组件化

- 响应式

- vdom和diff

- 模板编译

- 渲染过程

- 前端路由

![1590749015341](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590749015341.png)

![1590749067238](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590749067238.png)

### 1. 你了解组件化吗

mvvm模型

数据驱动视图

![1590749653029](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590749653029.png)

不在自己操作视图

mvvm这个东西

![1590749737024](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590749737024.png)

### 2. 来探讨响应式

- 组件data的数据一旦变化，立即触发视图的更新
- 实现数据驱动视图的第一步
- vue的考察比较重要的

![1590750467214](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590750467214.png)

![1590750566413](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590750566413.png)

ie11不支持proxy

![1590750690787](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590750690787.png)



![1590750794468](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590750794468.png)

![1590751086865](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590751086865.png)

![1590751140273](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590751140273.png)

加深度啦

![1590751285603](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590751285603.png)

我们要进行一些相应的处理了

![1590751424489](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590751424489.png)

设置新的值时候呢？万一你设置的新值也是一个对象呢？他也是要进行监听的啊

![1590751590865](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590751590865.png)

### 下面就得讨论一些它的缺点了

- 深度监听，需要递归到底，一次性计算很大
- 新增属性和删除属性是不会被监听到的
- 监听不了数组

**重新定义数组原型方法**

![1590752748984](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590752748984.png)

###  玩转虚拟dom和diff

![1590752799654](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590752799654.png)

dom操作非常耗费性能

为啥出现vdom？

![1590752934680](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590752934680.png)

解决方案：

![1590753075397](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753075397.png)

![1590753203546](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753203546.png)

![1590753314576](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753314576.png)

#### diff算法

![1590753566470](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753566470.png)

什么是diff吗，找不同呗

![1590753697832](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753697832.png)



![1590753752017](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753752017.png)



![1590753804144](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753804144.png)



怎么办？

![1590753881795](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753881795.png)

![1590753959813](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590753959813.png)

key是啥玩意？

patch（）比较两个vnode



![1590761407730](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590761407730.png)

![1590761527808](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590761527808.png)



通过js对象来描述dom是非常简单的

- 虚拟dom如何新建
  - 两个函数 01是createElement用于新建虚拟dom  02是render 用于渲染
  - ![1590798637718](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590798637718.png)
  - 
- 虚拟dom如何渲染
- 虚拟dom如何patch
- vue中的虚拟dom

​      

### 再来换一种思路

还是先创建虚拟dom

再渲染虚拟dom=>dom

#### diff咯

这时候就得区分是首次渲染还是二次了

二次是需要进行diffde

![1590801203594](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590801203594.png)

##### patch是最重要的

怎么比较呢？

- 两个节点的flag不一样，没什么可说的直接替换咯

- 一样咯

  就得详细比较两个节点咯，比较他们的html和text咯

  - 比较文本比较简单，直接比较就完事了
  - 比较元素就难搞了，还是

  ![1590804644681](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590804644681.png)



![1590804933724](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590804933724.png)



-  编译
  - 解析
  - 优化
  - 生成
- 响应式
- 虚拟dom



还是来看vue的diff

diff只会同层层比较，不会垮层级比较。故diff是广度优先搜索算法

![1590805644853](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590805644853.png)



一般的diff算法是采用的深度优先遍历，对新旧两树进行一次深度优先遍历，这样每个节点都会有一个唯一的标识。在遍历的时候，每遍历一个节点就把该节点和新的树的同一位置上的节点进行对比。如果有差异的话就记录下来

## 首先区分首次和布什



















































### 接下来到了模板编译咯

![1590761618054](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590761618054.png)

vue是怎么处理模板的呢？

js的with语法。

![1590761709105](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590761709105.png)

模板=>vnode

![1590761860949](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590761860949.png)



![1590761903993](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590761903993.png)

![1590762067664](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590762067664.png)



_c,createlemte函数

模板=》render函数

render函数执行成vnode

![1590845535670](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590845535670.png)

![1590845606561](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590845606561.png)



![1590850392456](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590850392456.png)

![1590850441476](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590850441476.png)

![1590850523458](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590850523458.png)

![1590850698816](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590850698816.png)



![1590850758033](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590850758033.png)



![1590850818579](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590850818579.png)



![1590851161242](C:\Users\T540P\AppData\Roaming\Typora\typora-user-images\1590851161242.png)







































































































