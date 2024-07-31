(function() {
  const overlayId = 'profile-locker-overlay';

  if (document.getElementById(overlayId)) {
    return;
  }

  document.body.classList.add('profile-locker-blur');

  const lockOverlay = document.createElement('div');
  lockOverlay.id = overlayId;
  lockOverlay.style.position = 'fixed';
  lockOverlay.style.top = '0';
  lockOverlay.style.left = '0';
  lockOverlay.style.width = '100%';
  lockOverlay.style.height = '100%';
  lockOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  lockOverlay.style.zIndex = '9999';
  lockOverlay.style.display = 'flex';
  lockOverlay.style.justifyContent = 'center';
  lockOverlay.style.alignItems = 'center';
  lockOverlay.innerHTML = `
    <div style="text-align: center; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);">
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
            lockOverlay.classList.add('fade-out');
            document.body.classList.remove('profile-locker-blur');
            setTimeout(() => lockOverlay.remove(), 500);
          }
        });
      } else {
        document.getElementById('profile-locker-message').innerText = 'Incorrect Password!';
      }
    });
  });
})();
