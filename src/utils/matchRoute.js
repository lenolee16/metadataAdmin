export const hasChildren = (routes) => {
  return routes.some(item => item.inMenu)
}
