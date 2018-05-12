import React from 'react';
import { connect } from 'react-redux';
import { toggleChatRoomOpen, addMember } from '../actions';
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleChatRoomOpen: () => {
            dispatch(toggleChatRoomOpen());
        },
        addMember: (member) => {
            dispatch(addMember(member));
        }
    }
}

ChatRoomContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoomContainer)

export default ChatRoomContainer;