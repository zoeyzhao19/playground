import { computed } from './computed/index.js'
import { watch } from './watch/index.js'
import { track, trigger } from './effect/index.js'

const data = { foo: 1, bar: 2 }
// 对原始数据的代理
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
    return true
  }
})

// const sumRes = computed(() => obj.foo + obj.bar)

// console.log(sumRes.value)
// console.log(sumRes.value)
// obj.foo++
// console.log(sumRes.value)
watch(
  () => obj.foo,
  () => {
    console.log('obj.foo改变了')
  }
)
obj.foo = 2