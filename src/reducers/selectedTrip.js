import { UPDATE_SELECTED_TRIP, SET_INVITE_CODE, REMOVE_INVITE_CODE, ADD_MEMBER } from '../actions/actionTypes';
import settings from '../config';

export const selectedTrip = (state = '', action) => {
    switch (action.type) {
        case UPDATE_SELECTED_TRIP:
            return {
                tripId: action.tripId,
                title: action.title,
                description: action.description,
                owner: action.owner,
                members: action.members,
                startDate: action.startDate,
                endDate: action.endDate,
                invitationCode: action.invitationCode
            }
        case ADD_MEMBER:
            console.log('add member');
            return {
                tripId: state.tripId,
                title: state.title,
                description: state.description,
                owner: state.owner,
                members: state.members.set(action.member.userId, {
                    userName: action.member.userName,
                    email: action.email,
                    profilePictureUrl: action.profilePicture ? settings.serverUrl + action.profilePicture : action.facebookProfilePictureURL || settings.defaultProfilePictureUrl,
                }),
                startDate: state.startDate,
                endDate: state.endDate,
                invitationCode: state.invitationCode
            }
        default:
            return state
    }
}

export const invitationCode = (state = '', action) => {
    switch (action.type) {
        case SET_INVITE_CODE:
            return action.invitationCode
        case REMOVE_INVITE_CODE:
            return ''
        default:
            return state
    }
}