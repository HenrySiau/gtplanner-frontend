export const isEmailFormatOK = (email) =>{
    return(email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)? true : false);
}

// export function validateJWT(id_token) {
//     // TODO ajax call required
//     console.log('validateJWT: ' + id_token);
//     return function (dispatch) {
//         axios.post(settings.serverUrl + '/api/post/JWT/validate', {
//             token: id_token,
//         })
//             .then(function (response) {
//                 let userInfo = response.data.userInfo;
//                 if (userInfo) {
//                     dispatch(updateUserInfo())
//                     dispatch(loginWithToken(id_token));
//                 }
//                 else{
//                     // invalid JWT
//                 }
//             })
//             .catch(function (error) {
//                 // TODO: show error message and guide user to re submit
//                 console.error(error);
//                 dispatch(snackbarMessage('email or password incorrect'));
//             });

//         // dispatch(loginWithToken(id_token));
//     }
// }

// export default {
//     emailFormatOK: emailFormatOK
// }