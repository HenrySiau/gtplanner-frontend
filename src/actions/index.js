import axios from 'axios';
import settings from '../config';
import { push } from 'react-router-redux';
import { LOG_IN, LOG_OUT, TOGGLE_DRAWER, SNACKBAR_OPEN, SET_SNACKBAR_MESSAGE, UPDATE_SELECTED_TRIP } from './actionTypes';
import { SET_INVITE_CODE, REMOVE_INVITE_CODE, UPDATE_RECENT_TRIPS } from './actionTypes';

const login = () => ({ type: LOG_IN });

export function loginWithToken(id_token) {
    localStorage.setItem('id_token', id_token);
    return function (dispatch) {
        dispatch(login());
        dispatch(updateSelectedTrip(null));
        dispatch(fetchRecentTrips());
    }
};

export function loginWithPassword(email, password, inviteCode) {
    return function (dispatch) {
        axios.post(settings.serverUrl + '/api/post/signin', {
            email: email,
            password: password,
            inviteCode: inviteCode
        })
            .then(function (response) {
                // if receive trip info
                if (response.data.tripInfo) {
                    // update trip info to redux store
                    dispatch(updateSelectedTripWithInfo(response.data.tripInfo));
                }
                let id_token = response.data.token;
                if (id_token) {
                    dispatch(loginWithToken(id_token));
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

export function updateSelectedTrip(tripId) {
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

export const toggleDrawer = { type: TOGGLE_DRAWER };

export function validateJWT(id_token) {
    // TODO ajax call required
    console.log('validateJWT: ' + id_token);
    return function (dispatch) {
        dispatch(loginWithToken(id_token));
    }
}

export const snackbarMessageOpen = { type: SNACKBAR_OPEN };

export function setSnackbarMessage(message) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        message: message
    }
};

export function snackbarMessage(message) {
    return function (dispatch) {
        dispatch(snackbarMessageOpen);
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