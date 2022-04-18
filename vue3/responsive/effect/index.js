// 存取副作用函数的桶
const bucket = new WeakMap()
// 用一个全局变量存取副作用函数
let activeEffect;
const effectStack = []
// effect函数用于注册副作用函数
export function effect(fn, options ={}) {
  const effectFn = () => {
    // 调用cleanup完成清除工作
    cleanup(effectFn)
    activeEffect = effectFn
    // 在调用副作用函数时当当前副作用函数压入栈中
    effectStack.push(effectFn)
    // 将fn的结果存储到res中
    const res = fn()
    // 在当前副作用函数执行完毕后，将当前富足用函数弹出栈，并把activeEffect还原为之前的值
    effectStack.pop(effectFn)
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.deps = []
  effectFn.options = options
  if(!options.lazy) {
    effectFn()
  }
  return effectFn
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    // 将effectFn从依赖集合中删除
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// 在get拦截函数内调用track函数追踪变化
export function track(target, key) {
  if (!activeEffect) return
  // 根据target从桶里取得depsMap，它也是一个map类型 key ---> effects
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, depsMap = new Map())
  }
  // 再根据keys从depsMap中取得deps，它是一个set；类型
  let deps = depsMap.get(key)
  if(!deps) {
    depsMap.set(key, deps = new Set())
  }
  // 最后将当前激活的副作用函数添加到桶里
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}
// 在set拦截函数内调用trigger函数触发变化
export function trigger(target, key) {
  //根据target从桶中取得depsMap
  const depsMap = bucket.get(target)
  if(!depsMap) return
  // 根据key从桶中取得所有副作用函数
  const effects = depsMap.get(key)
  const effectsToRun = new Set() // 重新构造一个set并遍历，避免循环
  effects && effects.forEach(effectFn => {
    if (effectFn != activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun && effectsToRun.forEach(fn => {
    // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
    if(fn.options.scheduler) {
      fn.options.scheduler(fn)
    } else {
      fn()
    }
  })
}
