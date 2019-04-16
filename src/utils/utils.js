/**
 * 深拷贝
 *
 * @export
 * @param {*} source
 * @returns
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 防抖
 *
 * @export
 * @param {*} func
 * @param {*} wait
 * @returns
 */
export const debounce = (fn, time) => {
  let last = null
  const that = this
  return function (...args) {
    if (last) {
      clearTimeout(last)
    }
    last = setTimeout(() => {
      fn.apply(that, args)
    }, time)
  }
}
