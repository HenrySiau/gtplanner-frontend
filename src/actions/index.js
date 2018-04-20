import axios from 'axios';
import settings from '../config';
import { push } from 'react-router-redux';
import { LOG_IN, LOG_OUT, TOGGLE_DRAWER, SNACKBAR_OPEN, SNACKBAR_CLOSE, SET_SNACKBAR_MESSAGE, UPDATE_SELECTED_TRIP } from './actionTypes';
import { SET_INVITE_CODE, REMOVE_INVITE_CODE, UPDATE_RECENT_TRIPS, TOGGLE_CHAT_ROOM_OPEN, CHAT_ROOM_OPEN, CHAT_ROOM_CLOSE } from './actionTypes';
import { DRAWER_EXTEND, DRAWER_FOLD, UPDATE_USER_INFO } from './actionTypes';

const login = () => ({ type: LOG_IN });

export function loginWithToken(id_token) {
    localStorage.setItem('id_token', id_token);
    return function (dispatch) {
        dispatch(login());
        dispatch(fetchRecentTrips());
    }
};

export function loginWithPassword(email, password, inviteCode, fetchDefaultTrip) {
    return function (dispatch) {
        axios.post(settings.serverUrl + '/api/post/signin', {
            email: email,
            password: password,
            inviteCode: inviteCode
        })
            .then(function (response) {
                let id_token = response.data.token;
                if (id_token) {
                    dispatch(loginWithToken(id_token));
                    // if there is no selected Trip
                    // fetch the default Trip
                    // if there is a selected Trip from joining a trip do not fetch trip
                    if (fetchDefaultTrip) {
                        dispatch(updateSelectedTrip(null));
                    }
                    dispatch(push('/dashboard'));
                }
            })
            .catch(function (error) {
                // TODO: show error message and guide user to re submit
                console.error(error);
                dispatch(snackbarMessage('email or password incorrect'));
            });
    }
};

export function loginWithFacebook(userName, email, phoneNumber, profilePictureURL, accessToken, inviteCode, fetchDefaultTrip) {
    return function (dispatch) {
        axios.post(settings.serverUrl + '/api/post/login/facebook', {
            userName: userName,
            email: email,
            accessToken: accessToken,
            inviteCode: inviteCode,
        })
            .then(function (response) {
                let id_token = response.data.token;
                if (id_token) {
                    dispatch(loginWithToken(id_token));
                    dispatch(updateUserInfo(response.data.userId, userName, email, phoneNumber, profilePictureURL))
                    // if there is no selected Trip
                    // fetch the default Trip
                    // if there is a selected Trip from joining a trip do not fetch trip
                    if (fetchDefaultTrip) {
                        dispatch(updateSelectedTrip(null));
                    }
                    dispatch(push('/dashboard'));
                }
            })
            .catch(function (error) {
                // TODO: show error message and guide user to re submit
                console.error(error);
                dispatch(snackbarMessage('something went wrong'));
            });
    }
};

export function updateSelectedTrip(tripId) {
    console.log('update selected trip');
    return function (dispatch) {
        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/trip',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            params: {
                tripId: tripId
            }
        })
            .then(function (response) {
                // TODO: Redirect to create my first trip
                if (response.data.tripInfo) {
                    let tripInfo = response.data.tripInfo;
                    dispatch(updateSelectedTripWithInfo(tripInfo));
                }
            })
            .catch(function (error) {
                // TODO: show error message and guide user to re submit
                console.error(error);
            });
    }
};

export const updateSelectedTripWithInfo = (tripInfo) => (
    {
        type: UPDATE_SELECTED_TRIP,
        tripId: tripInfo.tripId,
        title: tripInfo.title,
        description: tripInfo.description,
        owner: tripInfo.owner,
        members: tripInfo.members,
        startDate: tripInfo.startDate,
        endDate: tripInfo.endDate,
        invitationCode: tripInfo.invitationCode
    }
)
export function logout() {
    localStorage.removeItem('id_token');
    return {
        type: LOG_OUT
    }
};

export const toggleDrawer = () => ({ type: TOGGLE_DRAWER });
export const toggleDrawerExtend = () => ({ type: DRAWER_EXTEND });
export const toggleDrawerFold = () => ({ type: DRAWER_FOLD });

export const toggleChatRoomOpen = () => ({ type: TOGGLE_CHAT_ROOM_OPEN });
export const closeChatRoom = () => ({ type: CHAT_ROOM_CLOSE });

export function validateJWT(id_token) {
    // TODO ajax call required
    console.log('validateJWT: ' + id_token);
    return function (dispatch) {
        dispatch(loginWithToken(id_token));
    }
}

export const snackbarMessageOpen = () => ({ type: SNACKBAR_OPEN });
export const snackbarMessageClose = () => ({ type: SNACKBAR_CLOSE });

export function setSnackbarMessage(message) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        message: message
    }
};

export function snackbarMessage(message) {
    return function (dispatch) {
        dispatch(snackbarMessageOpen());
        dispatch(setSnackbarMessage(message));
    }
}

export function setInviteCode(inviteCode) {
    return {
        type: SET_INVITE_CODE,
        inviteCode: inviteCode
    }
}

export function removeInviteCode() {
    return {
        type: REMOVE_INVITE_CODE
    }
}

export function openChatRoom() {
    return {
        type: CHAT_ROOM_OPEN
    }
}



export function updateRecentTrips(trips) {
    return {
        type: UPDATE_RECENT_TRIPS,
        trips: trips
    }
}

export function fetchRecentTrips() {
    return function (dispatch) {
        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/recenttrips',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            }
        })
            .then(function (response) {
                // TODO: Redirect to create my first trip
                if (response.data.trips) {
                    console.log(response.data.trips)
                    dispatch(updateRecentTrips(response.data.trips));
                }
            })
            .catch(function (error) {
                // TODO: show error message and guide user to re submit
                console.error(error);
            });
    }

};

export const updateUserInfo = (userId, userName, email, phoneNumber, profilePictureURL) => ({
    type: UPDATE_USER_INFO,
    userId: userId,
    userName: userName,
    email: email,
    phoneNumber: phoneNumber,
    profilePictureURL: profilePictureURL,
});