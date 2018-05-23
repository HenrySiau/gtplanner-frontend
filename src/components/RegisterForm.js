import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import red from 'material-ui/colors/red';
import lightBlue from 'material-ui/colors/lightBlue';
import blue from 'material-ui/colors/blue';
import axios from 'axios';
import settings from '../config';
import { isEmailFormatOK } from './Validator';
import { loginWithToken, removeInvitationCode, snackbarMessage, updateSelectedTripWithInfo, updateUserInfo } from '../actions';
import { push } from 'react-router-redux';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    container: {
    },
    registerButton: {
        margin: '10px 10px 5px 120px'
    },
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    valid: {
        color: blue[500]
    },
    invalid: {
        color: red[500]
    },
    popoverTitle: {
        color: blue[500],
        margin: 10
    },
    passwordRequirementPaper: {
        zIndex: 9999,
        position: 'absolute',
    },
    textField: {
        width: '230px',
        marginRight: theme.spacing.unit * 2,

    }
});

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            email: '',
            phoneNumber: '',
            password: '',
            passwordConfirm: '',
            userNameErrMessage: '',
            passwordErrMessage: '',
            passwordConfirmErrMessage: '',
            emailErrMessage: '',
            phoneNumberErrMessage: '',
            isEmailFormatIncorrect: false,
            isUserNameFormatIncorrect: false,
            isPasswordInputOnFocus: false,
            isPasswordContainLowercase: false,
            isPasswordFormatCorrect: false,
            isPasswordContainCapital: false,
            isPasswordContainNumber: false,
            isPasswordSatisfyLengthRequirement: false,
            isDialogOpen: false,
            submitButtonDisable: false
        };
    }

    componentDidMount = () => {
        this.setState({
            anchorEl: document.querySelector('#passwordInputField'),
            anchorEl2: document.querySelector('#passwordCnfInputField')
        });

    }

    strip = (str) => {
        return str.replace(/^\s+|\s+$/g, '');
    }
    isFormReady = () => {
        if (!this.state.isEmailFormatIncorrect && !this.state.isUserNameFormatIncorrect
            && this.state.isPasswordContainLowercase && this.state.isPasswordContainCapital
            && this.state.isPasswordContainNumber && this.state.isPasswordSatisfyLengthRequirement
        ) {
            return true
        } else {
            return false
        }
    }

    ValidateEmailAvailable = () => {
        let email = this.strip(this.state.email);
        if (isEmailFormatOK(email)) {
            this.setState({
                emailErrMessage: '',
                isEmailFormatIncorrect: false
            });
            axios.post(settings.serverUrl + '/api/post/email/exist', {
                email: email,
            })
                .then((response) => {
                    if (response.data.exist) {
                        this.setState({
                            emailErrMessage: 'This Email already registered',
                        });
                    }
                })
                .catch((error) => {
                    // TODO: show error message and guide user to re submit
                    console.log(error);
                    console.log(error.response);
                });


        } else {
            this.setState({
                emailErrMessage: 'Email format incorrect',
                isEmailFormatIncorrect: true
            });
        }
    }

    ValidateEmailFormat = (email) => {
        if (isEmailFormatOK(this.strip(email))) {
            return true
        } else {
            return false
        }
    }

    ValidateUserNameFormat = (event) => {
        const userName = this.strip(this.state.userName);
        if (userName.length < 2 || userName.length > 21) {
            this.setState({
                isUserNameFormatIncorrect: true,
                userNameErrMessage: 'User Name must between 2-20 characters'
            });
        } else {
            this.setState({
                isUserNameFormatIncorrect: false,
                userNameErrMessage: ''
            });
        }
    };

    handleUserNameChange = (event) => {
        this.setState({
            userName: event.target.value,
        });
        if (this.state.isUserNameFormatIncorrect) {

            if (event.target.value.length < 21 && event.target.value.length > 1) {
                this.setState({
                    userNameErrMessage: '',
                    isUserNameFormatIncorrect: false
                });
            }
        } else {
            if (event.target.value.length > 21) {
                this.setState({
                    userNameErrMessage: 'User Name must between 2-20 characters',
                    isUserNameFormatIncorrect: true,
                });
            }
        }
    };

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value
        });
        if (this.state.isEmailFormatIncorrect) {
            if (this.ValidateEmailFormat(event.target.value)) {
                this.setState({
                    isEmailFormatIncorrect: false,
                    emailErrMessage: ''
                });
            }
        }
    };
    validatePassword = () => {
        if (this.state.isPasswordContainCapital && this.state.isPasswordContainLowercase &&
            this.state.isPasswordContainNumber && this.state.isPasswordSatisfyLengthRequirement) {
            this.setState({
                isPasswordFormatCorrect: true

            });
        }
    }
    handlePhoneNumberChange = (event) => {
        // validate phone number could be a big project
        // because different county have different phone number patten
        // here we skip this part
        this.setState({
            phoneNumber: event.target.value,

        });
    };

    handlePasswordChange = (event) => {
        if (!this.state.popoverAnchor) {
            this.setState({
                popoverAnchor: event.target
            });
        }
        const password = this.strip(event.target.value);
        this.setState({
            password: password
        });

        // validate lowercase
        if (password.match(/[a-z]/g)) {
            this.setState(
                { isPasswordContainLowercase: true },
                () => this.validatePassword()
            );
        } else {
            this.setState({
                isPasswordContainLowercase: false
            });
        }
        // validate capital letter
        if (password.match(/[A-Z]/g)) {
            this.setState(
                { isPasswordContainCapital: true },
                () => this.validatePassword()
            );
        } else {
            this.setState(
                { isPasswordContainCapital: false },
                () => this.validatePassword()
            );
        }
        // validate number
        if (password.match(/[0-9]/g)) {
            this.setState(
                { isPasswordContainNumber: true },
                () => this.validatePassword()
            );
        } else {
            this.setState({
                isPasswordContainNumber: false
            });
        }
        //validate length
        if (password.length > 7 && password.length < 31) {
            this.setState(
                { isPasswordSatisfyLengthRequirement: true },
                () => this.validatePassword()
            );
        } else {
            this.setState({
                isPasswordSatisfyLengthRequirement: false
            });
        }
    };

    handlePasswordInputOnFocus = (event) => {
        this.setState({
            isPasswordInputOnFocus: true
        });
    }

    handlePasswordInputOnBlur = (event) => {
        this.setState({
            isPasswordInputOnFocus: false
        });
    }

    handlePasswordConfirmChange = (event) => {

        if (event.target.value !== this.state.password) {
            this.setState({
                passwordConfirmErrMessage: `password doesn't match`
            });
        } else {
            this.setState({
                passwordConfirm: event.target.value,
                passwordConfirmErrMessage: ''
            });
        }
    };

    handleSubmit = () => {
        if (this.isFormReady()) {
            this.setState({
                submitButtonDisable: true
            });
            axios.post(settings.serverUrl + '/api/post/user/register', {
                userName: this.state.userName,
                email: this.state.email,
                phoneNumber: this.state.phoneNumber,
                password: this.state.password,
                passwordConfirm: this.state.passwordConfirm,
                invitationCode: this.props.invitationCode
            })
                .then((response) => {
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
                        this.props.dispatch(updateUserInfo(newUserInfo));
                        const newToken = response.data.token;
                        if (newToken) {
                            this.props.dispatch(loginWithToken(response.data.token));
                        }
                    } else {// fail creating a user
                        this.props.dispatch(snackbarMessage('Something went wrong, can not register, please try again'));
                    }
                    if (this.props.invitationCode) {
                        if (response.data.tripInfo) {
                            this.props.dispatch(updateSelectedTripWithInfo(response.data.tripInfo));
                            this.props.dispatch(push('/dashboard'));
                            this.props.dispatch(snackbarMessage('Welcome to your new trip!'));
                            this.props.dispatch(removeInvitationCode());
                        } else {
                            this.props.dispatch(snackbarMessage('can not joint the trip'));
                        }
                    } else {
                        this.handleDialogOpen();
                    }

                })
                .catch((error) => {
                    this.setState({
                        submitButtonDisable: false
                    });
                    console.error(error);
                    this.props.dispatch(snackbarMessage('Something went wrong, can not register, please try later'));
                });

        } else {
            this.props.dispatch(snackbarMessage('Please fill the form properly'));
        }
    }

    handlePressEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleDialogClose = () => {
        this.setState({
            isDialogOpen: false
        });
    }

    handleDialogOpen = () => {
        this.setState({
            isDialogOpen: true
        });
    }

    createNewTrip = () => {
        this.props.dispatch(push('/trip/new'));
        this.setState({
            isDialogOpen: false
        });
    }

    goToMyAccount = () => {
        this.props.dispatch(push('/myaccount'));
        this.setState({
            isDialogOpen: false
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <TextField
                    label="User Name"
                    onChange={this.handleUserNameChange}
                    error={Boolean(this.state.userNameErrMessage)}
                    helperText={this.state.userNameErrMessage}
                    onBlur={this.ValidateUserNameFormat}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Email"
                    helperText={this.state.emailErrMessage}
                    error={Boolean(this.state.emailErrMessage)}
                    onChange={this.handleEmailChange}
                    onBlur={this.ValidateEmailAvailable}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Phone Number"
                    helperText={this.state.phoneNumberErrMessage}
                    error={Boolean(this.state.phoneNumberErrMessage)}
                    onChange={this.handlePhoneNumberChange}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Password"
                    type="password"
                    helperText={this.state.passwordErrMessage}
                    error={Boolean(this.state.passwordErrMessage)}
                    onChange={this.handlePasswordChange}
                    onFocus={this.handlePasswordInputOnFocus}
                    onBlur={this.handlePasswordInputOnBlur}
                    className={classes.textField}
                    id='passwordInputField'
                /><br />

                <Paper className={classes.passwordRequirementPaper} style={{
                    display: (this.state.isPasswordInputOnFocus && !this.state.isPasswordFormatCorrect) ? 'block' : 'none'
                }}>
                    <p className={classes.popoverTitle}>Password must contain:</p>
                    <ul>
                        <li className={this.state.isPasswordContainLowercase ? classes.valid : classes.invalid}>
                            a lowercase letter</li>
                        <li className={this.state.isPasswordContainCapital ? classes.valid : classes.invalid}>
                            a CAPITAL letter</li>
                        <li className={this.state.isPasswordContainNumber ? classes.valid : classes.invalid}>
                            a number</li>
                        <li className={this.state.isPasswordSatisfyLengthRequirement ? classes.valid : classes.invalid}>
                            8 to 30 characters</li>
                    </ul>
                </Paper >
                <TextField
                    id='passwordCnfInputField'
                    label="Confirm Password"
                    type="password"
                    helperText={this.state.passwordConfirmErrMessage}
                    error={Boolean(this.state.passwordConfirmErrMessage)}
                    onChange={this.handlePasswordConfirmChange}
                    className={classes.textField}
                    onKeyPress={this.handlePressEnter}
                /> <br />
                <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleSubmit}
                    className={classes.registerButton}
                    disabled={this.state.submitButtonDisable}
                >
                    Register
                    </Button>

                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isDialogOpen}
                >
                    <DialogTitle >
                        {"Your account had successfully set up"}
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
                            onClick={this.createNewTrip}
                            className={classes.dialogButton}
                        >
                            Create a new Trip
            </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.goToMyAccount}
                            className={classes.dialogButton}
                        >
                            Setup my profile
            </Button>

                    </DialogActions>
                </Dialog>
            </div >
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

RegisterForm = withStyles(styles)(RegisterForm);
export default connect(mapStateToProps)(RegisterForm);