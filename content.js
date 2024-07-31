(function() {
    const overlayId = 'profile-locker-overlay';
  
    if (document.getElementById(overlayId)) {
      return;
    }
  
    const lockOverlay = document.createElement('div');
    lockOverlay.id = overlayId;
    lockOverlay.style.position = 'fixed';
    lockOverlay.style.top = '0';
    lockOverlay.style.left = '0';
    lockOverlay.style.width = '100%';
    lockOverlay.style.height = '100%';
    lockOverlay.style.backgroundColor = 'white';
    lockOverlay.style.zIndex = '9999';
    lockOverlay.style.display = 'flex';
    lockOverlay.style.justifyContent = 'center';
    lockOverlay.style.alignItems = 'center';
    lockOverlay.innerHTML = `
      <div style="text-align: center;">
        <h2>Enter Password</h2>
        <input type="password" id="profile-locker-password" placeholder="Password" style="padding: 8px; margin-bottom: 10px;">
        <button id="profile-locker-unlock" style="padding: 8px;">Unlock</button>
        <div id="profile-locker-message" style="margin-top: 10px; color: red;"></div>
      </div>
    `;
  
    document.body.appendChild(lockOverlay);
  
    document.getElementById('profile-locker-unlock').addEventListener('click', function() {
      const passwordInput = document.getElementById('profile-locker-password').value;
      chrome.storage.local.get('profilePassword', function(data) {
        if (passwordInput === data.profilePassword) {
          chrome.runtime.sendMessage({ action: 'unlockProfile' }, function(response) {
            if (response.status === 'unlocked') {
              lockOverlay.remove();
            }
          });
        } else {
          document.getElementById('profile-locker-message').innerText = 'Incorrect Password!';
        }
      });
    });
  })();
  