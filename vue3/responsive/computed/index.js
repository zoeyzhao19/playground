import { effect, track, trigger } from '../effect/index.js'

export function computed(getter) {
  // 用来缓存上一次计算的值
  let value
  // dirty标识，用来标识是否需要重新计算值，为true则意味着脏，需要计算
  let dirty = true
  // 把getter作为副作用函数，创建一个lazy的effect
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = false
      trigger(obj, 'value')
    }
  })
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 当读取value的时候，手动调用track函数进行追踪
      track(obj, 'value')
      return value
    }
  }
  return obj
}
