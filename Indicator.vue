<template>
<transition name="lemon-indicator">
  <div class="lemon-indicator" v-show="visible" @touchmove.stop.prevent>
    <div class="lemon-indicator-mask"></div>
    <div class="lemon-indicator-wrapper" :style="{ 'padding': text ? '20px' : '15px'}">
        <div class="lemon-indicator-spin" v-show="!isFail"></div>
        <div class="lemon-indicator-wrong" v-show="isFail">!</div>
      <div class="lemon-indicator-text" v-show="text">{{ text }}</div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'lemon-indicator',
  data() {
    return {
      visible: false,
      text: '',
      isFail: false,
      failText: '',
    };
  },
  methods: {
    open(loadingMsg = '') {
      this.isFail = false;
      this.text = typeof loadingMsg === 'string' ? loadingMsg : '';
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    fail(failMsg = 'connection timeout', delay = 1500) {
      this.isFail = true;
      this.failText = typeof failMsg === 'string' ? failMsg : 'connection timeout';
      this.text = this.failText;
      setTimeout(() => {
        this.close();
      }, delay);
    },
  },
};
</script>

<style>
.lemon-indicator {
  transition: opacity .2s;
}
.lemon-indicator-enter,
.lemon-indicator-leave-to {
  opacity: 0;
}

.lemon-indicator-mask {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: transparent;
}

.lemon-indicator-wrapper {
  position: fixed;
  box-sizing: border-box;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
}

.lemon-indicator-wrapper::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  border-radius: 5px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  opacity: .7;
}

.lemon-indicator-icon-enter,
.lemon-indicator-icon-leave-to {
  opacity: 0;
}

.lemon-indicator-spin {
  transition: opacity .2s;
  border-radius: 50%;
  position: relative;
  margin: auto;
  width: 24px;
  height: 24px;
  border: 4px solid #fff;
  border-bottom-color: transparent;
  animation: lemon-spin 1s infinite linear both;
}
@keyframes lemon-spin{
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.lemon-indicator-wrong {
  transition: opacity .2s;
  width: 100%;
  height: 50px;
  font-size: 60px;
  color: #fff;
  text-align: center;
  line-height: 50px;
  position: relative;
}

.lemon-indicator-text {
  position: relative;
  display: block;
  text-align: center;
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: -10px;
}
</style>
