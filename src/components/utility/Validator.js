
import axios from 'axios';
import settings from '../../config';

export const isEmailFormatOK = (email) => {
    return (email.replace(/^\s+|\s+$/g, '').match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ? true : false);
}

export function validateJWT(id_token) {
    // TODO ajax call required
    console.log('validateJWT: ' + id_token);
    axios.post(settings.serverUrl + '/api/post/JWT/validate', {
        token: id_token,
    })
        .then(function (response) {
            let userInfo = response.data.userInfo;
            if (userInfo) {
                return { result: true, userInfo: userInfo }
            }
            else {
                return { result: false }
            }
        })
        .catch(function (error) {
            // TODO: show error message and guide user to re submit
            console.error(error);
            return { result: false }
        });

}

export const strip = (str) => {
    if (str) {
        return str.replace(/^\s+|\s+$/g, '');
    } else {
        return '';
    }

}