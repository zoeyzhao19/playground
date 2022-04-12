function mountElement(vnode, container) {
  // 使用vnode.tag作为标签名创建DOM元素
  const el = document.createElement(vnode.tag)
  // 遍历vnode.props, 将属性，事件添加到dom元素
  for (let key in vnode.props) {
    if (/^on/.test(key)) {
      // 如果key以on开头，说明它是事件
      el.addEventListener(key.substr(2).toLowerCase(), vnode.props[key])
    }
  }
  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  // 将元素添加到挂载点下
  container.appendChild(el)
}

function mountComponent(vnode, container) {
  // 调用组件函数 获取组件要渲染的内容
  const subtree = vnode.tag.render()
  renderer(subtree, container)
}

export default function renderer(vnode, container) {
  if (vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (vnode.tag === 'object') {
    mountComponent(vnode, container)
  }
}