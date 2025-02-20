import { signUp, confirmSignUp, signIn, forgotPassword, confirmPasswordReset, signOut } from './auth.js';
import { showForm, showDashboard } from './ui.js';

export function setupEventListeners() {
    // Navigation Buttons
    document.getElementById("show-login").addEventListener("click", () => showForm("login-container"));
    document.getElementById("show-signup").addEventListener("click", () => showForm("signup-container"));
    document.getElementById("show-confirm").addEventListener("click", () => showForm("confirm-container"));
    document.getElementById("show-reset").addEventListener("click", () => showForm("reset-container"));

    // Action Buttons
    document.getElementById("signup-button").addEventListener("click", function() {
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        signUp(email, password);
    });

    document.getElementById("confirm-button").addEventListener("click", function() {
        const email = document.getElementById("confirm-email").value;
        const code = document.getElementById("confirm-code").value;
        confirmSignUp(email, code);
    });

    document.getElementById("login-button").addEventListener("click", function() {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        signIn(email, password);
    });

    document.getElementById("send-reset-code").addEventListener("click", function() {
        const email = document.getElementById("reset-email").value;
        forgotPassword(email);
    });

    document.getElementById("confirm-reset").addEventListener("click", function() {
        const email = document.getElementById("reset-email").value;
        const code = document.getElementById("reset-code").value;
        const newPassword = document.getElementById("new-password").value;
        confirmPasswordReset(email, code, newPassword);
    });

    document.getElementById("logout-button").addEventListener("click", signOut);
}

export function initialize() {
    if (localStorage.getItem("userEmail")) {
        showDashboard();
    } else {
        showForm("login-container");
    }
}