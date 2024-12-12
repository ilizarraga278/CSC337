document.addEventListener('DOMContentLoaded',()=>{
    const loginButton = document.getElementById('login');
    const createProfileButton = document.getElementById('create_profile');
    loginButton.addEventListener('click',() =>{
        window.location.href = 'welcome_back.html';
    });

    createProfileButton.addEventListener('click',() =>{
        window.location.href = 'info_fields.html';
    });
})