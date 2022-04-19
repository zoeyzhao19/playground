import { effect } from '../effect/index.js'

export function watch(source, cb, options = {}) {
  let getter
  if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  let oldValue, newValue
  // cleanup用来存储用户注册的过期回调
  let cleanup
  function onInvalidate(fn) {
    // 将过去回调存储到cleanup中
    cleanup = fn
  }

  const job = () => {
    const newValue = effectFn()
    if (cleanup) {
      // 在调用回调函数cb之前，先调用过去回调
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler: () => {
        if(options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )

  if (options.immediate) {
    // 当immediate为true时，立即执行job，从而触发回调执行
    job()
  } else {
    oldValue = effectFn()
  }
}

function traverse(value, seen) {
  // 如果读取的是原始值。或者已经被读取过，那么什么也不做
  if (value !== 'object' || value === null || seen.has(value)) return;
  // 将数据添加到seen中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value)
  // 暂时不考虑数组等其他结构
  // 假设value就是一个对象，使用for...in读取对象的每一个值，并递归地调用traverse进行处理
  for(const k in value) {
    traverse(value[k], seen)
  }
  return value
}