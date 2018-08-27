import GTPAvatar from './GTPAvatar';
import { connect } from 'react-redux';
import { logout, snackbarMessage } from '../../actions';
import { push } from 'react-router-redux';


const mapStateToProps = (state) => {
    return {
        profilePictureURL: state.userInfo.profilePictureURL
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
        snackbarMessage: (msg) => {
            dispatch(snackbarMessage(msg));
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GTPAvatar)