
import { effect } from './effect.js'

// 调度
// 定义一个任务队列
const jobQueue = new Set()
// 使用Promise.resolve()创建一个promise实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve()
// 一个标识代表是否正在刷新队列
let isFlushing = false
function flushJob() {
  // 如果队列正在刷新，则什么也不做
  if(isFlushing) return;
  isFlushing = true
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    isFlushing = false
  })
}

// 原始数据
// const data = { foo: 0 }
// // 对原始数据的代理
// const obj = new Proxy(data, {
//   get(target, key) {
//     track(target, key)
//     return target[key]
//   },
//   set(target, key, newVal) {
//     target[key] = newVal
//     trigger(target, key)
//   }
// })

// effect(function() {
//   console.log('刷新了', obj.foo)
// }, {
//   scheduler(fn) {
//     // 每次调度时，将副作用函数添加到jobQueue队列中
//     jobQueue.add(fn)
//     // 调用flushJob刷新队列
//     flushJob()
//   },
//   lazy: true
// })

// obj.foo++
// obj.foo++