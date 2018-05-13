import { INCREASE_CHAT_MESSAGE_BADGE_CONTENT, CLEAR_CHAT_MESSAGE_BADGE_CONTENT, INCREASE_SYSTEM_MESSAGE_BADGE_CONTENT, CLEAR_SYSTEM_MESSAGE_BADGE_CONTENT } from '../actions/actionTypes';
import settings from '../config';

export const chatMessageBadgeContent = (state = 0, action) => {
    switch (action.type) {
        case INCREASE_CHAT_MESSAGE_BADGE_CONTENT:
            return state + 1
        case CLEAR_CHAT_MESSAGE_BADGE_CONTENT:
            return 0
        default:
            return state
    }
}

export const systemMessageBadgeContent = (state = 0, action) => {
    switch (action.type) {
        case INCREASE_SYSTEM_MESSAGE_BADGE_CONTENT:
            return state + 1
        case CLEAR_SYSTEM_MESSAGE_BADGE_CONTENT:
            return 0
        default:
            return state
    }
}