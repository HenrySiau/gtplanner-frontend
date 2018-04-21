import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import instanceConfig from '../instanceConfig';
import { snackbarMessage, updateSelectedTripWithInfo, setInviteCode } from '../actions';
import { push } from 'react-router-redux';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import settings from '../config';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        width: '250px',
    },
    forgotPasswordButton: {
        margin: theme.spacing.unit,
        width: '250px',
        color: '#616161',
        backgroundColor: '#EEEEEE',
        textTransform: 'capitalize',
    },
    textField: {
        width: '250px',
        margin: theme.spacing.unit,
    },
    loginWith: {
        width: '250px',
        textTransform: 'capitalize',
    },
    signUpButton: {
        width: '250px',
        textTransform: 'capitalize',
        margin: theme.spacing.unit,
    }
});


class RedirectWithMessage extends React.Component {
    componentDidMount() {
        this.props.push('/dashboard');
        this.props.snackbarMessage('Welcome to your new trip!');
    }
    render() {
        return (
            <div></div>
        )
    }

}

class JoinATrip extends React.Component {
    state = {
        isInvitationCodeValid: false,
    }


    componentDidMount() {
        if (this.props.location.search) {
            if (this.props.location.search.length > 6) {
                const invitationCode = this.props.location.search.slice(6);
                axios.post(settings.serverUrl + '/api/post/invitation/code/verify', {
                    invitationCode: invitationCode,
                })
                    .then((response) => {
                        if (response.data.tripInfo) {
                            this.props.updateSelectedTripWithInfo(response.data.tripInfo);
                            this.props.setInviteCode(invitationCode);
                            this.setState({
                                isInvitationCodeValid: true
                            });

                        } else {
                            this.props.push('/');
                            this.props.snackbarMessage('Invalid Invitation Link');
                        }
                    })
                    .catch((error) => {
                        this.props.push('/');
                        this.props.snackbarMessage('Something went wrong');
                    });

            } else {
                // handle invalid link
                this.props.push('/');
                this.props.snackbarMessage('Invalid Invitation Link');
            }
        }
    }



    render() {
        const { classes } = this.props;
        return (
            <div>
                <h1>Join A Trip</h1>
                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isInvitationCodeValid && !this.props.isLoggedIn}
                >
                    <DialogTitle >
                        {"Welcome"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            please choose your next step, have fun using Group Travel Planner.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={() => { this.props.push('/login') }}
                            className={classes.dialogButton}
                        >
                            Login
                    </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={() => { this.props.push('/register') }}
                            className={classes.dialogButton}
                        >
                            Sign Up
                    </Button>

                    </DialogActions>
                </Dialog>
                {/* we need to use different props or status incase user logged in with selectedTrip */}
                {(this.props.isLoggedIn && this.state.isInvitationCodeValid) && <RedirectWithMessage
                    snackbarMessage={this.props.snackbarMessage}
                    push={this.props.push}
                />}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        inviteCode: state.inviteCode,
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        push: (url) => {
            dispatch(push(url));
        },
        snackbarMessage: (msg) => {
            dispatch(snackbarMessage(msg));
        },
        updateSelectedTripWithInfo: (tripInfo) => {
            dispatch(updateSelectedTripWithInfo(tripInfo))
        },
        setInviteCode: (code) => {
            dispatch(setInviteCode(code))
        }

    }
}

JoinATrip = withStyles(styles)(JoinATrip);
export default connect(mapStateToProps, mapDispatchToProps)(JoinATrip);