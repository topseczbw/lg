/** 代码题 */

// const list = []
//
// const listProxy = new Proxy(list, {
//     set(target, property, value) {
//         console.log('set', property, value)
//         target[property] = value
//         return true
//     }
// })
//
//
// listProxy.push(1)
// listProxy.push(2)
//
// console.log(list)
var a = 10;
var obj = {
    a: 20,

    fn1() {
        setTimeout(function() {
            console.log(this.a);
        });
    },

    fn2() {
        setTimeout(() => {
            console.log(this.a);
        });
    },
    fn3: () => {
        console.log(this.a);
    }
};
//
// obj.fn1()
// obj.fn2()
// obj.fn3()

// const s1 = Symbol('a')
// const s2 = Symbol('a')

const s1 = Symbol.for('a');
const s2 = Symbol.for('a');
// Const obj = {
//     s1: 'a1',
// }
console.log(s1 === s2);

/** 深拷贝 */
{
    function cloneDeep(obj, hash = new WeakMap()) {
        if (obj === null) return null;

        if (obj instanceof RegExp) return new RegExp(obj);
        if (obj instanceof Date) return new Date(obj);

        if (typeof obj !== 'object') return obj;

        if (hash.has(obj)) return hash.get(obj);

        const result = new obj.constructor();

        hash.set(obj, result);

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = cloneDeep(obj[key], hash);
            }
        }

        return result;
    }
}
