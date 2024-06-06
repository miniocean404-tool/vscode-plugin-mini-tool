const handleRemoveRepeat = (arr) => arr.filter((item, index) => arr.indexOf(item, 0) === index)

const a = [{ a: "height" }, { b: "weight" }, { c: "www" }, { a: "height" }]

console.log(handleRemoveRepeat(a))
