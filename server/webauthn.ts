// Finally, we add these endpoints to API.js

// webAuthn: {
//     loginOptions: async (email) => {
//         return await API.makePostRequest(API.endpoint + "webauth-login-options", { email });
//     },
//     loginVerification: async (email, data) => {
//         return await API.makePostRequest(API.endpoint + "webauth-login-verification", {
//             email,
//             data
//         });                       
//     },
//     registrationOptions: async () => {
//         return await API.makePostRequest(API.endpoint + "webauth-registration-options", Auth.account);           
//     },
//     registrationVerification: async (data) => {
//         return await API.makePostRequest(API.endpoint + "webauth-registration-verification", {
//             user: Auth.account,
//             data
//         });                       
//     }
// },