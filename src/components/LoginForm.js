import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import instanceConfig from '../instanceConfig';
import { Link } from 'react-router-dom'
import { logout, loginWithPassword } from '../actions';
import { push } from 'react-router-redux';
import { Redirect } from 'react-router'



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
        window.fbAsyncInit = function () {
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
                    console.log(response.authResponse);
                    console.log('accessToken: ' + response.authResponse.accessToken);
                    console.log('you are logged in');
                    window.FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id,email,picture.width(150).height(150)'}, function(response) {
                        console.log(JSON.stringify(response));
                    });
                } else {
                    console.log('you are logged out');
                }
            })
        }.bind(this);

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
        let fetchDefaultTrip = this.props.tripId ? false : true;
        console.log('fetchDefaultTrip: ' + fetchDefaultTrip);
        this.props.loginWithPassword(this.state.email, this.state.password, this.props.inviteCode, fetchDefaultTrip);
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
        inviteCode: state.inviteCode,
        isLoggedIn: state.isLoggedIn,
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
        loginWithPassword: (email, password, inviteCode, fetchDefaultTrip) => {
            dispatch(loginWithPassword(email, password, inviteCode, fetchDefaultTrip))
        }
    }
}

LoginForm = withStyles(styles)(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
