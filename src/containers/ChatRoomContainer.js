import React from 'react';
import { connect } from 'react-redux';
import { toggleChatRoomOpen, addMember, changeChatRoomTabsValue } from '../actions';
import { increaseChatMessageBadgeContent, clearChatMessageBadgeContent, increaseSystemMessageBadgeContent, clearSystemMessageBadgeContent } from '../actions';
import ChatRoom from '../components/ChatRoom';
// import ChatRoomDrawer from '../components/ChatRoomDrawer';

class ChatRoomContainer extends React.Component {

    render() {
        return (
            <div>
                {(this.props.isLoggedIn && Boolean(this.props.tripId)) && <ChatRoom
                    isChatRoomOpen={this.props.isChatRoomOpen}
                    tripId={this.props.tripId}
                    isLoggedIn={this.props.isLoggedIn}
                    selectedTrip={this.props.selectedTrip}
                    toggleChatRoomOpen={this.props.toggleChatRoomOpen}
                    addMember={this.props.addMember}
                    userInfo={this.props.userInfo}
                    chatRoomTabsValue={this.props.chatRoomTabsValue}
                    changeChatRoomTabsValue={this.props.changeChatRoomTabsValue}
                    increaseChatMessageBadgeContent={this.props.increaseChatMessageBadgeContent}
                    clearChatMessageBadgeContent={this.props.clearChatMessageBadgeContent}
                    increaseSystemMessageBadgeContent={this.props.increaseSystemMessageBadgeContent}
                    clearSystemMessageBadgeContent={this.props.clearSystemMessageBadgeContent}
                    chatMessageBadgeContent={this.props.chatMessageBadgeContent}
                />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isChatRoomOpen: state.isChatRoomOpen,
        tripId: state.selectedTrip.tripId,
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
        userInfo: state.userInfo,
        chatRoomTabsValue: state.chatRoomTabsValue,
        chatMessageBadgeContent: state.chatMessageBadgeContent,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleChatRoomOpen: () => {
            dispatch(toggleChatRoomOpen());
        },
        addMember: (member) => {
            dispatch(addMember(member));
        },
        changeChatRoomTabsValue: value => {
            dispatch(changeChatRoomTabsValue(value));
        },
        increaseChatMessageBadgeContent: () => {
            dispatch(increaseChatMessageBadgeContent());
        },
        clearChatMessageBadgeContent: () => {
            dispatch(clearChatMessageBadgeContent());
        },
        increaseSystemMessageBadgeContent: () => {
            dispatch(increaseSystemMessageBadgeContent());
        },
        clearSystemMessageBadgeContent: () => {
            dispatch(clearSystemMessageBadgeContent());
        },
    }
}

ChatRoomContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoomContainer)

export default ChatRoomContainer;