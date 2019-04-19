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

/**
 * 把数组转换成 树形结构
 * @param {*} data
 */
export const renderTree = (data) => {
  if (data.length === 0) return false
  const list = deepClone(data)
  const filterArray = (arr, parent) => {
    let tree = []
    let temp
    if (arr.length > 0) {
      arr.forEach(node => {
        if (node.parentId === parent) {
          let obj = node
          temp = filterArray(list, node.id)
          if (temp.length > 0) {
            obj.childrenMenuResources = temp
          }
          tree.push(obj)
        }
      })
    }
    return tree
  }
  return filterArray(list, '0')
}

/**
 * 把树形结构的所有最底层的子集合
 * @param {*} data
 */
export const platChildrenTree = (data) => {
  if (!data || data.length === 0) return false
  const list = deepClone(data)
  let temp = []
  const filterArray = (arr) => {
    if (arr.length > 0) {
      arr.forEach(node => {
        if (node.childrenMenuResources && node.childrenMenuResources.length > 0) {
          filterArray(node.childrenMenuResources)
        } else {
          const { childrenMenuResources, ...props } = node
          temp.push(props)
        }
      })
    }
  }
  filterArray(list)
  return temp
}

/**
 * 获取当前路由的完整层级路径，以数组返回
 *
 * @export
 * @param {*} path
 * @param {*} data
 * @returns
 */
export function getAllPath (val, data, key = 'id') {
  // 定义变量保存当前结果路径
  let temppath = []
  try {
    const getNodePath = (node) => {
      let { childrenMenuResources, ...item } = node
      temppath.push(item)

      // 找到符合条件的节点，通过throw终止掉递归
      if (node[key] === val) {
        let err = 'GOT IT!'
        throw err
      }
      if (childrenMenuResources && childrenMenuResources.length > 0) {
        for (let i = 0; i < childrenMenuResources.length; i++) {
          getNodePath(childrenMenuResources[i])
        }

        // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        temppath.pop()
      } else {
        // 找到叶子节点时，删除路径当中的该叶子节点
        temppath.pop()
      }
    }
    for (let i = 0; i < data.length; i++) {
      // temppath = []
      getNodePath(data[i])
    }
  } catch (e) {
    return temppath
  }
}
