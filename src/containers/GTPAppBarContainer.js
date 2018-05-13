import { connect } from 'react-redux';
import { logout, toggleDrawer, loginWithToken, toggleChatRoomOpen, openChatRoom, closeChatRoom } from '../actions';
import { updateUserInfo, updateSelectedTripWithInfo, chatMessageBadgeContent, systemMessageBadgeContent } from '../actions';
import GTPAppBar from '../components/GTPAppBar';
import { push } from 'react-router-redux';

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
        isChatRoomOpen: state.isChatRoomOpen,
        tripId: state.selectedTrip.tripId,
        chatMessageBadgeContent: state.chatMessageBadgeContent,
        systemMessageBadgeContent: state.systemMessageBadgeContent,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        push: (url) => {
            dispatch(push(url));
        },
        logout: () => {
            dispatch(logout());
        },
        toggleDrawer: () => {
            dispatch(toggleDrawer());
        },
        loginWithToken: (token) => {
            dispatch(loginWithToken(token));
        },
        toggleChatRoomOpen: () => {
            dispatch(toggleChatRoomOpen());
        },
        openChatRoom: () => {
            dispatch(openChatRoom());
        },
        closeChatRoom: () => {
            dispatch(closeChatRoom());
        },
        updateSelectedTripWithInfo: tripInfo => {
            dispatch(updateSelectedTripWithInfo(tripInfo));
        },
        updateUserInfo: userInfo => {
            dispatch(updateUserInfo(userInfo));
        }
    }
}

const GTPAppBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GTPAppBar)

export default GTPAppBarContainer;