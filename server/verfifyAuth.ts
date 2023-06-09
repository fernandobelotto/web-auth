import base64url from "base64url";
import { origin, rpID, users } from ".";
import { VerifyAuthenticationResponseOpts, verifyAuthenticationResponse } from "@simplewebauthn/server";

export async function verifyAuth({req, res}) {
    const data = req.body.data;

    const user = users[req.body.email];
    
    if (user==null) {
        // return res.status(400).send({ok: false});
        return {
            verified: false,
        }
    } 
  
    const expectedChallenge = user.currentChallenge;
  
    let dbAuthenticator;
    const bodyCredIDBuffer = base64url.toBuffer(data.rawId);

    for (const dev of user.devices) {
      const currentCredential = Buffer.from(dev.credentialID);
      if (bodyCredIDBuffer.equals(currentCredential)) {
        dbAuthenticator = dev;
        break;
      }
    }

    if (!dbAuthenticator) {
      // return res.status(400).send({ ok: false, message: 'Authenticator is not registered with this site' });
      return {
        verified: false,
      }
    }
  
    let verification;
    try {
      const options: VerifyAuthenticationResponseOpts  = {
        response: data,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: dbAuthenticator,
      };
      verification = await verifyAuthenticationResponse(options);
    } catch (error) {
      console.log(error)
      // return res.status(400).send({ ok: false, message: 'hey' });
      return {
        verified: false,
      }
    }
  
    const { verified, authenticationInfo } = verification;
    return {
        verified,
        authenticationInfo,
    }
}