import { UPDATE_USER_INFO, UPDATE_PROFILE_PICTURE_URL } from '../actions/actionTypes';

export const userInfo = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USER_INFO:
            return {
                userId: action.userId,
                userName: action.userName,
                email: action.email,
                phoneNumber: action.phoneNumber,
                profilePictureURL: action.profilePictureURL,
            }
        case UPDATE_PROFILE_PICTURE_URL:
        // const newState = Object.assign({ profilePictureURL: action.profilePictureURL }, state);
            return {
                userId: state.userId,
                userName: state.userName,
                email: state.email,
                phoneNumber: state.phoneNumber,
                profilePictureURL: action.profilePictureURL,
            }
        default:
            return state
    }
}
