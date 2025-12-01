document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const result = auth.login(username, password);
    
    const messageDiv = document.getElementById('message');
    if (result.success) {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'green';
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 500);
    } else {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'red';
    }
});
