/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import AWS, { Config, CognitoIdentityCredentials } from 'aws-sdk';
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import AppConfig from '../../configuration/AppConfig';

const userPool = new CognitoUserPool({
  UserPoolId: AppConfig.UserPools.id,
  ClientId: AppConfig.UserPools.web_client_id
});
let cognitoUser = null;

/**********************
 * Login methods *
 **********************/
function check(error) {
    const err = error.toString();
    if (/InvalidParameterException: Missing required parameter USERNAME$/.test(err)
    || (/UserNotFoundException?/.test(err))
    || (/NotAuthorizedException?/.test(err))) {
        return {
            invalidCredentialsMessage: 'Please enter valid username and Password.',
        }
    } else if (/CodeMismatchException: Invalid code or auth state for the user.$/.test(err)) {
        return {
            invalidCredentialsMessage: 'Invalid Verification Code',
        }
    } else if (/InvalidParameterException: Missing required parameter SMS_MFA_CODE$/.test(err)) {
        return {
            invalidCredentialsMessage: 'Verficiation code can not be empty',
        }
    }
}

const loginCallbackFactory = function(callbacks, ctx) {
    return {
        onSuccess: (result) => {
            console.log('result: ', result);
            const loginCred = 'cognito-idp.' + AppConfig.Cognito.region + '.amazonaws.com/' + AppConfig.UserPools.id;

            let Login = {};
            Login[loginCred] = result.getIdToken().getJwtToken();

            AWS.config.credentials = new AWS.CognitoIdentityCredentials(
                {
                    IdentityPoolId: AppConfig.Cognito.identity_pool_id,
                    Logins: Login
                },
                {
                    region: AppConfig.Cognito.region
                }
            );

            AWS.config.credentials.get((error) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
                const awsCredentials = {
                    accessKeyId,
                    secretAccessKey,
                    sessionToken
                };
                sessionStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));
                sessionStorage.setItem('identityId', AWS.config.credentials.identityId);
                sessionStorage.setItem('isLoggedIn', true);

                callbacks.onSuccess.call(ctx, {
                    logInStatus: true,
                    verificationCode: ''
                });
            });
        },

        onFailure: (error) => {
            console.log(error.toString());
            let displayError = check(error);
            callbacks.onFailure.call(ctx, displayError);
        },

        mfaRequired: (codeDeliveryDetails) => {
            callbacks.mfaRequired.call(ctx);
        }
    }
}

function handleSignIn(username, password, callbacks){
    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
    });
    cognitoUser = new CognitoUser({
        Username: username,
        Pool : userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, callbacks);
}

function sendMFAVerificationCode(code, callbacks) {
    const result = cognitoUser.sendMFACode(code, callbacks);
    console.log("MFA Verification Code sent");
}

/**********************
 * Registartion methods *
 **********************/

function checkRegistrationError(error) {
    const err = error.toString();
    if (/UsernameExistsException: User already exists$/.test(err)) {
        return 'User already exists';
    } else if (/InvalidParameterException?/.test(err)) {
        return 'Password must contain atleast 8 characters';
    } else if (/InvalidPasswordException?/.test(err)) {
        return 'Password must contain atleast 8 characters, one lowercase, uppercase, numeric and special character';
    }
}

function handleNewCustomerRegistration(username,password, email, phone, registerCallBack) {
    const attributeList = [];
    const attributeEmail = new CognitoUserAttribute(email);
    const attributePhone = new CognitoUserAttribute(phone);

    if (email.Value) {
        attributeList.push(attributeEmail);
    }
    if (phone.Value) {
        attributeList.push(attributePhone);
    }

    userPool.signUp(username, password, attributeList, null, registerCallBack);
}

function handleSubmitVerificationCode(username ,verificationCode, verificationCallback) {
    cognitoUser = new CognitoUser({
        Username: username,
        Pool : userPool
    });
    cognitoUser.confirmRegistration(verificationCode, true, verificationCallback);
}

function handleResendVerificationCode(username, resendCodeCallback){
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });
    cognitoUser.resendConfirmationCode(resendCodeCallback);
}

/*************************
 * Forgot Password methods *
 *************************/
const forgotPasswordFactoryCallback = function(forgotPasswordCallBack, ctx){
    return {
        onSuccess: () => {
            console.log('Password reset successful');
            forgotPasswordCallBack.onSuccess.call(ctx,{
                resetSuccess: true
            });
        },
        onFailure: (err) => {
            console.log(err.toString());
            let invalidCodeOrPasswordMessage = checkResetPasswordError(err.toString());
            forgotPasswordCallBack.onFailure.call(ctx, invalidCodeOrPasswordMessage);
        },
        inputVerificationCode: (data) => {
            forgotPasswordCallBack.inputVerificationCode.call(ctx);
        }
    }
}

function checkResetPasswordError(error) {

    if ((/UserNotFoundException?/.test(error))
    || (/InvalidParameterException: Cannot reset password for the user as there is no registered?/.test(error))) {
        return {invalidCodeOrPasswordMessage: 'Invalid username'};
    } else if (/LimitExceededException: Attempt limit exceeded, please try after some time?/.test(error)) {
        return {invalidCodeOrPasswordMessage: 'Attempt limit exceeded, please try again later'};
    } else if (/CodeMismatchException?/.test(error)) {
        return {invalidCodeOrPasswordMessage: 'Invalid Verfication Code'};
    } else if (/InvalidParameterException: Cannot reset password for the user as there is no registered\/verified email or phone_number?$/.test(error)){
        return {invalidCodeOrPasswordMessage:'Cannot reset password for the user as there is no registered\/verified email or phone_number'};
    } else if ((/InvalidParameterException?/.test(error))||(/InvalidPasswordException?$/.test(error))) {
        return {invalidCodeOrPasswordMessage: 'Password must contain 8 or more characters with atleast one lowercase,uppercase, numerical and special character'}
    }
}

function handleForgotPassword(username, forgotPasswordCallBack) {
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool:userPool
    });
    cognitoUser.forgotPassword(forgotPasswordCallBack);
}

function handleForgotPasswordReset(username, verificationCode, newPassword, forgotPasswordCallBack){
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });
    cognitoUser.confirmPassword(verificationCode, newPassword,forgotPasswordCallBack);
}

/*****************
 * SignOut methods *
 *****************/
function handleSignOut(){
    const userPool = new CognitoUserPool({
        UserPoolId : AppConfig.UserPools.id, // Your user pool id here
        ClientId :  AppConfig.UserPools.web_client_id // Your client id here
    });
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    sessionStorage.setItem('isLoggedIn', false);
}

export {
    handleSignIn,
    loginCallbackFactory,
    sendMFAVerificationCode,
    handleResendVerificationCode,
    handleSubmitVerificationCode,
    checkRegistrationError,
    handleNewCustomerRegistration,
    forgotPasswordFactoryCallback,
    handleForgotPassword,
    handleForgotPasswordReset,
    handleSignOut
};
