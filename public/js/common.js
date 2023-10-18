const theme = localStorage.getItem('theme');
if (theme === null && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
} else if (theme === "dark") {
    document.documentElement.setAttribute('data-theme', 'dark');
}


const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);    
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}
toggleSwitch.addEventListener('change', switchTheme, false);

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function isAuthenticated() {
    return true
}

function registerUser() {
    let id = localStorage.getItem('user_id')
    if (id) {
        fetch(`/api/v1/auth/user/count/${id}`)    
        return id
    }
    localStorage.setItem('user_id', `${Date.now()}-${Math.floor(Math.random() * 1000000000000000)}`)
    id = localStorage.getItem('user_id')

    fetch(`/api/v1/auth/user/count/${id}`)  

    return id
}

function onLoad() {
    registerUser()
}

onLoad()