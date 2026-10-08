/**
 * CLUB ADMIN DASHBOARD INTERACTIVE SCRIPT
 * Handles real-time search by Guest Name / Room Number, status dropdown filtering, and toast alerts.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Live Date Display
  const currentDateDisplay = document.getElementById('currentDateDisplay');
  if (currentDateDisplay) {
    const now = new Date();
    currentDateDisplay.textContent = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // 2. Real-time Search Input by Guest Name or Room Number
  const adminSearchInput = document.getElementById('adminSearchInput');
  const bookingsTable = document.getElementById('bookingsTable');
  const tableRows = bookingsTable ? bookingsTable.querySelectorAll('tbody tr') : [];

  if (adminSearchInput && bookingsTable) {
    adminSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // 3. Status Dropdown Filter (All, Booked Rooms, Available Rooms, Paid, Pending)
  const statusFilterSelect = document.getElementById('statusFilterSelect');
  if (statusFilterSelect && bookingsTable) {
    statusFilterSelect.addEventListener('change', (e) => {
      const filterVal = e.target.value;

      tableRows.forEach(row => {
        const statusAttr = row.getAttribute('data-status') || '';
        
        if (filterVal === 'all') {
          row.style.display = '';
        } else if (filterVal === 'booked' && statusAttr.includes('booked')) {
          row.style.display = '';
        } else if (filterVal === 'available' && statusAttr.includes('available')) {
          row.style.display = '';
        } else if (filterVal === 'paid' && statusAttr.includes('paid')) {
          row.style.display = '';
        } else if (filterVal === 'pending' && statusAttr.includes('pending')) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      showToast(`Filter applied: ${filterVal.toUpperCase()}`);
    });
  }

  // 4. Booking Details Modal Helper
  window.showBookingDetails = function(id, guest, room, amount) {
    showToast(`Managing ${id} — ${guest} (${room} - ${amount})`);
  };

  window.assignGuest = function(roomNumber) {
    showToast(`Assigning new guest to ${roomNumber}...`);
  };

  // 5. Toast Notification System
  window.showToast = function(message) {
    const toastNotice = document.getElementById('toastNotice');
    const toastMessage = document.getElementById('toastMessage');

    if (toastNotice && toastMessage) {
      toastMessage.textContent = message;
      toastNotice.classList.add('show');

      clearTimeout(window.adminToastTimer);
      window.adminToastTimer = setTimeout(() => {
        toastNotice.classList.remove('show');
      }, 3000);
    }
  };

  // 6. Sidebar Navigation Logic
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const adminPages = document.querySelectorAll('.admin-page');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-admin-page');
      if (!pageId) return;

      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      adminPages.forEach(page => {
        if (page.id === 'page-' + pageId) {
          page.style.display = 'block';
        } else {
          page.style.display = 'none';
        }
      });
    });
  });

  // 7. Toggle Room Status
  window.toggleRoomStatus = function(roomId, action) {
    // 1. Update Card in Rooms Tab
    const card = document.getElementById(`room-card-${roomId}`);
    if (card) {
      const badge = card.querySelector('.status-badge');
      const btn = card.querySelector('.btn-toggle-status');

      if (action === 'vacant') {
        badge.className = 'status-badge status-available';
        badge.innerHTML = '<i class="fa-solid fa-key"></i> Vacant';
        
        btn.className = 'btn-toggle-status btn-mark-booked';
        btn.textContent = 'Mark as Booked';
        btn.setAttribute('onclick', `toggleRoomStatus('${roomId}', 'booked')`);
        
        showToast(`Room #${roomId} is now marked as Vacant`);
      } else {
        badge.className = 'status-badge status-paid';
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Booked';
        
        btn.className = 'btn-toggle-status btn-mark-vacant';
        btn.textContent = 'Mark as Vacant';
        btn.setAttribute('onclick', `toggleRoomStatus('${roomId}', 'vacant')`);
        
        showToast(`Room #${roomId} is now marked as Booked`);
      }
    }

    // 2. Update Table Row in Dashboard Overview Tab
    const bookingsTable = document.getElementById('bookingsTable');
    if (bookingsTable) {
      const row = bookingsTable.querySelector(`tr[data-room="#${roomId}"]`);
      if (row) {
        const guestInfoCell = row.cells[1].querySelector('.guest-info-cell');
        const checkInOutCell = row.cells[4];
        const statusCell = row.cells[5];

        if (action === 'vacant') {
          row.setAttribute('data-status', 'available');
          if (guestInfoCell) {
            guestInfoCell.innerHTML = '<span class="vacant-tag"><i class="fa-solid fa-circle"></i> Ready for Check-in</span>';
          }
          if (checkInOutCell) checkInOutCell.textContent = 'Vacant';
          if (statusCell) {
            statusCell.innerHTML = '<span class="status-badge status-available"><i class="fa-solid fa-key"></i> Available</span>';
          }
        } else {
          row.setAttribute('data-status', 'booked paid');
          if (guestInfoCell) {
            guestInfoCell.innerHTML = `
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Guest" class="guest-avatar">
              <div>
                <strong class="guest-name">Manual Booking</strong>
                <span class="guest-email">Direct Contact</span>
              </div>
            `;
          }
          if (checkInOutCell) checkInOutCell.textContent = 'Ongoing';
          if (statusCell) {
            statusCell.innerHTML = '<span class="status-badge status-paid"><i class="fa-solid fa-circle-check"></i> Booked</span>';
          }
        }
      }
    }
  };

});
