import { CHANGE_CHAT_ROOM_TABS_VALUE } from '../actions/actionTypes';
const chatRoomTabsValue = (state = 0, action) => {
    switch (action.type) {
        case CHANGE_CHAT_ROOM_TABS_VALUE:
            return action.value
        default:
            return state
    }
}

export default chatRoomTabsValue