/** 代码题 */

/** 第一题 */

{
    setTimeout(function () {
        var a = 'hello'
        setTimeout(function () {
            var b = 'lagou'
            setTimeout(function () {
                var c = 'i love you'
                console.log(a + b + c)
            }, 10)
        }, 10)
    }, 10)

    const promise1 = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('hello')
            }, 10)
        })
    }
    const promise2 = (value) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(value + 'lagou')
            }, 10)
        })
    }
    const promise3 = (value) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(value + 'i love you')
            }, 10)
        })
    }
    promise1().then(value => {
        return promise2(value)
    }).then(value => {
        return promise3(value)
    }).then(value => {
        console.log(value)
    })
}


/** 第二题 */

{
    // 练习1
    const fp = require('lodash/fp')
    const cars = [
        {
            name: '1',
            horsepower: 1111,
            in_stock: 11,
            dollar_value: 3000
        },
        {
            name: '2',
            horsepower: 2222,
            in_stock: 22,
            dollar_value: 4000
        },
        {
            name: '3',
            horsepower: 33333,
            in_stock: 33,
            dollar_value: 8000
        }
    ]
    let isLasInStock = function (cars) {
        let last_car = fp.last(cars)
        return fp.prop('in_stock', last_car)
    }
    console.log(isLasInStock(cars))

    const execFn = fp.flowRight(fp.prop('in_stock'), fp.last)
    console.log(execFn(cars))

    // 练习2
    const firstName = fp.flowRight(fp.prop('name'), fp.first)(cars)
    console.log(firstName)

    // 练习3
    let _average = function (xs) {
        return fp.reduce(fp.add, 0, xs) / xs.length
    }
    let averageDollarValue = function (cars) {
        let dollar_value = fp.map(function (car) {
            return car.dollar_value
        }, cars)
        return _average(dollar_value)
    }
    console.log(averageDollarValue(cars))

    const refactorAverageDollarValue  = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))
    console.log(refactorAverageDollarValue(cars))

    // 练习4
    let _underscore = fp.replace(/\W+/g, '_')
    const sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower))
    console.log(sanitizeNames(['Hello World']))

}

/** 第三题 */

{
    const fp = require('lodash/fp')

    class Container {
        static of (value) {
            return new Container(value)
        }

        constructor(value) {
            this._value = value
        }

        map(fn) {
            return Container.of(fn(this._value))
        }
    }

    class Maybe {
        static of (x) {
            return new Maybe(x)
        }
        isNothing() {
            return this._value === null || this._value === undefined
        }

        constructor(x) {
            this._value = x
        }
        map(fn) {
            return this.isNothing() ? this : Maybe.of(fn(this._value))
        }
    }

    // 练习1
    let maybe = Maybe.of([5, 6, 1])
    let ex1 = num => maybe.map(x => fp.map(fp.add(num), x))

    console.log(fp.add(1,3))
    // 让函子中的值增加3
    console.log(ex1(3))

    // 练习2
    let xs = Container.of(['do', 'ray', 'me'])
    let ex2 = () => xs.map(x => fp.first(x))._value
    console.log(ex2())

    // 练习3
    let safeProp = fp.curry(function (x, o) {
        return Maybe.of(o[x])
    })
    let user = {
        id: 2,
        name: 'Albert'
    }
    let ex3 = () => safeProp('name', user).map(fp.first)._value
    console.log(ex3())

    // 练习4
    let ex4 = function (n) {
        if (n) {
            return parseInt(n)
        }
    }
    console.log(ex4('1'))
    console.log(ex4())
    let refactorEx4 = (n) => Maybe.of(n).map(parseInt)._value
    console.log(refactorEx4('1'))
    console.log(refactorEx4())
}

/** 第四题 见promise.js */

{
    let MyPromise = require('./promise')

    let promise = new MyPromise((resolve, reject) => {
        resolve('成功值')
        // reject('失败值')

        // setTimeout(() => {
        //     resolve('异步成功值')
        // }, 2000)
    })

    let other = () => {
        return new MyPromise((resolve, reject) => {
            resolve('other')
        })
    }
    let p1 = promise.then((value) => {
        console.log(value)
        return p1
    })
    p1.then((value) => {
        console.log(value)
    }, (reason) => {
        console.log(reason)
    })

    // promise.then((value) => {
    //     console.log('成功')
    //     console.log(value)
    // }, (reason) => {
    //     console.log('失败')
    //     console.log(reason)
    // })
    // promise.then((value) => {
    //     console.log('成功')
    //     console.log(value)
    // }, (reason) => {
    //     console.log('失败')
    //     console.log(reason)
    // })
    // promise.then((value) => {
    //     console.log('成功')
    //     console.log(value)
    // }, (reason) => {
    //     console.log('失败')
    //     console.log(reason)
    // })

}
