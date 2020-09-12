console.log(1)
setTimeout(() => {
    queueMicrotask(() => {
        console.log(2)
        queueMicrotask(() => {
            console.log('2-1')
        })
    })
}, 100)
setTimeout(() => {
    queueMicrotask(() => {
        console.log(3)
        queueMicrotask(() => {
            console.log('3-1')
        })
    })
}, 200)
console.log(4)

// call stack
// 清空微任务 如果微任务中又添加微任务，也会被清空，不用等下一轮
// 渲染（渲染线程）
// 从宏任务队列中取一个任务，进入下一个消息循环   （宏任务是一个一个取的）


