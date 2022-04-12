const MyComponent = function() {
  return {
    tag: 'div',
    props: {
      onclick: () => alert('hello')
    },
    children: 'click me'
  }
}

const vnode = {
  tag: MyComponent
}