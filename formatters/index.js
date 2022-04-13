window.devtoolsFormatters = [{
  header: function(obj) {
    if (!obj.__clown) {
      return null;
    }
    delete obj.__clown;
    const style = `
      color: red;
      border: dotted 2px gray;
      border-radius: 4px;
      padding: 5px;
    `
    const content = `😁${JSON.stringify(obj, null, 2)}`
    try {
      return ['div', {style}, content]
    } catch (err) {
      return null
    }
  },
  hasBody: function() {
    return false
  }
}]
console.clown = function (obj) {
  console.log({...obj, __clown: true})
}
console.log({message: 'hello'});
console.clown({message: 'hello'});