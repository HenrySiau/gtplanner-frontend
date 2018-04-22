import settings from '../config';

import { UPDATE_USER_INFO } from '../actions/actionTypes';
const initialState = {
    userId: '',
    userName: '',
    email: '',
    phone: '',
    profilePictureURL: '',
}
export const userInfo = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_INFO:
            return {
                userId: action.userId,
                userName: action.userName,
                email: action.email,
                phoneNumber: action.phoneNumber,
                profilePictureURL: action.profilePictureURL,
            }
        default:
            return state
    }
}
