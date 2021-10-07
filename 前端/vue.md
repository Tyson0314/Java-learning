<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [基础](#%E5%9F%BA%E7%A1%80)
  - [v-modal](#v-modal)
  - [computed和method](#computed%E5%92%8Cmethod)
- [组件](#%E7%BB%84%E4%BB%B6)
- [深入组件](#%E6%B7%B1%E5%85%A5%E7%BB%84%E4%BB%B6)
  - [prop](#prop)
- [vue-router](#vue-router)
  - [动态匹配](#%E5%8A%A8%E6%80%81%E5%8C%B9%E9%85%8D)
  - [导航](#%E5%AF%BC%E8%88%AA)
  - [命名路由](#%E5%91%BD%E5%90%8D%E8%B7%AF%E7%94%B1)
  - [命名视图](#%E5%91%BD%E5%90%8D%E8%A7%86%E5%9B%BE)
  - [嵌套命名视图](#%E5%B5%8C%E5%A5%97%E5%91%BD%E5%90%8D%E8%A7%86%E5%9B%BE)
  - [重定向](#%E9%87%8D%E5%AE%9A%E5%90%91)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 基础

### v-modal

```vue
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

等价于：

```vue
<input
  v-bind:value="message"
  v-on:input="message = $event.target.value"
>
```

在组件上使用：

```vue
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

<custom-input v-model="searchText"></custom-input>
```



### computed和method

```vue
<div id="app">
  <p>message：${ message }</p>
  <p>now (computed)：${ now }</p>
  <p>getNow (method)：${ getNow() }</p>
</div>

var vm = new Vue({
  el: '#app',
  delimiters: ['${', '}'],
  data: {
    message: 'Hello World!',
  },
  computed: {
    now: function() {
      return Date.now();
    },
  },
  methods: {
    getNow: function() {
      return Date.now();
    },
  },
});

//改变了message，computed才会更新，即computed依赖于属性
//getNow()方法每次调用都会更新
vm.message = '999';
```





## 组件

```vue
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

<div id="components-demo">
  <button-counter></button-counter>
</div>

new Vue({ el: '#components-demo' })
```

data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。

通过 Prop 向子组件传递数据，一个组件默认可以拥有任意数量的 prop。

```vue
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})

<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Blogging with Vue"></blog-post>
<blog-post title="Why Vue is so fun"></blog-post>
```

使用有约束条件的元素，table 内部只能有 tr：

```vue
<table>
  <blog-post-row></blog-post-row>
</table>
```

这个自定义组件 `` 会被作为无效的内容提升到外部，并导致最终渲染结果出错。幸好这个特殊的 `is` attribute 给了我们一个变通的办法：

```vue
<table>
  <tr is="blog-post-row"></tr>
</table>
```



## 深入组件

全局注册，注册之后可以用在任何新创建的 Vue 根实例 (`new Vue`) 的模板中：

```vue
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
---------------------
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

局部注册：

```vue
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }

new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

局部注册的组件在其子组件中不可用，如果要在 ComponentB 使用ComponentA，则应该这样写：

```vue
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}

//过 Babel 和 webpack 使用 ES2015 模块
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

### prop

使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名：

```vue
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})

<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
```

给 props 传入静态值：

```vue
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}

<blog-post title="My journey with Vue"></blog-post>
```

可以通过 `v-bind` 动态赋值：

```vue
<!-- 动态赋予一个变量的值 -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- 动态赋予一个复杂表达式的值 -->
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>
```





## vue-router

### 动态匹配

```vue
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: '/user/:id', component: User }
  ]
})
```

/user/tyson 和 /user/tom 都会映射到同一个组件。路由匹配之后，每次组件都可以获取到 `this.$route.params`。

```vue
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

在一个路由中设置多段“路径参数”，对应的值都会设置到 `$route.params` 中。

| pattern                       | matched path        | $route.params                          |
| ----------------------------- | ------------------- | -------------------------------------- |
| /user/:username               | /user/evan          | `{ username: 'evan' }`                 |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

### 导航

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

 history 记录中向前或者后退多少步：

```vue
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```

### 命名路由

有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。

```vue
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

要链接到一个命名路由，可以给 `router-link` 的 `to` 属性传一个对象：

```vue
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

等同于：

```vue
router.push({ name: 'user', params: { userId: 123 }})
```

### 命名视图

有时候想同时 (同级) 展示多个视图，可以使用命名视图。

```vue
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

如果 `router-view` 没有设置名字，那么默认为 `default`。

多个视图需要使用多个组件渲染，使用 components 配置：

```vue
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

### 嵌套命名视图

https://jsfiddle.net/posva/22wgksa3/

### 重定向

重定向也是通过 `routes` 配置来完成。

```vue
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})

const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }} //重定向目标可以是命名路由
  ]
})
```

别名：

```vue
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' } //访问路径是/b，路由匹配为/a
  ]
})
```