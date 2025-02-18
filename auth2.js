const poolData = {
    UserPoolId: "us-east-1_E54lek6Y7", 
    ClientId: "76ktoitqul8pbcgn6c69kgvn94"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Show Signup Form
function showSignUp() {
    hideAll();
    document.getElementById("signup-container").style.display = "block";
}

// Show Login Form
function showLogin() {
    hideAll();
    document.getElementById("login-container").style.display = "block";
}

// Show Reset Password Form
function showResetPassword() {
    hideAll();
    document.getElementById("reset-container").style.display = "block";
}

// Hide All Forms
function hideAll() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("login-container").style.display = "none";
    document.getElementById("reset-container").style.display = "none";
    document.getElementById("dashboard").style.display = "none";
}

function signUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })];
    
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) return alert(err.message);
        alert("Signup successful! Check your email for the confirmation code.");
    });
}

function confirmSignUp() {
    const email = document.getElementById("signup-email").value;
    const code = document.getElementById("confirm-code").value;
    
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) return alert(err.message);
        alert("Account confirmed! You can now log in.");
    });
}

async function signIn() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    const response = await fetch("https://cognito-idp.us-east-1.amazonaws.com/", {
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
            ClientId: poolData.ClientId
        })
    });
    
    const data = await response.json();
    if (data.AuthenticationResult) {
        localStorage.setItem("userEmail", email);
        showDashboard();
    } else {
        alert("Login failed: " + (data.message || "Unknown error"));
    }
}

function forgotPassword() {
    const email = document.getElementById("reset-email").value;
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    
    cognitoUser.forgotPassword({
        onSuccess: () => alert("Reset code sent! Check your email."),
        onFailure: (err) => alert(err.message)
    });
}

function confirmPasswordReset() {
    const email = document.getElementById("reset-email").value;
    const code = document.getElementById("reset-code").value;
    const newPassword = document.getElementById("new-password").value;
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });
    
    cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => alert("Password reset successful! You can now log in."),
        onFailure: (err) => alert(err.message)
    });
}

function signOut() {
    localStorage.removeItem("userEmail");
    location.reload();
}

function showDashboard() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("user-info").innerText = "Logged in as: " + localStorage.getItem("userEmail");
}

// Check if the user is already logged in when the page loads
window.onload = function() {
    if (localStorage.getItem("userEmail")) {
        showDashboard();
    } else {
        showLogin(); // Show the login form by default
    }
};
