import axios from 'axios';
import settings from '../config';
import { push } from 'react-router-redux';
import { LOG_IN, LOG_OUT, TOGGLE_DRAWER, SNACKBAR_OPEN, SNACKBAR_CLOSE, SET_SNACKBAR_MESSAGE, UPDATE_SELECTED_TRIP } from './actionTypes';
import { SET_INVITE_CODE, REMOVE_INVITE_CODE, UPDATE_RECENT_TRIPS, TOGGLE_CHAT_ROOM_OPEN, CHAT_ROOM_OPEN, CHAT_ROOM_CLOSE } from './actionTypes';
import { DRAWER_EXTEND, DRAWER_FOLD, UPDATE_USER_INFO, ADD_MEMBER, REMOVE_MEMBER, CHANGE_CHAT_ROOM_TABS_VALUE, UPDATE_FILTERED_MARKER_LIST } from './actionTypes';
import { INCREASE_CHAT_MESSAGE_BADGE_CONTENT, CLEAR_CHAT_MESSAGE_BADGE_CONTENT, INCREASE_SYSTEM_MESSAGE_BADGE_CONTENT, CLEAR_SYSTEM_MESSAGE_BADGE_CONTENT } from './actionTypes';
import { UPDATE_IDEAS, ADD_IDEA, SET_DASHBOARD_VIEW_MAP, SET_DASHBOARD_VIEW_LIST, SET_DASHBOARD_VIEW_SPLIT, UPDATE_PROFILE_PICTURE_URL, SET_VIEW_ITINERARY, SET_VIEW_IDEA } from './actionTypes';

const login = () => ({ type: LOG_IN });

export function loginWithToken(id_token) {
    localStorage.setItem('id_token', id_token);
    return function (dispatch) {
        dispatch(login());
    }
};

export function loginWithPassword(email, password, invitationCode, fetchDefaultTrip) {
    return function (dispatch) {
        axios.post(settings.serverUrl + '/api/post/signin', {
            email: email,
            password: password,
            invitationCode: invitationCode
        })
            .then(function (response) {
                let id_token = response.data.token;
                if (id_token) {
                    dispatch(loginWithToken(id_token));
                    // if there is no selected Trip
                    // fetch the default Trip
                    // if there is a selected Trip from joining a trip do not fetch trip
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

export const updateSelectedTripWithInfo = (tripInfo) => {
    let membersMap = new Map();
    if (tripInfo.members) {
        tripInfo.members.forEach(member => {
            membersMap.set(member.userId, {
                'userName': member.userName,
                'email': member.email,
                'profilePictureURL': member.profilePicture ? settings.serverUrl + member.profilePicture : member.facebookProfilePictureURL || settings.defaultProfilePictureURL
            })
        });
    }
    return {
        type: UPDATE_SELECTED_TRIP,
        tripId: tripInfo.tripId,
        title: tripInfo.title,
        description: tripInfo.description,
        owner: tripInfo.owner,
        members: membersMap,
        startDate: tripInfo.startDate,
        endDate: tripInfo.endDate,
        invitationCode: tripInfo.invitationCode
    }
}

export const addMember = (member) => {
    return {
        type: ADD_MEMBER,
        member: member,
    }
}


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
        axios.post(settings.serverUrl + '/api/post/JWT/validate', {
            token: id_token,
        })
            .then(function (response) {
                let userInfo = response.data.userInfo;
                if (userInfo) {
                    dispatch(updateUserInfo(userInfo))
                    dispatch(loginWithToken(id_token));
                }
                else {
                    // invalid JWT
                }
            })
            .catch(function (error) {
                // TODO: show error message and guide user to re submit
                console.error(error);
                dispatch(snackbarMessage('email or password incorrect'));
            });

        // dispatch(loginWithToken(id_token));
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

export function setInvitationCode(invitationCode) {
    return {
        type: SET_INVITE_CODE,
        invitationCode: invitationCode
    }
}

export function removeInvitationCode() {
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

export const updateUserInfo = (userInfo) => ({
    type: UPDATE_USER_INFO,
    userId: userInfo.userId,
    userName: userInfo.userName,
    email: userInfo.email,
    phoneNumber: userInfo.phoneNumber,
    profilePictureURL: userInfo.profilePicture ? settings.serverUrl + '/images/' + userInfo.profilePicture : userInfo.facebookProfilePictureURL || settings.defaultProfilePictureURL

});

export const changeChatRoomTabsValue = (value) => ({
    type: CHANGE_CHAT_ROOM_TABS_VALUE,
    value: value

});
export const increaseChatMessageBadgeContent = () => ({
    type: INCREASE_CHAT_MESSAGE_BADGE_CONTENT
})

export const clearChatMessageBadgeContent = () => ({
    type: CLEAR_CHAT_MESSAGE_BADGE_CONTENT
})

export const increaseSystemMessageBadgeContent = () => ({
    type: INCREASE_SYSTEM_MESSAGE_BADGE_CONTENT
})

export const clearSystemMessageBadgeContent = () => ({
    type: CLEAR_SYSTEM_MESSAGE_BADGE_CONTENT
})

export const updateFilteredMarkers = (markers) => ({
    type: UPDATE_FILTERED_MARKER_LIST,
    value: markers
});

export const updateIdeas = (ideas) => ({
    type: UPDATE_IDEAS,
    ideas: ideas
});

export const addIdea = (idea) => ({
    type: ADD_IDEA,
    idea: idea,
});

export const updateProfilePictureUrl = (imageName) => ({
    type: UPDATE_PROFILE_PICTURE_URL,
    profilePictureURL: settings.imageServerUrl + settings.imagePath + imageName,
});

export const setDashboardViewToMap = () => ({ type: SET_DASHBOARD_VIEW_MAP });
export const setDashboardViewToList = () => ({ type: SET_DASHBOARD_VIEW_LIST });
export const setDashboardViewToSplit = () => ({ type: SET_DASHBOARD_VIEW_SPLIT });
export const showItinerary = () => ({ type: SET_VIEW_ITINERARY });
export const showIdeas = () => ({ type: SET_VIEW_IDEA });