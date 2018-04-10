import {connect} from 'react-redux';
import {logout, toggleDrawer, validateJWT, updateSelectedTrip, toggleChatRoomOpen, openChatRoom, closeChatRoom} from '../actions';
import GTPAppBar from '../components/GTPAppBar';
import { push } from 'react-router-redux';

const mapStateToProps = (state) => {
    return{
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
        isChatRoomOpen: state.isChatRoomOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        push: (url) => {
            dispatch(push(url));
        },
        logout: () => {
            dispatch(logout);
        },
        toggleDrawer: () => {
            dispatch(toggleDrawer);
        },
        validateJWT: (token) =>{
            dispatch(validateJWT(token));
        },
        updateSelectedTrip: (tripId) => {
            dispatch(updateSelectedTrip(tripId));
        },
        toggleChatRoomOpen: () => {
            dispatch(toggleChatRoomOpen);
        },
        openChatRoom: () => {
            dispatch(openChatRoom);
        },
        closeChatRoom: () => {
            dispatch(closeChatRoom);
        }
    }
}

const GTPAppBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GTPAppBar)

export default GTPAppBarContainer;