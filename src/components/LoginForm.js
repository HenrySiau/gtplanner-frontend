import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import instanceConfig from '../instanceConfig';
import { Link } from 'react-router-dom';
import { logout, loginWithPassword, updateUserInfo, snackbarMessage, loginWithToken, updateSelectedTripWithInfo } from '../actions';
import { push } from 'react-router-redux';
import { Redirect } from 'react-router';
import axios from 'axios';
import settings from '../config';

const styles = theme => ({
    form: {
        backgroundColor: 'white'
    },
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

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    componentDidMount() {
        window.fbAsyncInit = () => {
            // FaceBook Login Functions
            window.FB.init({
                appId: instanceConfig.facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v2.12'
            });
            // window.FB.AppEvents.logPageView();
            window.FB.Event.subscribe('auth.statusChange', (response) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    const fetchDefaultTrip = this.props.tripId ? false : true;
                    window.FB.api('/me', 'GET', { fields: 'name,email,picture.width(150).height(150)' }, (response) => {
                        console.log(response);
                        const userName = response.name;
                        const email = response.email;
                        const profilePictureURL = response.picture.data.url;
                        axios.post(settings.serverUrl + '/api/post/login/facebook', {
                            userName: userName,
                            email: email,
                            accessToken: accessToken,
                            invitationCode: this.props.invitationCode,
                            facebookProfilePictureURL: profilePictureURL
                        })
                            .then((response) => {
                                console.log(response.data);
                                let id_token = response.data.token;
                                let userInfo = response.data.userInfo;
                                let tripInfo = response.data.tripInfo;
                                if (id_token) {
                                    this.props.loginWithToken(id_token);

                                }
                                if (userInfo) {
                                    const newUserInfo = {
                                        userId: userInfo.userId,
                                        userName: userInfo.userName || userName,
                                        email: userInfo.email || email,
                                        phoneNumber: userInfo.phoneNumber || '',
                                        profilePictureURL: userInfo.profilePicture ? settings.serverUrl + userInfo.profilePicture : profilePictureURL
                                    }
                                    this.props.updateUserInfo(newUserInfo);
                                }
                                if (tripInfo) {
                                    this.props.updateSelectedTripWithInfo(tripInfo);
                                    this.props.push('/dashboard');
                                }
                            })
                            .catch((error) => {
                                // TODO: show error message and guide user to re submit
                                console.error(error);
                                this.props.snackbarMessage('something went wrong');
                            });
                    });
                } else {
                    console.log('you are logged out');
                }
            })
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }


    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value
        });
    };
    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    };

    handleSubmit = () => {
        // console.log('fetchDefaultTrip: ' + Boolean(!this.props.tripId));
        // const fetchDefaultTrip = this.props.tripId ? false : true;
        // console.log('fetchDefaultTrip: ' + fetchDefaultTrip);
        // this.props.loginWithPassword(this.state.email, this.state.password, this.props.invitationCode, fetchDefaultTrip);

        axios.post(settings.serverUrl + '/api/post/signin', {
            email: this.state.email,
            password: this.state.password,
            invitationCode: this.props.invitationCode
        })
            // .then(function (response) {
            //     let id_token = response.data.token;
            //     if (id_token) {
            //         dispatch(loginWithToken(id_token));
            //         // if there is no selected Trip
            //         // fetch the default Trip
            //         // if there is a selected Trip from joining a trip do not fetch trip
            //         if (fetchDefaultTrip) {
            //             dispatch(updateSelectedTrip(null));
            //         }
            //         dispatch(push('/dashboard'));
            //     }
            // })
            .then((response) => {
                console.log(response.data);
                let id_token = response.data.token;
                let userInfo = response.data.userInfo;
                let tripInfo = response.data.tripInfo;
                if (id_token) {
                    this.props.loginWithToken(id_token);

                }
                if (userInfo) {
                    const newUserInfo = {
                        userId: userInfo.userId,
                        userName: userInfo.userName,
                        email: userInfo.email,
                        phoneNumber: userInfo.phoneNumber || '',
                        profilePictureURL: settings.serverUrl + userInfo.profilePicture
                    }
                    this.props.updateUserInfo(newUserInfo);
                }
                if (tripInfo) {
                    this.props.updateSelectedTripWithInfo(tripInfo);
                    this.props.push('/dashboard');
                }
            })
            .catch(error => {
                // TODO: show error message and guide user to re submit
                console.error(error);
                this.props.snackbarMessage('email or password incorrect');
            });
    }

    handlePressEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.form}>
                {this.props.isLoggedIn && <Redirect to="/dashboard" />}
                <TextField
                    label="Email"
                    onChange={this.handleEmailChange}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Password"
                    type="password"
                    onChange={this.handlePasswordChange}
                    onKeyPress={this.handlePressEnter}
                    className={classes.textField}
                /><br />
                <Button
                    variant="raised"
                    color="primary"
                    className={classes.button}
                    onClick={this.handleSubmit}>
                    Log in
                </Button><br />
                <Button
                    className={classes.forgotPasswordButton}
                    variant="raised"
                    component={Link}
                    to="/password/forgot"
                >Forgot password?</Button><br />
                <Button disabled className={classes.loginWith}>
                    Or Log in with
      </Button><br />
                <div className="fb-login-button"
                    data-max-rows="1"
                    data-size="large"
                    data-width="250"
                    data-button-type="login_with"
                    data-show-faces="false" data-auto-logout-link="false"
                    data-use-continue-as="true"
                    scope="email"
                    style={{
                        margin: '6px',
                        width: '250px'
                    }}
                >
                </div><br />
                <Button
                    variant="raised"
                    color="primary"
                    className={classes.signUpButton}
                    component={Link}
                    to="/register"
                >
                    No account?  Sign up here
                </Button><br />
            </div>
        );
    }
}

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
        logout: () => {
            dispatch(logout());
        },
        loginWithPassword: (email, password, invitationCode, fetchDefaultTrip) => {
            dispatch(loginWithPassword(email, password, invitationCode, fetchDefaultTrip))
        },
        updateUserInfo: (userInfo) => {
            dispatch(updateUserInfo(userInfo))
        },
        snackbarMessage: (msg) => {
            dispatch(snackbarMessage(msg));
        },
        loginWithToken: (token) => {
            dispatch(loginWithToken(token));
        },
        updateSelectedTripWithInfo: (tripInfo) => {
            dispatch(updateSelectedTripWithInfo(tripInfo))
        },
    }
}

LoginForm = withStyles(styles)(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
