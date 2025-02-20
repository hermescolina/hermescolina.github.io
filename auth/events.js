import { signUp, confirmSignUp, signIn, forgotPassword, confirmPasswordReset, signOut } from './auth.js';
import { showPage, showForm, showDashboard } from './ui.js';

export function setupEventListeners() {
    // Landing Page Navigation
    document.getElementById("show-login").addEventListener("click", () => {
        showPage("auth-container");
        showForm("login-container");
    });
    document.getElementById("show-signup").addEventListener("click", () => {
        showPage("auth-container");
        showForm("signup-container");
    });

    // Auth Navigation
    document.getElementById("back-to-landing").addEventListener("click", () => showPage("landing-page"));
    document.getElementById("show-login-form").addEventListener("click", () => showForm("login-container"));
    document.getElementById("show-signup-form").addEventListener("click", () => showForm("signup-container"));
    document.getElementById("show-confirm-form").addEventListener("click", () => showForm("confirm-container"));
    document.getElementById("show-reset-form").addEventListener("click", () => showForm("reset-container"));

    // Action Buttons
    document.getElementById("signup-button").addEventListener("click", function() {
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        console.log("SignUp Triggered:", { email, password });
        signUp(email, password);
    });

    document.getElementById("confirm-button").addEventListener("click", function() {
        const email = document.getElementById("confirm-email").value;
        const code = document.getElementById("confirm-code").value;
        console.log("ConfirmSignUp Triggered:", { email, code });
        confirmSignUp(email, code);
    });

    document.getElementById("login-button").addEventListener("click", function() {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        console.log("SignIn Triggered:", { email, password });
        signIn(email, password);
    });

    document.getElementById("send-reset-code").addEventListener("click", function() {
        const email = document.getElementById("reset-email").value;
        console.log("ForgotPassword Triggered:", { email });
        forgotPassword(email);
    });

    document.getElementById("confirm-reset").addEventListener("click", function() {
        const email = document.getElementById("reset-email").value;
        const code = document.getElementById("reset-code").value;
        const newPassword = document.getElementById("new-password").value;
        console.log("ConfirmPasswordReset Triggered:", { email, code, newPassword });
        confirmPasswordReset(email, code, newPassword);
    });

    document.getElementById("logout-button").addEventListener("click", () => {
        console.log("SignOut Triggered");
        signOut();
    });
}

export function initialize() {
    if (localStorage.getItem("userEmail")) {
        console.log("Initializing with existing session:", localStorage.getItem("userEmail"));
        showDashboard();
    } else {
        console.log("Initializing with landing page");
        showPage("landing-page");
    }
}