let connect = false;

function updateHeaderBar() {
    const header = document.querySelector('header');
    const existingBar = document.querySelector('.header-bar');
    if (existingBar) {
        existingBar.remove();
    }   
    let templateId = connect ? 'header-bar-connect-true' : 'header-bar-connect-false';
    const template = document.getElementById(templateId);
    const headerBar = template.content.cloneNode(true);
    header.appendChild(headerBar);
    if (connect) {
        document.getElementById('logoutButton').addEventListener('click', () => {
            connect = false;
            updateHeaderBar();
        });
    } else {
        document.getElementById('loginButton').addEventListener('click', () => {
            let templateId = 'Login';
            const template = document.getElementById(templateId);
            const loginForm = template.content.cloneNode(true);
            document.body.appendChild(loginForm);
            document.querySelector('.header-bar').remove();

            if (document.getElementById('closeLogin')) {
                document.getElementById('closeLogin').addEventListener('click', () => {
                    document.querySelector('.login-container').remove();
                });
            }
        });
        document.getElementById('registerButton').addEventListener('click', () => {
            connect = none;
            updateHeaderBar();
        });
    }   
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderBar();
});
