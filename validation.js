const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const route = express.Router();
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const USER_POOL_ID="ap-south-1_U7F0IV0dC";
const CLIENT_ID="7juctakrfomj8jujfs74oe1slp";

const verifier = CognitoJwtVerifier.create({
    userPoolId: USER_POOL_ID,
    tokenUse: "access",
    clientId: CLIENT_ID,
});

async function verifyToken(res,data){
    try{
        const payload = await verifier.verify(
            data.access
        );
        res.status(200).send(payload);
    } catch(e) {
        console.log("Token not valid!",e);
        res.status(401).send(e);
    }
}

async function refreshTokens(response,data){
    fetch("https://cognito-idp.ap-south-1.amazonaws.com/", {
        headers: {
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
            "Content-Type": "application/x-amz-json-1.1",
        },
        mode: 'cors',
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify({
            ClientId: CLIENT_ID,
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            AuthParameters: {
                REFRESH_TOKEN: data.refresh,
                //SECRET_HASH: "your_secret", // In case you have configured client secret
            }
        }),
    }).then((res) => {
        res.json().then((output)=>{
            response.status(200).send(output);
        }).catch((error)=>{
            console.log("Cant convert into json",error);
            response.status(401).send(error);
        })
    }).catch((e)=>{
        console.log("Fetch Failed",e);
        response.status(401).send(e);
    });
}

route.post('/token', (req, res) => {
    let data = req.body;
    verifyToken(res,data);
})

route.post('/refresh',(req,res)=>{
    let data=req.body;
    refreshTokens(res,data);
})

module.exports = route;
