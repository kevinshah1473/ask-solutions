/**
 * ASK SOLUTIONS - Interactive JavaScript Logic
 * Kevin Shah - Insurance & Financial Advisor
 * Growing with you at every stage
 * Phone / WhatsApp: +91 91377 82455
 * Email: askforthesolution@gmail.com
 * Head Office: Goregaon (W), Mumbai
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules with error insulation
  try { initMobileMenu(); } catch (e) { console.error('Menu Init Error:', e); }
  try { initProductCategoryFilters(); } catch (e) { console.error('Filters Init Error:', e); }
  try { initCalculators(); } catch (e) { console.error('Calculators Init Error:', e); }
  try { initModals(); } catch (e) { console.error('Modals Init Error:', e); }
  try { initHeroQuickForm(); } catch (e) { console.error('Hero Form Init Error:', e); }
  try { initContactForm(); } catch (e) { console.error('Contact Form Init Error:', e); }
  try { initFAQ(); } catch (e) { console.error('FAQ Init Error:', e); }
  try { initQuickWhatsAppQuote(); } catch (e) { console.error('WhatsApp Quote Init Error:', e); }
  try { initStatsCounter(); } catch (e) { console.error('Stats Counter Init Error:', e); }
  try { initScrollAnimations(); } catch (e) { console.error('Scroll Animations Init Error:', e); }
  try { initButtonRipples(); } catch (e) { console.error('Ripple Init Error:', e); }
  try { initScrollProgressBar(); } catch (e) { console.error('Scroll Progress Init Error:', e); }
  try { initSmoothSectionTransitions(); } catch (e) { console.error('Section Transitions Init Error:', e); }
});

// Format Indian Currency Helper (Short: ₹15+ Cr / ₹50 Lakh)
function formatINR(number) {
  if (isNaN(number) || !isFinite(number)) return '₹0';
  const rounded = Math.round(number);
  if (rounded >= 10000000) {
    return '₹' + (rounded / 10000000).toFixed(2) + ' Cr';
  } else if (rounded >= 100000) {
    return '₹' + (rounded / 100000).toFixed(2) + ' Lakh';
  } else {
    return '₹' + rounded.toLocaleString('en-IN');
  }
}

// Format Full Indian Currency String (e.g. ₹15,00,000)
function formatINRFull(number) {
  if (isNaN(number) || !isFinite(number)) return '₹0';
  return '₹' + Math.round(number).toLocaleString('en-IN');
}

// ----------------------------------------------------
// 1. MOBILE MENU DRAWER TOGGLE
// ----------------------------------------------------
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileNav) return;

  const openMenu = () => {
    mobileNav.classList.remove('hidden');
    requestAnimationFrame(() => {
      mobileNav.classList.remove('opacity-0');
      mobileNav.classList.add('opacity-100');
    });
    document.body.classList.add('overflow-hidden');
  };

  const closeMenu = () => {
    mobileNav.classList.remove('opacity-100');
    mobileNav.classList.add('opacity-0');
    setTimeout(() => {
      mobileNav.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  };

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
      closeMenu();
    }
  });

  // Dynamic Header Shadow on Scroll
  const mainHeader = document.getElementById('main-header');
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        mainHeader.classList.add('shadow-md', 'bg-white/98');
        mainHeader.classList.remove('shadow-sm', 'bg-white/95');
      } else {
        mainHeader.classList.remove('shadow-md', 'bg-white/98');
        mainHeader.classList.add('shadow-sm', 'bg-white/95');
      }
    }, { passive: true });
  }
}

// ----------------------------------------------------
// 2. PRODUCT CATEGORY FILTERS (Supports all pages)
// ----------------------------------------------------
function initProductCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !productCards.length) return;

  // Normalized category matching helper
  const normalizeCategory = (cat) => {
    if (!cat) return '';
    const c = cat.toLowerCase();
    if (c === 'business' || c === 'property-business') return 'business';
    if (c === 'vehicle-cyber' || c === 'travel-cyber') return 'vehicle-cyber';
    return c;
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const rawCategory = btn.getAttribute('data-filter') || btn.getAttribute('data-category') || 'all';
      const selectedCategory = normalizeCategory(rawCategory);

      // Update button active styles
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-slate-900', 'bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      });
      btn.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');

      // Filter product cards smoothly
      productCards.forEach(card => {
        const rawCardCat = card.getAttribute('data-category') || card.getAttribute('data-cat') || '';
        const cardCat = normalizeCategory(rawCardCat);

        if (selectedCategory === 'all' || cardCat === selectedCategory) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translate3d(0, 0, 0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 10px, 0) scale(0.96)';
          setTimeout(() => {
            const currentSelected = normalizeCategory(btn.getAttribute('data-filter') || btn.getAttribute('data-category') || 'all');
            if (currentSelected !== 'all' && cardCat !== currentSelected) {
              card.classList.add('hidden');
            }
          }, 200);
        }
      });
    });
  });
}

// ----------------------------------------------------
// 3. FINANCIAL CALCULATORS ENGINE (Chart.js + Formulas)
// ----------------------------------------------------
let sipChartInstance = null;
let lumpsumChartInstance = null;

function initCalculators() {
  // Tabs Switcher
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const calcPanels = document.querySelectorAll('.calc-panel, .calc-pane');

  if (tabBtns.length && calcPanels.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab') || btn.getAttribute('data-target');
        if (!targetId) return;

        tabBtns.forEach(b => {
          b.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md');
          b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
        });
        btn.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md');
        btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');

        calcPanels.forEach(panel => {
          panel.classList.add('hidden');
        });

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.remove('hidden');
          if ((targetId === 'sip-calc' || targetId === 'calc-sip') && sipChartInstance) {
            setTimeout(() => sipChartInstance.resize(), 50);
          } else if ((targetId === 'lump-calc' || targetId === 'calc-lumpsum') && lumpsumChartInstance) {
            setTimeout(() => lumpsumChartInstance.resize(), 50);
          }
        }
      });
    });

    // Handle URL hash on load (e.g., #sip-calc, #hlv-calc, #retire-calc, #lump-calc)
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const matchingBtn = document.querySelector(`.calc-tab-btn[data-tab="${hashId}"], .calc-tab-btn[data-target="${hashId}"]`);
      if (matchingBtn) {
        setTimeout(() => matchingBtn.click(), 120);
      }
    }
  }

  // Setup all 4 calculators
  setupSIPCalculator();
  setupLumpsumCalculator();
  setupTermCoverCalculator();
  setupRetirementCalculator();
}

// 1. SIP CALCULATOR
function setupSIPCalculator() {
  const amountSlider = document.getElementById('sip-amount') || document.getElementById('sip-amount-slider');
  const amountVal = document.getElementById('sip-amount-val');
  const rateSlider = document.getElementById('sip-rate') || document.getElementById('sip-rate-slider');
  const rateVal = document.getElementById('sip-rate-val');
  const yearsSlider = document.getElementById('sip-years') || document.getElementById('sip-years-slider');
  const yearsVal = document.getElementById('sip-years-val');

  const investedEl = document.getElementById('sip-invested') || document.getElementById('sip-invested-val');
  const gainEl = document.getElementById('sip-gain') || document.getElementById('sip-returns-val');
  const totalEl = document.getElementById('sip-total') || document.getElementById('sip-total-val');
  const chartCanvas = document.getElementById('sip-chart') || document.getElementById('sipChart');

  if (!amountSlider || !investedEl) return;

  function calculateSIP() {
    const P = Math.max(500, parseFloat(amountSlider.value) || 10000);
    const annualRate = Math.max(1, Math.min(30, parseFloat(rateSlider ? rateSlider.value : 12) || 12));
    const years = Math.max(1, Math.min(40, parseFloat(yearsSlider ? yearsSlider.value : 15) || 15));

    if (amountVal) amountVal.textContent = formatINRFull(P);
    if (rateVal) rateVal.textContent = annualRate + '%';
    if (yearsVal) yearsVal.textContent = years + ' Years';

    const i = (annualRate / 100) / 12;
    const n = years * 12;

    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const estimatedReturns = Math.max(0, futureValue - totalInvested);

    if (investedEl) investedEl.textContent = formatINRFull(totalInvested);
    if (gainEl) gainEl.textContent = formatINRFull(estimatedReturns);
    if (totalEl) totalEl.textContent = formatINR(futureValue) + ` (${formatINRFull(futureValue)})`;

    updateSIPChart(totalInvested, estimatedReturns, chartCanvas);
  }

  if (amountSlider) amountSlider.addEventListener('input', calculateSIP, { passive: true });
  if (rateSlider) rateSlider.addEventListener('input', calculateSIP, { passive: true });
  if (yearsSlider) yearsSlider.addEventListener('input', calculateSIP, { passive: true });

  // Init Chart if Chart.js is available
  if (chartCanvas && typeof Chart !== 'undefined') {
    if (sipChartInstance) sipChartInstance.destroy();
    sipChartInstance = new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Invested Amount', 'Estimated Wealth Gain'],
        datasets: [{
          data: [1800000, 3245760],
          backgroundColor: ['#0e2b5c', '#2563eb'],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${formatINRFull(context.raw)}`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  calculateSIP();
}

function updateSIPChart(invested, returns, chartCanvas) {
  if (sipChartInstance && sipChartInstance.data && sipChartInstance.data.datasets && sipChartInstance.data.datasets[0]) {
    sipChartInstance.data.datasets[0].data = [Math.round(invested), Math.round(returns)];
    sipChartInstance.update('none');
  }
}

// 2. LUMPSUM CALCULATOR
function setupLumpsumCalculator() {
  const amountSlider = document.getElementById('lump-amount') || document.getElementById('lump-amount-slider');
  const amountVal = document.getElementById('lump-amount-val');
  const rateSlider = document.getElementById('lump-rate') || document.getElementById('lump-rate-slider');
  const rateVal = document.getElementById('lump-rate-val');
  const yearsSlider = document.getElementById('lump-years') || document.getElementById('lump-years-slider');
  const yearsVal = document.getElementById('lump-years-val');

  const investedEl = document.getElementById('lump-invested') || document.getElementById('lump-invested-val');
  const gainEl = document.getElementById('lump-gain') || document.getElementById('lump-returns-val');
  const totalEl = document.getElementById('lump-total') || document.getElementById('lump-total-val');
  const chartCanvas = document.getElementById('lump-chart') || document.getElementById('lumpsumChart');

  if (!amountSlider || !investedEl) return;

  function calculateLumpsum() {
    const P = Math.max(1000, parseFloat(amountSlider.value) || 500000);
    const r = Math.max(1, Math.min(30, parseFloat(rateSlider ? rateSlider.value : 12) || 12));
    const t = Math.max(1, Math.min(40, parseFloat(yearsSlider ? yearsSlider.value : 10) || 10));

    if (amountVal) amountVal.textContent = formatINRFull(P);
    if (rateVal) rateVal.textContent = r + '%';
    if (yearsVal) yearsVal.textContent = t + ' Years';

    const futureValue = P * Math.pow(1 + (r / 100), t);
    const totalInvested = P;
    const estimatedReturns = Math.max(0, futureValue - totalInvested);

    if (investedEl) investedEl.textContent = formatINRFull(totalInvested);
    if (gainEl) gainEl.textContent = formatINRFull(estimatedReturns);
    if (totalEl) totalEl.textContent = formatINR(futureValue) + ` (${formatINRFull(futureValue)})`;

    updateLumpsumChart(totalInvested, estimatedReturns, chartCanvas);
  }

  if (amountSlider) amountSlider.addEventListener('input', calculateLumpsum, { passive: true });
  if (rateSlider) rateSlider.addEventListener('input', calculateLumpsum, { passive: true });
  if (yearsSlider) yearsSlider.addEventListener('input', calculateLumpsum, { passive: true });

  if (chartCanvas && typeof Chart !== 'undefined') {
    if (lumpsumChartInstance) lumpsumChartInstance.destroy();
    lumpsumChartInstance = new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Initial Principal', 'Estimated Capital Gain'],
        datasets: [{
          data: [500000, 1052924],
          backgroundColor: ['#1e3a8a', '#0284c7'],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${formatINRFull(context.raw)}`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  calculateLumpsum();
}

function updateLumpsumChart(invested, returns, chartCanvas) {
  if (lumpsumChartInstance && lumpsumChartInstance.data && lumpsumChartInstance.data.datasets && lumpsumChartInstance.data.datasets[0]) {
    lumpsumChartInstance.data.datasets[0].data = [Math.round(invested), Math.round(returns)];
    lumpsumChartInstance.update('none');
  }
}

// 3. HUMAN LIFE VALUE (TERM COVER) CALCULATOR
function setupTermCoverCalculator() {
  const incomeSlider = document.getElementById('hlv-income') || document.getElementById('term-income-slider');
  const incomeVal = document.getElementById('hlv-income-val');
  const ageSlider = document.getElementById('hlv-age') || document.getElementById('term-dependents-slider');
  const ageVal = document.getElementById('hlv-age-val');
  const loansSlider = document.getElementById('hlv-loans') || document.getElementById('term-loans-slider');
  const loansVal = document.getElementById('hlv-loans-val');

  const incomeRepEl = document.getElementById('hlv-income-rep');
  const debtRepEl = document.getElementById('hlv-debt-rep');
  const totalEl = document.getElementById('hlv-total') || document.getElementById('term-cover-recommended');

  if (!incomeSlider || !totalEl) return;

  function calculateTermCover() {
    const annualIncome = Math.max(100000, parseFloat(incomeSlider.value) || 1200000);
    const age = Math.max(18, Math.min(65, parseFloat(ageSlider ? ageSlider.value : 32) || 32));
    const loans = Math.max(0, parseFloat(loansSlider ? loansSlider.value : 3000000) || 0);

    if (incomeVal) incomeVal.textContent = formatINRFull(annualIncome);
    if (ageVal) ageVal.textContent = age + ' Years';
    if (loansVal) loansVal.textContent = formatINRFull(loans);

    // Multiplier decreases slightly with age
    let multiplier = 15;
    if (age < 30) multiplier = 20;
    else if (age > 45) multiplier = 10;

    const incomeReplacement = annualIncome * multiplier;
    const totalRecommended = incomeReplacement + loans;

    if (incomeRepEl) incomeRepEl.textContent = formatINR(incomeReplacement) + ` (${formatINRFull(incomeReplacement)})`;
    if (debtRepEl) debtRepEl.textContent = formatINR(loans) + ` (${formatINRFull(loans)})`;
    if (totalEl) totalEl.textContent = formatINR(totalRecommended) + ` (${formatINRFull(totalRecommended)})`;
  }

  if (incomeSlider) incomeSlider.addEventListener('input', calculateTermCover, { passive: true });
  if (ageSlider) ageSlider.addEventListener('input', calculateTermCover, { passive: true });
  if (loansSlider) loansSlider.addEventListener('input', calculateTermCover, { passive: true });

  calculateTermCover();
}

// 4. RETIREMENT PLANNING CALCULATOR
function setupRetirementCalculator() {
  const expSlider = document.getElementById('retire-exp') || document.getElementById('ret-expense-slider');
  const expVal = document.getElementById('retire-exp-val');
  const currAgeInput = document.getElementById('retire-curr-age') || document.getElementById('ret-current-age-slider');
  const targetAgeInput = document.getElementById('retire-target-age') || document.getElementById('ret-retire-age-slider');
  const infSlider = document.getElementById('retire-inf') || document.getElementById('ret-rate-slider');
  const infVal = document.getElementById('retire-inf-val');

  const futureExpEl = document.getElementById('retire-future-exp') || document.getElementById('ret-future-expense');
  const accumYearsEl = document.getElementById('retire-accum-years');
  const totalEl = document.getElementById('retire-total') || document.getElementById('ret-corpus-required');

  if (!expSlider || !totalEl) return;

  function calculateRetirement() {
    const monthlyExp = Math.max(5000, parseFloat(expSlider.value) || 50000);
    const currAge = Math.max(18, Math.min(65, parseFloat(currAgeInput ? currAgeInput.value : 30) || 30));
    let targetAge = Math.max(currAge + 1, Math.min(75, parseFloat(targetAgeInput ? targetAgeInput.value : 60) || 60));
    const inflation = Math.max(3, Math.min(12, parseFloat(infSlider ? infSlider.value : 6) || 6)) / 100;

    if (expVal) expVal.textContent = formatINRFull(monthlyExp);
    if (infVal) infVal.textContent = (inflation * 100).toFixed(1) + '%';

    const yearsToRetire = targetAge - currAge;
    const postRetirementReturn = 0.08;
    const lifeExpectancyYears = 25;

    const futureMonthlyExpense = monthlyExp * Math.pow(1 + inflation, yearsToRetire);
    const futureAnnualExpense = futureMonthlyExpense * 12;
    const realRate = (1 + postRetirementReturn) / (1 + inflation) - 1;

    const corpusNeeded = futureAnnualExpense * ((1 - Math.pow(1 + realRate, -lifeExpectancyYears)) / realRate);

    if (futureExpEl) futureExpEl.textContent = formatINRFull(futureMonthlyExpense) + '/mo';
    if (accumYearsEl) accumYearsEl.textContent = yearsToRetire + ' Years';
    if (totalEl) totalEl.textContent = formatINR(corpusNeeded) + ` (${formatINRFull(corpusNeeded)})`;
  }

  if (expSlider) expSlider.addEventListener('input', calculateRetirement, { passive: true });
  if (currAgeInput) currAgeInput.addEventListener('input', calculateRetirement, { passive: true });
  if (targetAgeInput) targetAgeInput.addEventListener('input', calculateRetirement, { passive: true });
  if (infSlider) infSlider.addEventListener('input', calculateRetirement, { passive: true });

  calculateRetirement();
}

// ----------------------------------------------------
// 4. CONSULTATION MODALS & SERVICE PRE-FILLING
// ----------------------------------------------------
function initModals() {
  const openModalBtns = document.querySelectorAll('.open-consultation-modal');
  const modalOverlay = document.getElementById('consultation-modal');
  const closeModalBtns = document.querySelectorAll('.close-consultation-modal, #modal-close-btn');
  const serviceSelectInput = document.getElementById('modal-service-select');
  const modalBox = modalOverlay ? modalOverlay.querySelector('.modal-box, div') : null;

  if (!modalOverlay) return;

  const openModal = (serviceName) => {
    if (serviceSelectInput && serviceName) {
      for (let i = 0; i < serviceSelectInput.options.length; i++) {
        const opt = serviceSelectInput.options[i];
        if (opt.value.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(opt.value.toLowerCase())) {
          serviceSelectInput.selectedIndex = i;
          break;
        }
      }
    }

    modalOverlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      modalOverlay.classList.remove('opacity-0');
      modalOverlay.classList.add('opacity-100');
      if (modalBox) {
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
      }
    });
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    modalOverlay.classList.remove('opacity-100');
    modalOverlay.classList.add('opacity-0');
    if (modalBox) {
      modalBox.classList.remove('scale-100');
      modalBox.classList.add('scale-95');
    }
    setTimeout(() => {
      modalOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Financial Advisory';
      openModal(serviceName);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Modal Form Submission
  const modalForm = document.getElementById('consultation-modal-form') || document.getElementById('modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name')?.value || 'Client';
      const phone = document.getElementById('modal-phone')?.value || '';
      const service = document.getElementById('modal-service-select')?.value || 'Financial Planning';
      const location = document.getElementById('modal-location')?.value || 'Goregaon (W)';
      const mode = document.getElementById('modal-mode')?.value || 'WhatsApp / Call';

      const message = `*New Consultation Request - ASK SOLUTIONS*%0A` +
        `_Growing with you at every stage_%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Product We Serve:* ${encodeURIComponent(service)}%0A` +
        `*Location:* ${encodeURIComponent(location)}%0A` +
        `*Preferred Meeting:* ${encodeURIComponent(mode)}%0A` +
        `*Request Date:* ${new Date().toLocaleDateString('en-IN')}%0A` +
        `_Please connect me with Kevin Shah._`;

      window.open(`https://wa.me/919137782455?text=${message}`, '_blank');
      closeModal();
      showToast('Redirecting you to WhatsApp to connect with Kevin Shah...');
      modalForm.reset();
    });
  }
}

// ----------------------------------------------------
// 5. HERO SECTION QUICK FORM
// ----------------------------------------------------
function initHeroQuickForm() {
  const heroForm = document.getElementById('hero-quick-form');
  if (!heroForm) return;

  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = document.getElementById('hero-service')?.value || 'Mutual Fund / S.I.P';
    const phone = document.getElementById('hero-phone')?.value || '';
    const branch = document.getElementById('hero-branch')?.value || 'Goregaon (W) Office';

    const message = `*Quick Consultation Request - ASK SOLUTIONS*%0A` +
      `_Growing with you at every stage_%0A%0A` +
      `*Founder:* Kevin Shah%0A` +
      `*Product We Serve:* ${encodeURIComponent(service)}%0A` +
      `*Phone Number:* ${encodeURIComponent(phone)}%0A` +
      `*Meeting Preference:* ${encodeURIComponent(branch)}%0A` +
      `*Request Date:* ${new Date().toLocaleDateString('en-IN')}%0A` +
      `_Please share available consultation time slots._`;

    window.open(`https://wa.me/919137782455?text=${message}`, '_blank');
    showToast('Connecting you with Kevin Shah on WhatsApp...');
    heroForm.reset();
  });
}

// ----------------------------------------------------
// 6. MAIN CONTACT PAGE & FOOTER FORM
// ----------------------------------------------------
function initContactForm() {
  const contactForm = document.getElementById('main-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Client';
    const phone = document.getElementById('contact-phone')?.value || '';
    const service = document.getElementById('contact-service')?.value || 'General Inquiry';
    const branch = document.getElementById('contact-branch')?.value || 'Goregaon (W) Head Office Visit';
    const notes = document.getElementById('contact-notes')?.value || 'N/A';

    const message = `*New Website Inquiry - ASK SOLUTIONS*%0A` +
      `_Growing with you at every stage_%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Product We Serve:* ${encodeURIComponent(service)}%0A` +
      `*Preference:* ${encodeURIComponent(branch)}%0A` +
      `*Message / Query:* ${encodeURIComponent(notes)}%0A` +
      `*Request Date:* ${new Date().toLocaleDateString('en-IN')}%0A` +
      `_Please connect me with Kevin Shah._`;

    window.open(`https://wa.me/919137782455?text=${message}`, '_blank');
    showToast('Inquiry received! Opening WhatsApp chat with Kevin Shah...');
    contactForm.reset();
  });
}

// ----------------------------------------------------
// 7. FAQ ACCORDION
// ----------------------------------------------------
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-header, button');
    const answer = item.querySelector('.accordion-content, .faq-answer, div:last-child');
    const icon = item.querySelector('.faq-icon, i');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = answer.classList.contains('active') || !answer.classList.contains('hidden');

        // Close all others
        faqItems.forEach(other => {
          const otherAns = other.querySelector('.accordion-content, .faq-answer, div:last-child');
          const otherIcon = other.querySelector('.faq-icon, i');
          if (otherAns) {
            otherAns.classList.remove('active');
            otherAns.classList.add('hidden');
          }
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (isOpen) {
          answer.classList.remove('active');
          answer.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          answer.classList.add('active');
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

// ----------------------------------------------------
// 8. QUICK WHATSAPP QUOTE SHORTCUTS
// ----------------------------------------------------
function initQuickWhatsAppQuote() {
  const quickButtons = document.querySelectorAll('.whatsapp-quick-quote');
  quickButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Financial Planning';
      const message = `Hello Kevin Shah, I am looking for expert advice on *${encodeURIComponent(service)}* from ASK SOLUTIONS. Please share details and available consultation slots.`;
      window.open(`https://wa.me/919137782455?text=${message}`, '_blank');
    });
  });
}

// ----------------------------------------------------
// 9. ANIMATED STAT COUNTER
// ----------------------------------------------------
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;
  let started = false;

  const runCounter = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target')) || 0;
      const isDecimal = counter.getAttribute('data-decimal') === 'true' || target % 1 !== 0;
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1500;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN')) + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('en-IN')) + suffix;
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        runCounter();
      }
    });
  }, { threshold: 0.15 });

  const statsSection = document.getElementById('stats-section') || document.querySelector('.stat-box');
  if (statsSection) {
    observer.observe(statsSection);
  } else {
    runCounter();
  }
}

// ----------------------------------------------------
// 10. TOAST NOTIFICATION
// ----------------------------------------------------
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed top-5 right-5 bg-slate-950 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 transform transition-all duration-300 translate-y-[-100px] border border-blue-500/40 flex items-center gap-3 text-sm max-w-md';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-sky-400 text-xl"></i> <span>${message}</span>`;
  toast.classList.remove('translate-y-[-100px]');
  toast.classList.add('translate-y-0');

  setTimeout(() => {
    toast.classList.remove('translate-y-0');
    toast.classList.add('translate-y-[-100px]');
  }, 4000);
}

// ----------------------------------------------------
// 11. SCROLL REVEAL & STAGGERED ANIMATIONS OBSERVER
// ----------------------------------------------------
function initScrollAnimations() {
  const revealTargets = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .product-card, .stat-box, .branch-card, .review-card, .feature-card'
  );

  if (!revealTargets.length) return;

  revealTargets.forEach((el, index) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-up') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
      el.classList.add('reveal-up');
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));
}

// ----------------------------------------------------
// 12. BUTTON TACTILE RIPPLE EFFECT
// ----------------------------------------------------
function initButtonRipples() {
  const rippleButtons = document.querySelectorAll('.btn-shimmer, .open-consultation-modal, .btn-ripple, button[type="submit"]');

  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.classList.add('btn-ripple');
      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 550);
    });
  });
}

// ----------------------------------------------------
// 13. GLOBAL SCROLL TO CALCULATOR HELPER
// ----------------------------------------------------
window.scrollToCalculator = function(tabId) {
  const calcSection = document.getElementById('product-calculators') || document.getElementById('calculators');
  if (calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (tabId) {
      let targets = [tabId];
      if (tabId === 'hlv-calc' || tabId === 'term-calc') targets = ['hlv-calc', 'term-calc'];
      if (tabId === 'retire-calc' || tabId === 'ret-calc') targets = ['retire-calc', 'ret-calc'];
      if (tabId === 'sip-calc' || tabId === 'calc-sip') targets = ['sip-calc', 'calc-sip'];
      if (tabId === 'lump-calc' || tabId === 'calc-lumpsum') targets = ['lump-calc', 'calc-lumpsum'];

      const selector = targets.map(t => `.calc-tab-btn[data-tab="${t}"], .calc-tab-btn[data-target="${t}"]`).join(', ');
      const tabBtn = document.querySelector(selector);
      if (tabBtn) {
        setTimeout(() => tabBtn.click(), 180);
      }
    }
  } else {
    window.location.href = tabId ? `calculators.html#${tabId}` : 'calculators.html';
  }
};

// ----------------------------------------------------
// 14. TOP SCROLL PROGRESS INDICATOR
// ----------------------------------------------------
function initScrollProgressBar() {
  let bar = document.getElementById('scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    document.body.appendChild(bar);
  }

  const updateProgress = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = scrolled + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function initSmoothSectionTransitions() {
  // Gentle slow smooth scroll helper using cubic ease-in-out
  function smoothScrollTo(targetY, duration = 950) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return;
    
    let startTime = null;
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + diff * easeProgress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  // Smooth scroll interceptor for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate header offset
        const header = document.getElementById('main-header');
        const headerOffset = header ? header.offsetHeight + 15 : 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        smoothScrollTo(offsetPosition, 950);

        // Trigger subtle section highlight animation (slow, 2.5s gentle dissolve)
        targetElement.style.transition = 'box-shadow 1.2s ease, transform 0.8s ease';
        targetElement.classList.add('is-targeted-section');
        setTimeout(() => {
          targetElement.classList.remove('is-targeted-section');
        }, 2500);

        // Update URL hash without abrupt jump
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // Section Observer for Quick-Jump Navigation Pills & Nav Links
  const observedSections = document.querySelectorAll('section[id], div[id="founder"], div[id="why-us"], div[id="reviews"], div[id="contact"]');
  const jumpPills = document.querySelectorAll('.section-jump-pill, a[href^="#"]');

  if (observedSections.length && jumpPills.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          const id = entry.target.getAttribute('id');
          if (!id) return;

          jumpPills.forEach(pill => {
            const href = pill.getAttribute('href');
            if (href === `#${id}` || href?.endsWith(`#${id}`)) {
              pill.classList.add('active');
            } else if (href && href.startsWith('#')) {
              pill.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: [0.2, 0.5],
      rootMargin: '-10% 0px -40% 0px'
    });

    observedSections.forEach(sec => sectionObserver.observe(sec));
  }
}



