# 简答题

## 一

```js
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]()
```

### 答案

10

- `for (var i = 0; i < 10; i++)` 等价于 `var i = 0; for (i < 10; i++) {}`
- i 是独立于循环体之外的一个全局变量，循环结束时，i = 10，而a[6]是 `function () { console.log(i) }`
- 当a[6]执行时，沿着作用域链向上查找i，找到全局的i，所以输出10

## 二

```js
var tmp = 123

if (true) {
  console.log(tmp)
  let tmp
}
```

### 答案

报错

- 虽然外部声明了tmp，但是let会使当前块级作用域产生暂时性死区，同一块级作用域内不允许重复声明
- let不存在变量提升，不能在声明前被使用
- 所以报错

## 三

```js
var arr = [12, 34, 32, 89, 4]
Math.min(...arr)

var foo = function () {
  let a = 1
  let a = 2
  console.log(a)
}
```

## 四 var let const 比较

var

- 存在变量提升，声明的变量可以在声明前使用
- 可以重复声明
- 没有块级作用域的概念，只有全局和函数作用域

let

- 不存在变量提升，仅可以在声明后使用
- 不能重复声明
- 存在暂时性死区
- 声明的变量可以被重新赋值
- 存在块级作用域概念

const

- 不存在变量提升，仅可以在声明后使用
- 不能重复声明
- 存在暂时性死区
- 声明的变量不可以被重新赋值
- 存在块级作用域概念

## 五 箭头函数的this

```js
var a = 10
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    })
  }
}
obj.fn()
```

- setTimeout 中箭头函数的this在声明时就已经确定
- 箭头函数没有this，this是父级作用域this即fn的this
- fn函数在使用时，this确定为obj
- 所以输出20

## 六 symbol

symbol类型用来表示一个独一无二的值

使用场景

- 扩展第三方模块时，为了避免与对象已有属性发生冲突，使用symbol为对象的生成唯一key
- 由于symbol属性在外部是无法获取到的，所以可以用来为对象设置私有属性

## 七 深拷贝和浅拷贝

我们有很多种方法，依照老对象，克隆生成一个新的对象，当遇到老对象的值也是对象时，修改新对象有时也同时会改变老对象。

仅复制对象的第一层级属性生成一个对象叫做浅拷贝

复制生成一个与老对象完全没有关联的新对象的操作叫做深拷贝

### 浅拷贝

- Object.assign
- 展开运算符 { ...obj }
- Object.create()
- 数组的slice方法

### 深拷贝

- JSON.parse(JSON.stringify(obj))
- lodash cloneDeep

```js
function cloneDeep (obj, hash = new WeakMap()) {
        if (obj === null) return null

        if (obj instanceof RegExp) return new RegExp(obj)
        if (obj instanceof Date) return new Date(obj)

        if (typeof obj !== 'object') return obj

        if (hash.has(obj)) return hash.get(obj)

        const result = new obj.constructor()

        hash.set(obj, result)

        for(let key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = cloneDeep(obj[key], hash)
            }
        }

        return result
    }
```

## 八 ts和js关系

- js本身是弱类型语言，没有类型检查系统
- ts是js的超集，为js增加了类型检查系统，并且包含 javaScript、ECMAScript 2015、ECMAScript 2016等新特性...
- 使用ts完成开发工作后，将代码编译成浏览器可执行的js去工作
- 任何一种js运行环境都支持

## 九 ts缺点

- 学习成本高，需要编写更多的类型检查相关代码
- 适合长期维护的大型项目

## 十 引用计数的工作原理和优缺点

### 工作原理

在每次声明变量，占用内存时，都为这片内存空间记录一个引用次数，定期释放引用次数为0的内存空间

### 优点

- 即时清除，发现垃圾时立即回收
- 最大限度地减少程序暂停

### 缺点

- 无法回收存在循环引用的对象
- 时间开销大

## 十一 标记整理过程

- 标记阶段：遍历所有对象，将当前可达对象标记
- 清除阶段：回显执行整理，移动对象位置，让内存在地址上产生连续

## 十二 v8新生代存储区垃圾回收流程

- 将新生代存储区等分一分为二：from区域 to区域
- 将活动对象存在from区
- 进行标记整理，将未释放的内存复制到to区
- 交换from和to空间，释放内存

## 十三 增量标记算法使用场景，工作原理

### 场景

增量标记是v8在回收老生代存储区时使用

### 工作原理

- 由于垃圾回收会阻塞js程序执行
- 将一整段垃圾回收操作拆成一小步，分段回收，可以实现垃圾回收和程序执行交替执行
