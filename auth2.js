// Define your Cognito pool configuration
const poolData = {
    UserPoolId: "us-east-1_E54lek6Y7", 
    ClientId: "76ktoitqul8pbcgn6c69kgvn94"
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// SignUp function
function signUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) return alert(err.message);
        alert("Signup successful! Check your email for the confirmation code.");
    });
}

// Confirm SignUp function
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

// SignIn function
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

// Show Dashboard
function showDashboard() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("user-info").innerText = "Logged in as: " + localStorage.getItem("userEmail");
}

// Logout function
function signOut() {
    localStorage.removeItem("userEmail");
    location.reload();
}
