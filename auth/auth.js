import { userPool } from './config.js';
import { showForm, showDashboard } from './ui.js';

// Authentication Functions
export function signUp(email, password) {
    const attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) return alert(err.message);
        alert("Signup successful! Check your email for the confirmation code.");
        showForm("confirm-container");
    });
}

export function confirmSignUp(email, code) {
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) return alert(err.message);
        alert("Account confirmed! You can now log in.");
        showForm("login-container");
    });
}

export function signIn(email, password) {
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            localStorage.setItem("userEmail", email);
            showDashboard();
        },
        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

export function forgotPassword(email) {
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.forgotPassword({
        onSuccess: () => {
            alert("Reset code sent! Check your email.");
            showForm("reset-container");
        },
        onFailure: (err) => alert(err.message)
    });
}

export function confirmPasswordReset(email, code, newPassword) {
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
            alert("Password reset successful! You can now log in.");
            showForm("login-container");
        },
        onFailure: (err) => alert(err.message)
    });
}

export function signOut() {
    localStorage.removeItem("userEmail");
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("auth-container").style.display = "block";
    showForm("login-container");
}