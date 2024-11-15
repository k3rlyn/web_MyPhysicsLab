// js/protectedRoute.js
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    
    // Daftar path yang memerlukan autentikasi
    const protectedPaths = [
        '/pages/materials.html',
        '/pages/quiz.html',
        '/materials.html',
        '/quiz.html'
    ];
    
    // Cek apakah halaman saat ini adalah halaman terproteksi
    const isProtectedPage = protectedPaths.some(path => 
        currentPath.includes(path.toLowerCase())
    );
    
    if (isProtectedPage && !token) {
        // Simpan halaman yang dicoba diakses
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        // Redirect ke halaman login
        window.location.href = '/pages/auth/login.html';
        return false;
    }
    
    return true;
};

// Jalankan pengecekan segera saat script dimuat
const authStatus = checkAuth();
if (!authStatus) {
    // Hentikan loading halaman jika autentikasi gagal
    document.body.innerHTML = '';
}

// Export untuk digunakan di file lain
window.checkAuth = checkAuth;