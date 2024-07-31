document.getElementById('set-password-button').addEventListener('click', function() {
    const currentPassword = document.getElementById('current-password-input').value;
    const newPassword = document.getElementById('new-password-input').value;
  
    chrome.storage.local.get('profilePassword', function(data) {
      if (currentPassword === data.profilePassword) {
        chrome.storage.local.set({ profilePassword: newPassword }, function() {
          document.getElementById('message').innerText = 'Password Set!';
          setTimeout(() => document.getElementById('message').innerText = '', 2000);
        });
      } else {
        document.getElementById('message').innerText = 'Incorrect Current Password!';
      }
    });
  });
  
  document.getElementById('unlock-button').addEventListener('click', function() {
    const passwordInput = document.getElementById('password-input').value;
    chrome.storage.local.get('profilePassword', function(data) {
      if (passwordInput === data.profilePassword) {
        chrome.runtime.sendMessage({ action: 'unlockProfile' }, function(response) {
          if (response.status === 'unlocked') {
            document.getElementById('message').innerText = 'Profile Unlocked!';
            setTimeout(() => {
              window.close();
            }, 1000);
          }
        });
      } else {
        document.getElementById('message').innerText = 'Incorrect Password!';
      }
    });
  });
  