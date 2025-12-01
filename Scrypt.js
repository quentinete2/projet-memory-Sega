function updateHeaderBar() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const existingBar = document.querySelector('.header-bar');
    if (existingBar) {
        existingBar.remove();
    }   
    
    const isLoggedIn = auth.isLoggedIn();
    let templateId = isLoggedIn ? 'header-bar-connect-true' : 'header-bar-connect-false';
    const template = document.getElementById(templateId);
    const headerBar = template.content.cloneNode(true);
    header.appendChild(headerBar);
    const deleteAccountTemplate = document.getElementById('delete-acount');
    if (isLoggedIn) {
        const deleteAccountButton = deleteAccountTemplate.content.cloneNode(true);
        footer.appendChild(deleteAccountButton);
    }
    
    if (isLoggedIn) {
        const username = auth.getCurrentUser();
        document.getElementById('welcomeMessage').textContent = `Welcome, ${username}!`;
        document.getElementById('logoutButton').addEventListener('click', () => {
            auth.logout();
            updateHeaderBar();
            window.location.href = 'index.html';
        });
        document.getElementById('deleteAccountButton').addEventListener('click', () => {
            const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            if (confirmation) {
                const users = auth.loadUsers();
                delete users[username];
                auth.users = users;
                auth.saveUsers();
                auth.logout();
                updateHeaderBar();
                alert('Your account has been deleted.');
                window.location.href = 'index.html';
            }
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
