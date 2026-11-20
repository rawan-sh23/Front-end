const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

if (sessionStorage.getItem('madar_admin_logged_in') === 'true') {
  window.location.replace('index.html');
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  loginError.hidden = true;

  const username = loginForm.elements.username.value.trim();
  const password = loginForm.elements.password.value;

  if (username === 'admin' && password === 'madar123') {
    sessionStorage.setItem('madar_admin_logged_in', 'true');
    window.location.href = 'index.html';
    return;
  }

  loginError.hidden = false;
  loginForm.elements.password.value = '';
  loginForm.elements.password.focus();
});
