import express from 'express';
import base64url from "base64url";
import cors from 'cors';

import {
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
  generateRegistrationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
  generateAuthenticationOptions,
  GenerateAuthenticationOptionsOpts
} from '@simplewebauthn/server';
import { verifyAuth } from './verfifyAuth';

const app = express();
const port = 8080;

app.use(express.json());

export const rpID = 'localhost';

app.use(cors())
export const users: any = {};

export const origin = `http://${rpID}:3000`;

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.post("/registration-options", async (req, res) =>{

    const options: GenerateRegistrationOptionsOpts = {
        rpName: 'Fernando POC',
        rpID,
        userID: req.body.email,
        userName: req.body.email,
        timeout: 60000,
        attestationType: 'none',
      
        authenticatorSelection: {
            userVerification: 'required', 
            residentKey: 'required',
        },
        supportedAlgorithmIDs: [-7, -257],
    };

    const regOptions = await generateRegistrationOptions(options)
    const user = {
        email: req.body.email,
        currentChallenge: regOptions.challenge,
    }
    console.log('user', user)
    users[user.email] = user;
    console.log('users', users)
    res.send(regOptions);
});

app.post("/registration-verification", async (req, res) => {

    const user = users[req.body.email];
    const data = req.body.data;
  
    const expectedChallenge = user.currentChallenge;
  
    let verification;
    try {
      const options: VerifyRegistrationResponseOpts = {
        response: data,
        expectedChallenge: `${expectedChallenge}`,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: true,
      };
      verification = await verifyRegistrationResponse(options);
    } catch (error) {
        console.log(error);
      return res.status(400).send({ error: 'error!!' });
    }
  
    const { verified, registrationInfo } = verification;
  
    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;
  
      const existingDevice = user.devices ? user.devices.find(
        device => new Buffer(device.credentialID.data).equals(credentialID)
      ) : false;
  
      if (!existingDevice) {
        const newDevice = {
          credentialPublicKey,
          credentialID,
          counter,
          transports: data.transports,
        };
        if (user.devices==undefined) {
            user.devices = [];
        }
        user.webauthn = true;
        user.devices.push(newDevice);
      }
    }

    console.log(JSON.stringify(user, null, 2))
  
    res.send({ ok: true });

});

app.post("/auth-options", (req, res) =>{

    const options: GenerateAuthenticationOptionsOpts = {
        timeout: 60000,
        allowCredentials: [],
        userVerification: 'required',
        rpID,
    };
    const loginOpts = generateAuthenticationOptions(options);

    const user = users[req.body.email];
    user.currentChallenge = loginOpts.challenge;
    
    res.send(loginOpts);
});

app.post("/auth-verification", async (req, res) => {

    const result = await verifyAuth({
        req, res
    })
  
    if (result.verified) {
        return res.send({ ok: true });
    } else {
        return res.status(400).send({ ok: false });
    }

});

app.post('/payments', async (req, res) => {
    const result = await verifyAuth({
        req, res
    })

    if (result.verified) {
      // do the payment here 
      // something like:
      // const payment = await makePayment()
      // if (payment.success) {
      //   return res.send({ ok: true });
      // }
        return res.send({ ok: true });
    } 
        return res.status(400).send({ ok: false });
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});