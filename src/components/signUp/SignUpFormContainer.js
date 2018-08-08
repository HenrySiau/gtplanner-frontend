import { connect } from 'react-redux';
import { loginWithToken, removeInvitationCode, snackbarMessage, updateSelectedTripWithInfo, updateUserInfo } from '../../actions';
import { push } from 'react-router-redux';
import SignUpForm from './SignUpForm';

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        tripId: state.selectedTrip.tripId,
        invitationCode: state.invitationCode ? state.invitationCode : null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        push: (url) => {
            dispatch(push(url));
        },
        loginWithToken: (token) => {
            dispatch(loginWithToken(token));
        },
        removeInvitationCode: () => {
            dispatch(removeInvitationCode());
        },
        snackbarMessage: (msg) => {
            dispatch(snackbarMessage(msg));
        },
        updateSelectedTripWithInfo: (tripInfo) => {
            dispatch(updateSelectedTripWithInfo(tripInfo));
        },
        updateUserInfo: (newUserInfo) => {
            dispatch(updateUserInfo(newUserInfo));
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);