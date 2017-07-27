# Lemon UI
Lemon UI is a personal collection of mobile UI components. Mostly inspired by other libs like Mint-UI, with personal optimization.

## Demo
[coming soon]()

## Components and Usage

### Loadmore.vue
> pull down to refresh, pull up to load more.


### Example
```html
<template>
  <div class="wrapper">
    <loadmore
      :topMethod="refresh"
      :bottomMethod="loadmore"
      :bottomAllLoaded="allLoadedFlag"
      ref="loadmoreComponent"
      >
    <ul>
      <li v-for="item in items">{{ item }}</li>
    </ul>
  </loadmore>
  </div>
</template>

<script>
import loadmore from './Loadmore.vue';

export default {
  component: {
    loadmore,
  },
  ...
}
</script>
```

Notice that the `wrapper` div is use to divide the scroll area, with `overflow: auto;`

one more thing, remember to call the `onTopLoaded` method of the loadmore component, in order to remove the topLoadingText:
```js
loadMore() {
    fetchdata()
      .then(() => {
        this.$refs.loadmoreComponent.onTopLoaded();
      })
      .catch(this.$refs.loadmoreComponent.onTopLoaded());
}
```
call the `onBottomLoaded` when `bottomMehod` is finish.
 
|props|description|type|default|
|---|---|---|---|
|autoFill|if true and bottomMethod exist, Loadmore will try to fill the container|Boolean|true| 
|topMethod|function for pull down|Function||
|bottomMethod|function for pull up|Function||
|topPullText|top text when component is pulled down|String||
|topLoadingText|top text when topMethod is running|String|'loading...'|
|topDropText|top text when topMethod is ready to run|String||
|bottomPullText|similar to topPullText|String||
|bottomLoadingText|similar to topPullText|String|'loading...'|
|bottomDropText|similar to topPullText|String||
|topDropDistance|distance(in pixel) to active topMethod|Number|70|
|bottomDropDistance|distance(in pixel) to active bottomMethod|Number|70|
|bottomAllLoaded|if true, bottomMethod will not trigger|Boolean|false|
|distanceIndex|the ratio between the distance of the finger moves|Number|2|

## Indicator.vue
> pop out a layer with spinner/error message, prevent **multi-click** & **scroll** while loading. 

```js
import indicatorComps from './path/to/indicator.vue';
Vue.prototype.$indicator = new Vue(indicatorComps).$mount();
const indicator = Vue.prototype.$indicator;
document.body.appendChild(indicator.$el);

// in component
this.$indicator.open(loadingMsg);
this.$indicator.close();
this.$indicator.fail(failMsg);
```

`open([loadingMsg])`

- loadingMsg: text displayed below the spinner

`open` method will pop out a layer with a spinner, prevent any action on screen, including **touch** and **scroll**.

`close()`

`close` method will close the opened indicator.

`fail([failMsg][,delay])`

`fail` method will show the fail reason and close the indicator after `delay` ms.

- failMsg: text to explain the error reason, default value is `connection timeout`

- delay: the failMsg will display `delay` ms before close, default value is `1500`

## Indicator.js + Indicator.css
Indicator component with pure javascript and css only, use with webpack(for css injection).

Example:
```js
import mask from './path/to/indicator.js';
// the rest is same as .vue version
```

Q: why dont use a single `.js` file, using `stylesheet.insertRule(rule, index)` to inject css?

A: 1. webpack is widely used in front-end project. 2. For simple project, you can just copy the css rules into your css file. 3. Get all the things done in a singel `.js` file is unnecessary, leave the style part for `.css`.
