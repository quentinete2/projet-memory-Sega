document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = auth.register(username, email, password);
    
    const messageDiv = document.getElementById('message');
    if (result.success) {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'green';
        document.getElementById('registerForm').reset();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    } else {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'red';
    }
});
