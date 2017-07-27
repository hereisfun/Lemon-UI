import './Indicator.css';

let instance;

function createDOM(innerHTML) {
  const shell = document.createElement('div');
  shell.innerHTML = innerHTML;
  return shell.children[0];
}

function init(text) {
  instance = createDOM(`
  <div class="lemon-indicator">
    <div class="lemon-indicator-mask"></div>
    <div class="lemon-indicator-wrapper" style="padding: ${text ? '20px' : '15px'};">
        <div class="lemon-indicator-spin"></div>
        <div class="lemon-indicator-wrong" style="display: none;">!</div>
      <div class="lemon-indicator-text" style="display: ${text ? 'block' : 'none'};">${text}</div>
    </div>
  </div>
  `);
  instance.mask = instance.querySelectorAll('.lemon-indicator-mask')[0];
  instance.spin = instance.querySelectorAll('.lemon-indicator-spin')[0];
  instance.wrong = instance.querySelectorAll('.lemon-indicator-wrong')[0];
  instance.text = instance.querySelectorAll('.lemon-indicator-text')[0];
  instance.addEventListener('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  document.body.appendChild(instance);
}

export default {
  open(msg) {
    if (!instance) {
      init(msg);
    } else {
      instance.text.textContent = msg;
      instance.text.style.display = 'block';
      instance.wrong.style.display = 'none';
      instance.mask.style.display = 'block';
      instance.spin.style.display = 'block';
      instance.style.opacity = '1';
    }
  },

  close() {
    if (!instance) return;
    instance.style.opacity = '0';
    instance.mask.style.display = 'none';
  },

  fail(msg = 'connection timeout', delay = 1500) {
    if (!instance) return;
    instance.spin.style.display = 'none';
    instance.wrong.style.display = 'block';
    instance.text.textContent = msg;
    instance.text.style.display = 'block';
    setTimeout(() => {
      instance.style.opacity = '0';
      instance.mask.style.display = 'none';
    }, delay);
  },
};
