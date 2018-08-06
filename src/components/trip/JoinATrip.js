import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { snackbarMessage, updateSelectedTripWithInfo, setInvitationCode, loginWithToken, updateUserInfo, removeInvitationCode } from '../actions';
import { push } from 'react-router-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
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

class JoinATrip extends React.Component {
    state = {
        isInvitationCodeValid: false,
        isTokenValid: false,
        userName: '',
    }

    //      https://localhost:3000/trip/join?code=ThbcIkPL
    componentDidMount() {
        if (this.props.location.search) {
            console.log('this.props.location.search: ' + this.props.location.search);
            if (this.props.location.search.length > 6) {
                const invitationCode = this.props.location.search.slice(6);
                console.log('invitationCode: ' + invitationCode);
                const token = localStorage.getItem('id_token') ? localStorage.getItem('id_token') : '';
                axios.post(settings.serverUrl + '/api/post/invitation/code/verify', {
                    invitationCode: invitationCode,
                    token: token
                })
                    .then((response) => {
                        console.log(response.data);
                        const userInfo = response.data.userInfo;
                        if (userInfo) {
                            if (userInfo.userName) {
                                this.setState({
                                    userName: userInfo.userName,
                                    isTokenValid: true,
                                });
                            }
                        }
                        if (response.data.tripInfo) {
                            if (this.props.isLoggedIn) {
                                this.continueWithToken();
                            } else {
                                const receivedInvitationCode = response.data.tripInfo.invitationCode;
                                if (receivedInvitationCode) {
                                    // if there is a invitationCode in redux store
                                    // means there is a valid trip waiting to join
                                    this.props.setInvitationCode(receivedInvitationCode);
                                    this.setState({
                                        isInvitationCodeValid: true
                                    });
                                }
                            }
                        } else {
                            this.props.push('/');
                            this.props.snackbarMessage('Invalid Invitation Link');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.props.push('/');
                        this.props.snackbarMessage('Something went wrong');
                    });

            } else {
                // handle invalid link
                this.props.push('/');
                this.props.snackbarMessage('Invalid Invitation Link');
            }
        } else {
            this.props.push('/');
        }
    }

    continueWithToken = () => {
        axios({
            method: 'POST',
            url: settings.serverUrl + '/api/post/trip/join',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            data: {
                invitationCode: this.props.location.search.slice(6),
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    const userInfo = response.data.userInfo;
                    if (userInfo) {
                        const newUserInfo = {
                            userId: userInfo.userId,
                            userName: userInfo.userName,
                            email: userInfo.email,
                            phoneNumber: userInfo.phoneNumber || '',
                            profilePictureURL: userInfo.profilePicture || (userInfo.facebookProfilePictureURL || ''),
                            trips: userInfo.trips,
                        };
                        
                        this.props.updateUserInfo(newUserInfo);
                    }
                    if (response.data.token) {
                        this.props.loginWithToken(response.data.token);
                    }
                    if (response.data.tripInfo) {
                        this.props.updateSelectedTripWithInfo(response.data.tripInfo);
                        this.props.removeInvitationCode();
                        this.props.push('/dashboard');
                        this.props.snackbarMessage('Welcome to your new trip!');
                    } else {
                        this.props.push('/');
                        this.props.snackbarMessage('Invalid Invitation Link');
                    }

                } else {
                    this.props.push('/');
                    this.props.snackbarMessage('Can not join this trip');
                }
            })
            .catch((error) => {
                console.error(error);
                this.props.push('/');
                this.props.snackbarMessage('Something went wrong');
            });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <h1>Join A Trip</h1>
                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isInvitationCodeValid && this.state.isTokenValid}
                >
                    <DialogTitle >
                        {"Welcome"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you want to continue as {this.state.userName}?.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.continueWithToken}
                            className={classes.dialogButton}
                        >
                            Yes
                    </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={() => {
                                localStorage.removeItem('id_token');
                                this.props.push('/login')
                            }}
                            className={classes.dialogButton}
                        >
                            Continue with different account
                    </Button>

                    </DialogActions>
                </Dialog>

                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isInvitationCodeValid && !this.state.isTokenValid}
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
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        invitationCode: state.invitationCode,
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
        setInvitationCode: (code) => {
            dispatch(setInvitationCode(code))
        },
        loginWithToken: (token) => {
            dispatch(loginWithToken(token));
        },
        updateUserInfo: (userInfo) => {
            dispatch(updateUserInfo(userInfo));
        },
        removeInvitationCode: () => {
            dispatch(removeInvitationCode());
        }

    }
}

JoinATrip = withStyles(styles)(JoinATrip);
export default connect(mapStateToProps, mapDispatchToProps)(JoinATrip);