import { poolData } from './config.js';
import { showForm, showDashboard } from './ui.js';

// Helper function for email validation
function isValidEmail(email) {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Authentication Functions
export function signUp(email, password) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!password || password.length < 6) return alert("Password must be at least 6 characters.");
    
    const attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })];
    console.log("SignUp Request:", { email, password });
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
    console.log("ConfirmSignUp Request:", { email, code });
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

export async function signIn(email, password) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!password) return alert("Please enter a password.");

    const endpoint = "https://cognito-idp.us-east-1.amazonaws.com/"; // Fixed endpoint
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
        },
        body: JSON.stringify({
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            },
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: poolData.ClientId // Uses your ClientId: 76ktoitqul8pbcgn6c69kgvn94
        })
    };

    console.log("SignIn Request:", { email, password, ClientId: poolData.ClientId });
    try {
        const response = await fetch(endpoint, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.AuthenticationResult) {
            console.log("SignIn Success:", data.AuthenticationResult);
            localStorage.setItem("userEmail", email);
            showDashboard();
        } else {
            throw new Error(data.message || "Login failed: No authentication result.");
        }
    } catch (error) {
        console.error("SignIn Error:", error);
        alert(error.message || "Login failed.");
    }
}

export function forgotPassword(email) {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    console.log("ForgotPassword Request:", { email });
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
    console.log("ConfirmPasswordReset Request:", { email, code, newPassword });
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