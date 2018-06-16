import { connect } from 'react-redux';
import { logout, toggleDrawer, loginWithToken, toggleChatRoomOpen, openChatRoom, closeChatRoom } from '../actions';
import { updateUserInfo, updateSelectedTripWithInfo, chatMessageBadgeContent, systemMessageBadgeContent } from '../actions';
import { increaseChatMessageBadgeContent, clearChatMessageBadgeContent, increaseSystemMessageBadgeContent, clearSystemMessageBadgeContent } from '../actions';
import { updateFilteredMarkers } from '../actions';
import GTPAppBar from '../components/GTPAppBar';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
        isChatRoomOpen: state.isChatRoomOpen,
        tripId: state.selectedTrip.tripId,
        chatMessageBadgeContent: state.chatMessageBadgeContent,
        systemMessageBadgeContent: state.systemMessageBadgeContent,
        chatRoomTabsValue: state.chatRoomTabsValue
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
        updateFilteredMarkers: (places) => {
            dispatch(updateFilteredMarkers(places));
        }

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GTPAppBar));