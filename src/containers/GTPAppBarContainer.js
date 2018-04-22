import {connect} from 'react-redux';
import {logout, toggleDrawer, loginWithToken, updateSelectedTrip, toggleChatRoomOpen, openChatRoom, closeChatRoom} from '../actions';
import {updateUserInfo} from '../actions';
import GTPAppBar from '../components/GTPAppBar';
import { push } from 'react-router-redux';

const mapStateToProps = (state) => {
    return{
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
        isChatRoomOpen: state.isChatRoomOpen,
        tripId: state.selectedTrip.tripId,
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
        loginWithToken: (token) =>{
            dispatch(loginWithToken(token));
        },
        updateSelectedTrip: (tripId) => {
            dispatch(updateSelectedTrip(tripId));
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
        updateUserInfo: (userInfo)=> {
            dispatch(updateUserInfo(userInfo));
        }
    }
}

const GTPAppBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GTPAppBar)

export default GTPAppBarContainer;