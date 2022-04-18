function fnc () {
  let i = 0
  const start = performance.now()
  while (performance.now() - start <= 5000) {
      i++
  }

  return i
}

setTimeout(() => {
  console.log('开始')
  start = performance.now()
  const b = fnc()
  console.log('结束', `${(performance.now() - start)/ 1000}s`)
  console.log(b)
}, 1000)