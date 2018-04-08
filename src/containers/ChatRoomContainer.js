import React from 'react';
import { connect } from 'react-redux';
import { toggleDrawer, updateSelectedTrip } from '../actions';
import ChatRoom from '../components/ChatRoom';

const mapStateToProps = (state) => {
    return {
        isDrawerOpen: state.isDrawerOpen,
        recentTrips: state.recentTrips
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleDrawer: () => {
            dispatch(toggleDrawer);
        },
        updateSelectedTrip: (tripId) => {
            dispatch(updateSelectedTrip(tripId));
        }
    }
}

const ChatRoomContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)

export default ChatRoomContainer;