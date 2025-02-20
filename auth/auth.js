import { userPool } from './config.js';
import { showForm, showDashboard } from './ui.js';

// Helper function for basic email validation
function isValidEmail(email) {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Authentication Functions
export function signUp(email, password) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!password || password.length < 6) return alert("Password must be at least 6 characters.");
    
    const attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })];
    console.log("SignUp Request:", { email, password }); // Debugging
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
            console.error("SignUp Error:", err);
            return alert(err.message || "Signup failed.");
        }
        console.log("SignUp Success:", result);
        alert("Signup successful! Check your email for the confirmation code.");
        showForm("confirm-container");
    });
}

export function confirmSignUp(email, code) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!code || code.trim() === "") return alert("Please enter a confirmation code.");
    
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    console.log("ConfirmSignUp Request:", { email, code }); // Debugging
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
            console.error("ConfirmSignUp Error:", err);
            return alert(err.message || "Confirmation failed.");
        }
        console.log("ConfirmSignUp Success:", result);
        alert("Account confirmed! You can now log in.");
        showForm("login-container");
    });
}

export function signIn(email, password) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!password) return alert("Please enter a password.");
    
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    console.log("SignIn Request:", { email, password }); // Debugging
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.log("SignIn Success:", result);
            localStorage.setItem("userEmail", email);
            showDashboard();
        },
        onFailure: function(err) {
            console.error("SignIn Error:", err);
            alert(err.message || "Login failed.");
        },
    });
}

export function forgotPassword(email) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    console.log("ForgotPassword Request:", { email }); // Debugging
    cognitoUser.forgotPassword({
        onSuccess: () => {
            console.log("ForgotPassword Success");
            alert("Reset code sent! Check your email.");
            showForm("reset-container");
        },
        onFailure: (err) => {
            console.error("ForgotPassword Error:", err);
            alert(err.message || "Failed to send reset code.");
        }
    });
}

export function confirmPasswordReset(email, code, newPassword) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!code || code.trim() === "") return alert("Please enter a reset code.");
    if (!newPassword || newPassword.length < 6) return alert("New password must be at least 6 characters.");
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    console.log("ConfirmPasswordReset Request:", { email, code, newPassword }); // Debugging
    cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
            console.log("ConfirmPasswordReset Success");
            alert("Password reset successful! You can now log in.");
            showForm("login-container");
        },
        onFailure: (err) => {
            console.error("ConfirmPasswordReset Error:", err);
            alert(err.message || "Password reset failed.");
        }
    });
}

export function signOut() {
    localStorage.removeItem("userEmail");
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("auth-container").style.display = "block";
    showForm("login-container");
}