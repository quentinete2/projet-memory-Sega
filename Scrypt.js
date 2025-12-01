function updateHeaderBar() {
    const header = document.querySelector('header');
    const existingBar = document.querySelector('.header-bar');
    if (existingBar) {
        existingBar.remove();
    }   
    
    const isLoggedIn = auth.isLoggedIn();
    let templateId = isLoggedIn ? 'header-bar-connect-true' : 'header-bar-connect-false';
    const template = document.getElementById(templateId);
    const headerBar = template.content.cloneNode(true);
    header.appendChild(headerBar);
    
    if (isLoggedIn) {
        const username = auth.getCurrentUser();
        document.getElementById('welcomeMessage').textContent = `Welcome, ${username}!`;
        document.getElementById('logoutButton').addEventListener('click', () => {
            auth.logout();
            updateHeaderBar();
            window.location.href = 'index.html';
        });
    } else {
        document.getElementById('loginButton').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }   
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderBar();
});
