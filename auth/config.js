// Cognito User Pool Configuration
export const poolData = {
    UserPoolId: "us-east-1_E54lek6Y7",
    ClientId: "76ktoitqul8pbcgn6c69kgvn94"
};

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);