const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'


class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    static all (array) {
        let result = []
        let index = 0

        return new MyPromise((resolve, reject) => {
            function addData (key, value) {
                result[key] = value
                index++
                if (index === array.length) {
                    resolve(result)
                }
            }

            for (let i = 0; i < array.length; i++) {
                let current = array[i]
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), (error) => {
                        reject(error)
                    })
                } else {
                    // 是普通值
                    addData(i, array[i])
                }
            }
        })
    }

    static resolve (value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }


    // 状态属性
    status = PENDING
    // 成功的值
    value = undefined
    // 失败原因
    reason = undefined
    successCallback = []
    failCallback = []

    resolve = (value) => {
        // 如果状态不是等待，阻止状态向下执行
        if (this.status !== PENDING) return
        this.status = FULFILLED

        // 保存成功之后的值，因为要在then中拿到
        this.value = value

        // 判断成功的回调是否存在
        while (this.successCallback.length) this.successCallback.shift()()
    }

    reject = (reason) => {
        if (this.status !== PENDING) return
        this.status = REJECTED

        // 保存失败原因
        this.reason = reason

        // 判断成功的回调是否存在
        while (this.failCallback.length) this.failCallback.shift()()
    }

    then(successCallback, failCallback) {
        successCallback = successCallback ? successCallback : v => v
        failCallback = failCallback ? failCallback : v => { throw v }

        let promise2 = new MyPromise((resolve, reject) => {
            // 判断状态
            if (this.status === FULFILLED) {
                // 判断x是普通值还是promise
                // 如果是普通值 直接调用resolve
                // 如果是promise, 查看promise的返回结果。根据结果，决定resolve 还是 reject
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                // 等待中
                // 将成功回调和失败回调存起来
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise2
    }

}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环调用'))
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

module.exports = MyPromise
