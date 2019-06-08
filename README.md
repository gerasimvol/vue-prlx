# vue-prlx

[![npm](https://img.shields.io/npm/v/vue-prlx.svg)](vue-prlx) ![npm](https://img.shields.io/npm/dt/vue-prlx.svg)

## [Demo and docs](vue-prlx.surge.sh)

### Initialization

#### ES2015 (Webpack/Rollup/Browserify/etc)

```javascript
import Vue from 'vue'

// As a plugin
import VuePrlx from 'vue-prlx'
Vue.use(VuePrlx);

// Or as a directive
import { VuePrlxDirective } from 'vue-prlx'
Vue.directive('prlx', VuePrlxDirective);
```

#### UMD (Browser)

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-prlx/dist/v-prlx.min.js"></script>
<script>
// As a plugin
Vue.use(VuePrlx.VuePrlxPlugin);

// Or as a directive
Vue.directive('prlx', VuePrlx.VuePrlxDirective);
</script>
```
