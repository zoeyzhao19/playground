
function * fnc_ () {
  let i = 0
    const start = performance.now()
    while (performance.now() - start <= 5000) {
        yield i++
    }

    return i
}

function timeSlicing(fnc, cb = setTimeout) {
  if(fnc.constructor.name !== 'GeneratorFunction') return fnc()
  return async function (...args) {
    const fnc_ = fnc(...args)
    let data
    do {
      data = fnc_.next()
      // 每执行一步就休眠，注册一个宏任务setTimeout来叫醒它
      await new Promise(resolve => cb(resolve))
    } while(!data.done)

    return data.value
  }
}

// 精准时间分片
function timeSlicing2(fnc, time = 25, cb = setTimeout) {
  if(fnc.constructor.name !== 'GeneratorFunction') return fnc()
  return async function (...args) {
    const fnc_ = fnc(...args)
    let data
    return new Promise(async function go(resolve, reject) {
      try {
        const start = performance.now()
        do {
          data = fnc_.next()
        } while (!data.done && performance.now() - start < time)

        if (data.done) return resolve(data.value)

        cb(() => go(resolve, reject))
      } catch (e) {
        reject(e)
      }
    })
  }
}

setTimeout(async () => {
  // const fnc = timeSlicing(fnc_)
  const fnc1 = timeSlicing2(fnc_)
  // let start = performance.now()

  // console.log('开始')
  // const a = await fnc()
  // console.log('结束', `${(performance.now() - start)/ 1000}s`)

  console.log('开始')
  start = performance.now()
  const b = await fnc1()
  console.log('结束', `${(performance.now() - start)/ 1000}s`)

  // console.log(a)
  console.log(b)
}, 1000);