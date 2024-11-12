function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
        localStorage.removeItem('userEmail');
        window.location.href = "LoginForm.html"; 
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}
