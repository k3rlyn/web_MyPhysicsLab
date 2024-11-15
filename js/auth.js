const API_URL = 'http://localhost:5000/api';  // sesuai dengan server yang sudah running

// Fungsi utilitas untuk menampilkan pesan
function showMessage(type, message) {
    const existingMessage = document.querySelector(`.${type}-message`);
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.auth-form');
    form.appendChild(messageDiv);
}

// Fungsi untuk menampilkan error
function showError(message) {
    showMessage('error', message);
}

// Fungsi untuk menampilkan sukses
function showSuccess(message) {
    showMessage('success', message);
}

// Fungsi auth check yang digunakan di semua halaman
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Update UI berdasarkan status login
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');
    
    if (token && user) {
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            const userName = document.getElementById('userName');
            if (userName) userName.textContent = user.name;
        }
    } else {
        if (authLinks) authLinks.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        
        // Redirect ke login jika di halaman terproteksi
        const restrictedPages = ['materials.html', 'quiz.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (restrictedPages.includes(currentPage)) {
            window.location.href = '/pages/auth/login.html';
        }
    }
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Simpan token dan data user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect setelah login
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } catch (error) {
            showError(error.message);
        }
    });
}

// Handle Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/auth/login.html';
}

// Handle Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validasi password
        if (password !== confirmPassword) {
            showError('Password tidak cocok');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }

            showSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
            
            // Redirect ke halaman login setelah 2 detik
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            showError(error.message);
        }
    });
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/auth/login.html';
}

// Export fungsi yang dibutuhkan
window.checkAuth = checkAuth;
window.logout = logout;


// Fungsi untuk mengecek akses halaman terproteksi
const checkProtectedPage = () => {
    const token = localStorage.getItem('token');
    const restrictedPages = ['materials.html', 'quiz.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (restrictedPages.includes(currentPage) && !token) {
        alert('Silakan login terlebih dahulu untuk mengakses halaman ini');
        window.location.href = '/pages/auth/login.html';
        return false;
    }
    return true;
};

// Handle klik pada konten terproteksi
const handleRestrictedClick = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
        e.preventDefault();
        const confirmLogin = confirm('Anda harus login terlebih dahulu untuk mengakses konten ini. Apakah Anda ingin login sekarang?');
        if (confirmLogin) {
            window.location.href = '/pages/auth/login.html';
        }
        return false;
    }
    return true;
};

// Initialize auth check when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Add listeners to restricted content
    const restrictedLinks = document.querySelectorAll('.restricted-content a, a.restricted-content');
    restrictedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const token = localStorage.getItem('token');
            if (!token) {
                e.preventDefault();
                const confirmLogin = confirm('Anda harus login terlebih dahulu. Login sekarang?');
                if (confirmLogin) {
                    sessionStorage.setItem('redirectAfterLogin', link.href);
                    window.location.href = '/pages/auth/login.html';
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Cek status halaman terproteksi
    checkProtectedPage();
    
    // Tambahkan event listener ke semua link terproteksi
    const restrictedLinks = document.querySelectorAll('.restricted-content a, a.restricted-content');
    restrictedLinks.forEach(link => {
        link.addEventListener('click', handleRestrictedClick);
    });
});
// cek koneksi frontend dengan backend api
async function testConnection() {
    try {
        const response = await fetch(`${API_URL}/auth/login`);
        console.log('API Connection Test:', response.ok ? 'Connected' : 'Failed');
    } catch (error) {
        console.error('API Connection Error:', error);
    }
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    testConnection();
});

// Tambah status koneksi API ke halaman
async function checkAPIStatus() {
    const statusElement = document.createElement('div');
    statusElement.id = 'api-status';
    document.body.appendChild(statusElement);

    try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            statusElement.textContent = 'API Connected';
            statusElement.style.color = 'green';
        } else {
            statusElement.textContent = 'API Error';
            statusElement.style.color = 'red';
        }
    } catch (error) {
        statusElement.textContent = 'API Not Connected';
        statusElement.style.color = 'red';
        console.error('API Connection Error:', error);
    }
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    checkAPIStatus();
});

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/auth/login.html';
}