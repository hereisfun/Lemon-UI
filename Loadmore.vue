<template>
  <div class="lemon-loadmore">
    <div class="lemon-loadmore-content" :class="{'dropped': topDropped || bottomDropped}" :style="{ 'transform': `translate3d(0, ${translate}px, 0)`}">
      <slot name="top">
        <div class="lemon-loadmore-top" v-if="topMethod">
          <span class="lemon-loadmore-loading" v-show="topStatus === 'loading'"></span>
          <span class="lemon-arrow" :class="{ 'lemon-rotate': topStatus === 'drop'}" v-show="topStatus !== 'loading'">↓</span>
          <span class="lemon-loadmore-text">{{ topText }}</span>
        </div>
      </slot>
      <slot></slot>
      <slot name="bottom">
        <div class="lemon-loadmore-bottom" v-if="bottomMethod">
          <span class="lemon-loadmore-loading" v-show="bottomStatus === 'loading'"></span>
          <span class="lemon-arrow" :class="{ 'lemon-rotate': bottomStatus === 'drop'}" v-show="bottomStatus !== 'loading'">↑</span>
          <span class="lemon-loadmore-text">{{ bottomText }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lemon-loadmore',
  props: {
    autoFill: {
      type: Boolean,
      default: true,
    },
    topMethod: {
      type: Function,
    },
    bottomMethod: {
      type: Function,
    },
    topPullText: {
      type: String,
      default: '',
    },
    topLoadingText: {
      type: String,
      default: 'loading...',
    },
    topDropText: {
      type: String,
      default: '',
    },
    bottomPullText: {
      type: String,
      default: '',
    },
    bottomLoadingText: {
      type: String,
      default: 'loading...',
    },
    bottomDropText: {
      type: String,
      default: '',
    },
    topDropDistance: {
      type: Number,
      default: 70,
    },
    bottomDropDistance: {
      type: Number,
      default: 70,
    },
    bottomAllLoaded: {
      type: Boolean,
      default: false,
    },
    distanceIndex: {
      type: Number,
      default: 2,
    },
  },
  watch: {
    topStatus(status) {      
      switch (status) {
        case 'pull':
          this.topText = this.topPullText;
          break;
        case 'loading':
          this.topText = this.topLoadingText;
          break;
        case 'drop':
          this.topText = this.topDropText;
          break;
        default:
          this.topText = this.topPullText;
          break;
      }
    },
    bottomStatus(status) {      
      switch (status) {
        case 'pull':
          this.bottomText = this.bottomPullText;
          break;
        case 'loading':
          this.bottomText = this.bottomLoadingText;
          break;
        case 'drop':
          this.bottomText = this.bottomDropText;
          break;
        default:
          this.bottomText = this.bottomDropText;
          break;
      }
    },
  },
  data() {
    return {
      scrollTarget: null,
      topStatus: '',
      bottomStatus: '',
      topText: '',
      bottomText: '',
      topDropped: false,
      bottomDropped: false,
      translate: 0,
      direction: '',
      bottomReached: false,
      containerFilled: false,
      startScrollTop: 0,
      startY: 0,
      currentY: 0,
    };
  },
  methods: {
    onTopLoaded() {
      this.translate = 0;
      setTimeout(() => {
        this.topStatus = 'pull';
      }, 200);
      this.checkContainerFilled();
      if (!this.bottomAllLoaded && !this.containerFilled) {
        this.fillContainer();
      }
    },

    onBottomLoaded() {
      this.bottomStatus = 'pull';
      this.bottomDropped = false;
      this.$nextTick(() => {
        if (!this.isAutoFill) {
          if (this.scrollTarget === window && this.isAutoFill) {
            document.body.scrollTop += 50;
          } else {
            this.scrollTarget.scrollTop += 50;
          }
        }
        this.isAutoFill = false;
        this.translate = 0;
      });
      if (!this.bottomAllLoaded && !this.containerFilled) {
        this.fillContainer();
      }
    },

    getScrollTarget(node) {
      // get the wrapper element
      let currentNode = node;
      while (currentNode && currentNode.tagName !== 'BODY' && currentNode.tagName !== 'HTML' && currentNode.nodeType === 1) {
        const overflowY = window.getComputedStyle(currentNode).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      return window;
    },

    getScrollTop(element) {
      if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
      }
      return element.scrollTop;
    },

    bindTouchEvents() {
      this.$el.addEventListener('touchstart', this.handleTouchStart);
      this.$el.addEventListener('touchmove', this.handleTouchMove);
      this.$el.addEventListener('touchend', this.handleTouchEnd);
    },

    unbindTouchEvents() {
      this.$el.removeEventListener('touchstart', this.handleTouchStart);
      this.$el.removeEventListener('touchmove', this.handleTouchMove);
      this.$el.removeEventListener('touchend', this.handleTouchEnd);
    },

    checkContainerFilled() {
      if (this.scrollTarget === window) {
        this.containerFilled = this.$el.getBoundingClientRect().bottom >=
          document.documentElement.getBoundingClientRect().bottom;
      } else {
        this.containerFilled = this.$el.getBoundingClientRect().bottom >=
          this.scrollTarget.getBoundingClientRect().bottom;
      }
    },

    checkBottomReached() {
      const listBottom = this.$el.getBoundingClientRect().bottom;
      const containerBottom = this.scrollTarget.getBoundingClientRect().bottom;
      return listBottom <= containerBottom + 20;
    },

    fillContainer() {
      if (this.autoFill) {
        this.$el.scrollTop = 0;
        this.$nextTick(() => {
          this.checkContainerFilled();
          if (!this.containerFilled && this.bottomMethod && !this.bottomAllLoaded) {
            this.isAutoFill = true;
            this.bottomStatus = 'loading';
            this.bottomMethod();
          }
        });
      }
    },

    init() {
      this.scrollTarget = this.getScrollTarget(this.$el);
      this.topStatus = 'pull';
      this.bottomStatus = 'pull';
      this.topText = this.topPullText;
      if (this.topMethod || this.bottomMethod) {
        this.bindTouchEvents();
      }
      if (this.autoFill && this.bottomMethod) this.fillContainer();
    },

    handleTouchStart(e) {
      this.startY = e.touches[0].clientY;
      this.startScrollTop = this.getScrollTop(this.scrollTarget);
      this.bottomReached = false;
      if (this.topStatus !== 'loading') {
        this.topStatus = 'pull';
        this.topDropped = false;
      }
      if (this.bottomStatus !== 'loading') {
        this.bottomStatus = 'pull';
        this.bottomDropped = false;
      }
    },

    handleTouchMove(e) {      
      const rect = this.$el.getBoundingClientRect();
      if (this.startY < rect.top || this.startY > rect.bottom) {
        console.log(this.startY);
        console.log(this.rect.top);
        console.log(this.rect.bottom);
        return;
      }

      this.currentY = e.touches[0].clientY;
      const distance = (this.currentY - this.startY) / this.distanceIndex;
      this.direction = distance > 0 ? 'down' : 'up';

      // for downwards
      if (this.direction === 'down'
        && this.topMethod
        && this.getScrollTop(this.scrollTarget) === 0
        && this.topStatus !== 'loading') {
        event.preventDefault();
        event.stopPropagation();
        if (this.maxDistance > 0) {
          this.translate = distance <= this.maxDistance ? distance - this.startScrollTop : this.translate;
        } else {
          this.translate = distance - this.startScrollTop;
        }
        this.translate = this.translate < 0 ? 0 : this.translate;
        this.topStatus = this.translate > this.topDropDistance ? 'drop' : 'pull';
      }

      // for upwards
      if (this.direction === 'up') {
        this.bottomReached = this.bottomReached || this.checkBottomReached();
      }
      if (this.direction === 'up'
        && this.bottomMethod
        && this.bottomReached
        && !this.bottomAllLoaded
        && this.bottomStatus !== 'loading') {
        event.preventDefault();
        event.stopPropagation();
        if (this.maxDistance > 0) {
          this.translate = Math.abs(distance) <= this.maxDistance
            ? (this.getScrollTop(this.scrollTarget) - this.startScrollTop) + distance : this.translate;
        } else {
          this.translate = (this.getScrollTop(this.scrollTarget) - this.startScrollTop) + distance;
        }
        this.translate = this.translate > 0 ? 0 : this.translate;
        this.bottomStatus = (-this.translate) >= this.bottomDropDistance ? 'drop' : 'pull';
      }

      // emit if necessary
      // this.$emit('translate-change', this.translate);
    },

    handleTouchEnd() {
      if (this.direction === 'down'
        && this.getScrollTop(this.scrollTarget) === 0
        && this.translate > 0) {
        this.topDropped = true;
        if (this.topStatus === 'drop') {
          this.translate = '50';
          this.topStatus = 'loading';
          this.topMethod();
        } else {
          this.translate = '0';
          this.topStatus = 'pull';
        }
      }
      if (this.direction === 'up' && this.bottomReached && this.translate < 0) {
        this.bottomDropped = true;
        this.bottomReached = false;
        if (this.bottomStatus === 'drop') {
          this.translate = '-50';
          this.bottomStatus = 'loading';
          this.bottomMethod();
        } else {
          this.translate = '0';
          this.bottomStatus = 'pull';
        }
      }
      this.direction = '';
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.unbindTouchEvents();
  },
};
</script>

<style>
.lemon-loadmore {
  overflow: hidden;
}

.lemon-arrow {
  display: inline-block;
  transition: transform .3s;
  transform: rotate(0);
  vertical-align: middle;
}

.lemon-rotate {
  transform: rotate(180deg);
}

@keyframes rotate {
  to {
    transform: rotate(180deg);
  }
}

@-webkit-keyframes rotate {
  to {
    transform: rotate(180deg);
  }
}

.lemon-loadmore-top,
.lemon-loadmore-bottom {
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.lemon-loadmore-top {
  margin-top: -50px;
}

.lemon-loadmore-bottom {
  margin-bottom: -50px;
}

.lemon-loadmore-text {
  vertical-align: middle;
}

.lemon-loadmore-content.dropped {
  -webkit-transition: transform .2s;
  transition: transform .2s;
}
</style>
