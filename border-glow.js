/**
 * ASK SOLUTIONS - BorderGlow Interactive Edge & Mesh Lighting Component
 * React-Bits inspired high-performance vanilla JS implementation
 *
 * Tracks cursor proximity and angle relative to the card perimeter
 * and updates CSS variables to illuminate a conic mesh gradient border
 * with multi-layered specular edge glow.
 */

(function () {
  'use strict';

  function parseHSL(hslStr) {
    if (!hslStr) return { h: 40, s: 80, l: 80 };
    const match = String(hslStr).match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!match) return { h: 40, s: 80, l: 80 };
    return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
  }

  function buildGlowVars(glowColor, intensity = 1.0) {
    const { h, s, l } = parseHSL(glowColor);
    const base = `${h}deg ${s}% ${l}%`;
    const opacities = [100, 60, 50, 40, 30, 20, 10];
    const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    const vars = {};
    for (let i = 0; i < opacities.length; i++) {
      vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
    }
    return vars;
  }

  const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
  const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

  function buildGradientVars(colors) {
    const vars = {};
    for (let i = 0; i < 7; i++) {
      const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
      vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
    }
    vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
    return vars;
  }

  function isLightColor(color) {
    if (!color) return true;
    const value = String(color).trim().replace('#', '');
    if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return true;
    const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 160;
  }

  function getCenterOfElement(el) {
    const rect = el.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  }

  function getEdgeProximity(el, x, y) {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function getCursorAngle(el, x, y) {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  function initBorderGlow(selector = '.border-glow-card', customConfig = {}) {
    const cards = document.querySelectorAll(selector);
    if (!cards.length) return;

    const defaultConfig = {
      edgeSensitivity: 30,
      glowColor: '158 85 75',
      backgroundColor: '#f8fbff',
      borderRadius: 20,
      glowRadius: 35,
      glowIntensity: 1.0,
      coneSpread: 25,
      animated: false,
      colors: ['#10b981', '#34d399', '#06b6d4'],
      fillOpacity: 0.45
    };

    const config = Object.assign({}, defaultConfig, customConfig);
    const glowVars = buildGlowVars(config.glowColor, config.glowIntensity);
    const gradientVars = buildGradientVars(config.colors);
    const isLight = isLightColor(config.backgroundColor);

    cards.forEach(card => {
      // Ensure edge-light span exists
      if (!card.querySelector('.edge-light')) {
        const edgeLight = document.createElement('span');
        edgeLight.className = 'edge-light';
        card.insertBefore(edgeLight, card.firstChild);
      }

      // Add light surface class if applicable
      if (isLight) {
        card.classList.add('border-glow-card--light');
      } else {
        card.classList.add('border-glow-card--dark');
      }

      // Apply initial style properties
      card.style.setProperty('--card-bg', config.backgroundColor);
      card.style.setProperty('--edge-sensitivity', config.edgeSensitivity);
      card.style.setProperty('--color-sensitivity', config.edgeSensitivity + 20);
      card.style.setProperty('--border-radius', `${config.borderRadius}px`);
      card.style.setProperty('--glow-padding', `${config.glowRadius}px`);
      card.style.setProperty('--cone-spread', config.coneSpread);
      card.style.setProperty('--fill-opacity', config.fillOpacity);

      // Set color and gradient CSS vars
      for (const [key, value] of Object.entries(glowVars)) {
        card.style.setProperty(key, value);
      }
      for (const [key, value] of Object.entries(gradientVars)) {
        card.style.setProperty(key, value);
      }

      // Pointer tracking
      const onPointerMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const edge = getEdgeProximity(card, x, y);
        const angle = getCursorAngle(card, x, y);

        card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(2)}`);
        card.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`);
      };

      const onPointerLeave = () => {
        card.style.setProperty('--edge-proximity', '0');
      };

      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);

      // Also listen on parent product-card for smooth proactive proximity illumination
      const parentCard = card.closest('.product-card');
      if (parentCard) {
        parentCard.addEventListener('pointermove', (e) => {
          const rect = card.getBoundingClientRect();
          // Check if cursor is near this title (within 50px buffer)
          const buffer = 50;
          if (
            e.clientX >= rect.left - buffer &&
            e.clientX <= rect.right + buffer &&
            e.clientY >= rect.top - buffer &&
            e.clientY <= rect.bottom + buffer
          ) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const edge = getEdgeProximity(card, x, y);
            const angle = getCursorAngle(card, x, y);

            card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(2)}`);
            card.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`);
          }
        });

        parentCard.addEventListener('pointerleave', () => {
          card.style.setProperty('--edge-proximity', '0');
        });
      }
    });
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initBorderGlow());
  } else {
    initBorderGlow();
  }

  window.initBorderGlow = initBorderGlow;
})();
