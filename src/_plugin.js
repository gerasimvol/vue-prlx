import directive from './_directive'

/**
 * Vue plugin definition
 * @param {Vue} Vue
 */
export default (Vue) => {
  Vue.directive('prlx', directive)
}