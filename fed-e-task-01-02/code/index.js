/** 代码题 */

const list = []

const listProxy = new Proxy(list, {
    set(target, property, value) {
        console.log('set', property, value)
        target[property] = value
        return true
    }
})


listProxy.push(1)
listProxy.push(2)

console.log(list)
