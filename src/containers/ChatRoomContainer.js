import React from 'react';
import { connect } from 'react-redux';
import { toggleChatRoomOpen} from '../actions';
import ChatRoom from '../components/ChatRoom';

const mapStateToProps = (state) => {
    return {
        isChatRoomOpen: state.isChatRoomOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleChatRoomOpen: () => {
            dispatch(toggleChatRoomOpen);
        }
    }
}

const ChatRoomContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)

export default ChatRoomContainer;