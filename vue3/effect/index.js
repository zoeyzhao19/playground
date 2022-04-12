// 存取副作用函数的桶
const bucket = new WeakMap()
// 用一个全局变量存取副作用函数
let activeEffect;
// effect函数用于注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
}
// 原始数据
const data = { text: 'hello world' }
// 对原始数据的代理
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
  }
})

// 在get拦截函数内调用track函数追踪变化
function track(target, key) {
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
}
// 在set拦截函数内调用trigger函数触发变化
function trigger(target, key) {
  //根据target从桶中取得depsMap
  const depsMap = bucket.get(target)
  if(!depsMap) return
  // 根据key从桶中取得所有副作用函数
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}

effect(() => document.body.innerText = obj.text)