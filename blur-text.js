/**
 * ASK SOLUTIONS - BlurText Interactive Component
 * Vanilla JavaScript implementation inspired by @react-bits/BlurText
 *
 * Implements staggered blur & spring entrance motion with IntersectionObserver,
 * direction control ('top' | 'bottom'), word or letter splitting,
 * and completion callbacks.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BlurText = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const defaultOptions = {
    text: '',
    delay: 200, // delay between words/letters in ms
    animateBy: 'words', // 'words' | 'letters'
    direction: 'top', // 'top' | 'bottom'
    threshold: 0.1,
    rootMargin: '0px',
    stepDuration: 0.35, // duration per step in seconds
    onAnimationComplete: () => {
      console.log('Animation completed!');
    }
  };

  /**
   * Initialize BlurText on a single element
   * @param {HTMLElement|string} target
   * @param {Object} options
   */
  function createBlurText(target, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;

    // Merge options from defaults, dataset attributes, and explicit options
    const config = Object.assign({}, defaultOptions);
    if (el.dataset.text) config.text = el.dataset.text;
    if (el.dataset.delay) config.delay = parseInt(el.dataset.delay, 10);
    if (el.dataset.animateBy) config.animateBy = el.dataset.animateBy;
    if (el.dataset.direction) config.direction = el.dataset.direction;
    if (el.dataset.threshold) config.threshold = parseFloat(el.dataset.threshold);
    if (el.dataset.rootMargin) config.rootMargin = el.dataset.rootMargin;
    if (el.dataset.stepDuration) config.stepDuration = parseFloat(el.dataset.stepDuration);
    Object.assign(config, options);

    config.delay = typeof config.delay === 'number' && !isNaN(config.delay) ? config.delay : 200;
    config.stepDuration = typeof config.stepDuration === 'number' && !isNaN(config.stepDuration) ? config.stepDuration : 0.35;

    const delaySec = config.delay / 1000;
    const totalDuration = config.stepDuration * 2; // 2 steps in toSnapshots

    el.classList.add('blur-text');
    if (config.direction === 'bottom') {
      el.classList.add('direction-bottom');
      el.dataset.direction = 'bottom';
    } else {
      el.dataset.direction = 'top';
    }

    el.style.setProperty('--blur-delay', `${delaySec}s`);
    el.style.setProperty('--blur-duration', `${totalDuration}s`);
    el.style.setProperty('--blur-from-y', config.direction === 'bottom' ? '50px' : '-50px');
    el.style.setProperty('--blur-from-amount', '10px');

    let elements = [];
    let wordIndex = 0;

    // If explicit text string was provided or el has data-text attribute
    if (config.text) {
      el.innerHTML = '';
      const items = config.animateBy === 'words' ? config.text.split(' ') : config.text.split('');
      const fragment = document.createDocumentFragment();

      items.forEach((item, index) => {
        const span = document.createElement('span');
        span.className = 'blur-text-element blur-text-word';
        span.style.setProperty('--index', index);
        span.textContent = item === ' ' ? '\u00A0' : item;
        fragment.appendChild(span);
        elements.push(span);

        if (config.animateBy === 'words' && index < items.length - 1) {
          span.textContent += '\u00A0';
        }
      });
      el.appendChild(fragment);
    } else {
      // Parse existing DOM child nodes (preserving line breaks and color styling like gradient-text-blue)
      const fragment = document.createDocumentFragment();
      const childNodes = Array.from(el.childNodes);

      function processNode(node, inheritedClasses = '') {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          if (tag === 'br') {
            const br = document.createElement('span');
            br.className = 'blur-text-break ' + (node.className || '');
            fragment.appendChild(br);
            return;
          }

          // If it's a wrapper span or line container
          const currentClasses = [inheritedClasses, node.className].filter(Boolean).join(' ');
          Array.from(node.childNodes).forEach(child => processNode(child, currentClasses));
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text || !text.trim()) return;

          if (config.animateBy === 'letters') {
            const chars = text.split('');
            chars.forEach(char => {
              const span = document.createElement('span');
              span.className = 'blur-text-element blur-text-letter ' + inheritedClasses;
              span.style.setProperty('--index', wordIndex++);
              span.textContent = char === ' ' ? '\u00A0' : char;
              fragment.appendChild(span);
              elements.push(span);
            });
          } else {
            // Words mode (default)
            const words = text.split(/\s+/).filter(Boolean);
            words.forEach((word, wIdx) => {
              const span = document.createElement('span');
              span.className = 'blur-text-element blur-text-word ' + inheritedClasses;
              span.style.setProperty('--index', wordIndex++);
              span.textContent = word;
              fragment.appendChild(span);
              elements.push(span);

              if (wIdx < words.length - 1) {
                const space = document.createElement('span');
                space.className = 'blur-text-space';
                space.innerHTML = '&nbsp;';
                fragment.appendChild(space);
              }
            });
          }
        }
      }

      childNodes.forEach(child => processNode(child, ''));
      el.innerHTML = '';
      el.appendChild(fragment);
    }

    let isCompleted = false;

    function attachCompleteHandler() {
      if (!elements.length) return;
      const lastElement = elements[elements.length - 1];

      const onAnimationEnd = (e) => {
        if (e.target !== lastElement) return;
        isCompleted = true;
        el.classList.add('is-completed');

        if (typeof config.onAnimationComplete === 'function') {
          config.onAnimationComplete();
        }

        el.dispatchEvent(new CustomEvent('blurtext:complete', {
          bubbles: true,
          detail: { target: el, elementsCount: elements.length }
        }));
      };

      lastElement.addEventListener('animationend', onAnimationEnd, { once: true });
    }

    function startAnimation() {
      el.classList.remove('is-completed');
      el.classList.add('is-in-view');
      attachCompleteHandler();
    }

    function replay() {
      el.classList.remove('is-in-view', 'is-completed');
      void el.offsetWidth; // Force CSS reflow to reset keyframe animations
      startAnimation();
    }

    // IntersectionObserver to trigger entrance when visible in viewport
    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startAnimation();
              if (observer) {
                observer.unobserve(el);
                observer.disconnect();
              }
            }
          });
        },
        { threshold: config.threshold, rootMargin: config.rootMargin }
      );
      observer.observe(el);
    } else {
      // Fallback if IntersectionObserver is not available
      startAnimation();
    }

    // Allow click to replay animation
    el.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, select')) return;
      replay();
    });

    // Attach API directly to DOM element
    const instance = {
      replay,
      elements,
      destroy: () => {
        if (observer) observer.disconnect();
        el.classList.remove('is-in-view', 'is-completed');
      }
    };

    el.blurText = instance;
    return instance;
  }

  // Auto-discover and initialize all elements with .blur-text
  function autoInit() {
    const targets = document.querySelectorAll('.blur-text, [data-blur-text]');
    targets.forEach(el => {
      if (!el.blurText) {
        createBlurText(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  createBlurText.initAll = autoInit;
  return createBlurText;
});
