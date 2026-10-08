/**
 * Karimnagar Club - Dynamic Single-Tab Display & Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Dynamic Single Tab Switcher ---
  window.switchTab = function(tabName) {
    const allSections = document.querySelectorAll('.tab-content-section');
    allSections.forEach(sec => sec.classList.remove('active-section'));

    const targetSection = document.getElementById(`section-${tabName}`);
    if (targetSection) {
      targetSection.classList.add('active-section');
    }

    const heroTabs = document.querySelectorAll('.search-tab-btn');
    heroTabs.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab-nav') === tabName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const locationInput = document.getElementById('locationInput');
    const tabPlaceholders = {
      rooms: 'Search rooms, suites or villas',
      sports: 'Search sports courts, golf & facilities',
      about: 'Search club information & services'
    };
    if (locationInput && tabPlaceholders[tabName]) {
      locationInput.placeholder = tabPlaceholders[tabName];
    }

    const wrapper = document.querySelector('.tab-content-wrapper');
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const searchTabBtns = document.querySelectorAll('.search-tab-btn');
  searchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  const navTabLinks = document.querySelectorAll('.nav-link[data-tab-nav]');
  navTabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.getAttribute('data-tab-nav');
      if (tab) switchTab(tab);
    });
  });

  // --- 2. Sub-Category Filter Pills ---
  const subFilterBtns = document.querySelectorAll('.sub-filter-btn');
  subFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Filter: ${btn.textContent.trim()}`);
    });
  });

  // --- 3. Location Dropdown Selection ---
  const locationInput = document.getElementById('locationInput');
  const locationGroup = document.getElementById('locationGroup');
  const locationDropdown = document.getElementById('locationDropdown');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  if (locationInput && locationDropdown) {
    locationInput.addEventListener('focus', () => {
      locationDropdown.classList.add('show');
    });

    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        locationInput.value = item.textContent.trim();
        locationDropdown.classList.remove('show');
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (locationGroup && !locationGroup.contains(e.target)) {
      if (locationDropdown) locationDropdown.classList.remove('show');
    }
    if (guestsGroup && !guestsGroup.contains(e.target)) {
      if (guestsPopup) guestsPopup.classList.remove('show');
    }
  });

  // --- 4. Date Pickers ---
  const checkInTrigger = document.getElementById('checkInInput');
  const checkOutTrigger = document.getElementById('checkOutInput');
  const nativeCheckIn = document.getElementById('nativeCheckIn');
  const nativeCheckOut = document.getElementById('nativeCheckOut');

  if (checkInTrigger && nativeCheckIn) {
    checkInTrigger.addEventListener('click', () => {
      nativeCheckIn.showPicker ? nativeCheckIn.showPicker() : nativeCheckIn.click();
    });

    nativeCheckIn.addEventListener('change', (e) => {
      if (e.target.value) {
        const d = new Date(e.target.value);
        checkInTrigger.value = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    });
  }

  if (checkOutTrigger && nativeCheckOut) {
    checkOutTrigger.addEventListener('click', () => {
      nativeCheckOut.showPicker ? nativeCheckOut.showPicker() : nativeCheckOut.click();
    });

    nativeCheckOut.addEventListener('change', (e) => {
      if (e.target.value) {
        const d = new Date(e.target.value);
        checkOutTrigger.value = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    });
  }

  // --- 5. Guests Counter Popup ---
  const guestsGroup = document.getElementById('guestsGroup');
  const guestsPopup = document.getElementById('guestsPopup');
  const guestsDisplayText = document.getElementById('guestsDisplayText');

  let adultCount = 2;
  let childCount = 0;

  const adultValSpan = document.getElementById('adultCount');
  const childValSpan = document.getElementById('childCount');
  const adultMinus = document.getElementById('adultMinus');
  const adultPlus = document.getElementById('adultPlus');
  const childMinus = document.getElementById('childMinus');
  const childPlus = document.getElementById('childPlus');

  if (guestsGroup && guestsPopup) {
    guestsGroup.addEventListener('click', (e) => {
      if (e.target.closest('.counter-btn') || e.target.closest('#guestsPopup')) return;
      guestsPopup.classList.toggle('show');
    });
  }

  function updateGuestDisplay() {
    if (adultValSpan) adultValSpan.textContent = adultCount;
    if (childValSpan) childValSpan.textContent = childCount;

    const totalGuests = adultCount + childCount;
    const roomCount = Math.ceil(totalGuests / 2) || 1;
    
    if (guestsDisplayText) {
      guestsDisplayText.textContent = `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}, ${roomCount} Room${roomCount > 1 ? 's' : ''}`;
    }
  }

  if (adultPlus) adultPlus.addEventListener('click', () => { adultCount++; updateGuestDisplay(); });
  if (adultMinus) adultMinus.addEventListener('click', () => { if (adultCount > 1) { adultCount--; updateGuestDisplay(); } });
  if (childPlus) childPlus.addEventListener('click', () => { childCount++; updateGuestDisplay(); });
  if (childMinus) childMinus.addEventListener('click', () => { if (childCount > 0) { childCount--; updateGuestDisplay(); } });

  // --- 6. Wishlist Button Toggle ---
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = '#ef4444';
        showToast('Added to your Karimnagar Club wishlist!');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = '';
        showToast('Removed from wishlist');
      }
    });
  });



  // --- 8. Mobile Menu Toggle ---
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // --- 9. Search Submission ---
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', () => {
      const dest = locationInput ? locationInput.value : 'Karimnagar Club';
      showToast(`✨ Searching availability for ${dest}!`);
      switchTab('rooms');
    });
  }

  // --- 10. Global Toast Helper & Room Booking Trigger ---
  window.showToast = function(message) {
    const toastNotice = document.getElementById('toastNotice');
    const toastMessage = document.getElementById('toastMessage');

    if (toastNotice && toastMessage) {
      toastMessage.textContent = message;
      toastNotice.classList.add('show');

      clearTimeout(window.toastTimer);
      window.toastTimer = setTimeout(() => {
        toastNotice.classList.remove('show');
      }, 3000);
    }
  };

  let currentBookingPrice = '';
  window.bookRoom = function(roomName, price) {
    currentBookingPrice = price;
    document.getElementById('bookingModal').classList.add('show');
  };

  window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('show');
  };

  window.submitBooking = function() {
    closeModal('bookingModal');
    document.getElementById('payAmount').textContent = currentBookingPrice;
    document.getElementById('paymentModal').classList.add('show');
  };

  window.processPayment = function() {
    closeModal('paymentModal');
    document.getElementById('successModal').classList.add('show');
  };

});
