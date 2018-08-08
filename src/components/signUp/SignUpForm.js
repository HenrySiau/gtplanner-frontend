import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import axios from 'axios';
import settings from '../../config';
import { isEmailFormatOK, strip } from '../utility/Validator';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    container: {
        margin: '10px',
        height: 500
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

class SignUPForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // userName
            userName: '',
            userNameErrMessage: '',

            // email
            email: '',
            emailErrMessage: '',
            emailAlreadyExist: false,
            isEmailFormatIncorrect: false,

            // phoneNumber
            phoneNumber: '',
            phoneNumberErrMessage: '',

            // password
            password: '',
            passwordErrMessage: '',
            isPasswordInputOnFocus: false,
            isPasswordContainLowercase: false,
            isPasswordContainCapital: false,
            isPasswordContainNumber: false,
            isPasswordSatisfyLengthRequirement: false,
            isPasswordFormatCorrect: false,

            // passwordConfirm
            passwordConfirm: '',
            passwordConfirmErrMessage: '',


            isDialogOpen: false,
            submitButtonDisable: false,

        };
    }

    componentDidMount = () => {
        this.setState({
            popoverAnchor: document.querySelector('#passwordInputField'),
            anchorEl2: document.querySelector('#passwordCnfInputField')
        });

    }

    // userName functions
    userNameOnChange = (event) => {
        const userName = strip(event.target.value);
        this.setState({
            userName: userName,
        });
        if (userName) {
            // userName format is correct
            if (userName.length < 21 && userName.length > 1) {
                if (this.state.userNameErrMessage) {
                    this.setState({
                        userName: userName,
                        userNameErrMessage: '',
                    });
                } else {
                    this.setState({
                        userName: userName,
                        isUsernameFormatOk: true,
                    })
                }

            } else if (userName.length > 20) {    // userName format incorrect
                if (!this.state.userNameErrMessage) {
                    this.setState({
                        userNameErrMessage: 'User Name must between 2-20 characters',
                    })
                }
            }

        }
    }
    userNameOnBlur = (event) => {
        const userName = strip(event.target.value);
        // if userName format does not meet requirements
        if (userName.length < 2 || userName.length > 21) {
            this.setState({
                userNameErrMessage: 'User Name must between 2-20 characters'
            });
        } else {
            this.setState({
                userNameErrMessage: ''
            });
        }
    }
    // end userName functions

    // email functions
    emailOnchange = (event) => {
        const email = strip(event.target.value);
        if (email) {
            if (isEmailFormatOK(email)) { // if email format ok
                this.setState({
                    email: email
                })
                if (this.state.emailAlreadyExist) {
                    if (email !== this.state.email) {
                        this.setState({
                            emailAlreadyExist: false,
                            emailErrMessage: '',
                        })
                    }
                }
                if (this.state.isEmailFormatIncorrect) {
                    this.setState({
                        isEmailFormatIncorrect: false,
                        emailErrMessage: '',
                    })
                }
                if (this.state.emailErrMessage) {
                    this.setState({
                        emailErrMessage: '',
                    });
                }

            }
        }


        // clear error message if format is ok
        if (this.state.isEmailFormatIncorrect) {
            if (isEmailFormatOK(email)) {
                this.setState({
                    isEmailFormatIncorrect: false,
                    emailErrMessage: ''
                });
            }
        }

        // clear emailAlreadyExist err message when updating email
        if (this.state.emailAlreadyExist) {
            if (email !== this.state.email) {
                this.setState({
                    emailAlreadyExist: false,
                    emailErrMessage: ''
                });
            }
        }
    }

    emailOnBlur = (event) => {
        let email = strip(event.target.value);
        if (isEmailFormatOK(email)) {
            axios.post(settings.serverUrl + '/api/post/email/exist', {
                email: email,
            })
                .then((response) => {
                    if (response.data) {
                        if (response.data.exist) {
                            this.setState({
                                emailErrMessage: 'This Email already registered',
                                emailAlreadyExist: true
                            });
                        }
                        if (response.data.exist === false) {
                            if (this.state.emailAlreadyExist) {
                                this.setState({
                                    emailErrMessage: '',
                                    emailAlreadyExist: true
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    // TODO: show error message and guide user to re submit
                    console.log(error);
                    this.props.snackbarMessage('Network or Server error');
                });


        } else {
            this.setState({
                emailErrMessage: 'Email format incorrect',
                isEmailFormatIncorrect: true
            });
        }
    }
    // end email functions

    // phoneNumber functions
    phoneNumberOnChange = (event) => {
        const phoneNumber = strip(event.target.value);
        if (phoneNumber.length > 20) {
            this.setState({
                phoneNumberErrMessage: 'Phone Number must less than 20 characters',
            });
        } else {
            this.setState({
                phoneNumber: event.target.value,
            });
        }
        if (this.state.phoneNumberErrMessage) {
            if (phoneNumber.length < 21) {
                this.setState({
                    phoneNumberErrMessage: '',
                });
            }
        }
    }
    // end phoneNumber functions

    // password functions
    validatePasswordFormat = (password) => {
        if (password.match(/[a-z][A-Z][0-9]/g) && password.match(/^.{7,31}$/)) {
            return true;
        } else {
            return false;
        }
    }
    passwordOnChange = (event) => {
        const password = strip(event.target.value);

        if (this.validatePasswordFormat(password)) {
            if (this.state.passwordErrMessage) {
                this.setState({
                    isPasswordFormatCorrect: true,
                    password: password,
                    passwordErrMessage: '',
                });
            } else {
                this.setState({
                    isPasswordFormatCorrect: true,
                    password: password
                });
            }
        }

        // validate lowercase
        if (password.match(/[a-z]/g)) {
            this.setState({
                isPasswordContainLowercase: true
            });
        } else {
            this.setState({
                isPasswordContainLowercase: false
            });
        }
        // validate capital letter
        if (password.match(/[A-Z]/g)) {
            this.setState({
                isPasswordContainCapital: true
            });
        } else {
            this.setState({
                isPasswordContainCapital: false
            });
        }
        // validate number
        if (password.match(/[0-9]/g)) {
            this.setState({
                isPasswordContainNumber: true
            });
        } else {
            this.setState({
                isPasswordContainNumber: false
            });
        }
        //validate length
        if (password.length > 7 && password.length < 31) {
            this.setState({
                isPasswordSatisfyLengthRequirement: true
            });
        } else {
            this.setState({
                isPasswordSatisfyLengthRequirement: false
            });
        }
    }
    passwordOnFocus = () => {
        this.setState({
            isPasswordInputOnFocus: true
        });
    }
    passwordOnBlur = (event) => {
        const password = strip(event.target.value);
        this.setState({
            isPasswordInputOnFocus: false
        });
        if (!this.validatePasswordFormat(password)) {
            this.setState({
                passwordErrMessage: 'Password format incorrect'
            })
        }
    }
    // end password functions

    // password confirm functions
    passwordConfirmOnChange = (event) => {
        const passwordConfirm = strip(event.target.value);
        const passwordConfirmLength = passwordConfirm.length;
        const passwordSlice = this.state.password.slice(0, passwordConfirmLength);

        if (passwordConfirm) {
            if (!this.state.isPasswordFormatCorrect) {
                this.setState({
                    passwordConfirmErrMessage: 'please finish password first'
                })

            } else {  // password had finished
                if (passwordConfirm !== passwordSlice) {
                    this.setState({
                        passwordConfirmErrMessage: `password doesn't match`
                    });
                } else {
                    this.setState({
                        passwordConfirm: event.target.value,
                        passwordConfirmErrMessage: ''
                    });
                }
            }
        }
    }

    passwordConfirmOnBlur = (event) => {
        const passwordConfirm = strip(event.target.value);
        const password = this.state.password;
        if (passwordConfirm) {
            if (passwordConfirm !== password) {
                this.setState({
                    passwordConfirmErrMessage: `password doesn't match`
                });
            }
        }
    }

    passwordConfirmOnPressEnter = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }
    // end password confirm functions

    handleDialogOpen = () => {
        this.setState({
            isDialogOpen: true
        });
    }
    createNewTrip = () => {
        this.props.push('/trip/new');
        this.setState({
            isDialogOpen: false
        });
    }

    goToMyAccount = () => {
        this.props.push('/myaccount');
        this.setState({
            isDialogOpen: false
        });
    }
    // handleSubmit
    isFormReady = (data) => {
        let result = true;
        if (data.userName) {
            if (data.userName.length > 20 || data.userName < 2) {
                result = false;
                this.setState({
                    userNameErrMessage: 'User Name must between 2-20 characters'
                });
            }
        } else {
            result = false;
            this.setState({
                userNameErrMessage: 'User Name must between 2-20 characters'
            });
        }

        if (data.email) {
            if (!isEmailFormatOK(data.email)) {
                result = false;
                this.setState({
                    emailErrMessage: 'Email format incorrect'
                });
            } else { // email format correct but already been registered
                if (this.state.emailAlreadyExist) {
                    result = false;
                    this.setState({
                        emailErrMessage: 'This Email already registered'
                    });
                }
            }
        } else {
            result = false;
            this.setState({
                emailErrMessage: 'Email required'
            });
        }

        if (data.password) {
            if (!this.validatePasswordFormat(data.password)) {
                result = false;
                this.setState({
                    passwordErrMessage: 'Password format incorrect'
                });
            }
        } else {
            result = false;
            this.setState({
                passwordErrMessage: 'Password required'
            });
        }

        if (data.password && data.passwordConfirm) {
            if (data.password !== data.passwordConfirm) {
                result = false;
                this.setState({
                    passwordConfirmErrMessage: `password doesn't match`
                });
            }
        } else {
            result = false;
            this.setState({
                passwordConfirmErrMessage: `password confirm required`
            });
        }


        return result

    }
    handleSubmit = () => {
        const data = {
            userName: this.state.userName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm,
            invitationCode: this.props.invitationCode
        }
        if (this.isFormReady(data)) {
            this.setState({
                submitButtonDisable: true
            });
            axios.post(settings.serverUrl + '/api/post/user/register', data)
                .then((response) => {
                    if (response.data) {
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
                            const newToken = response.data.token;
                            if (newToken) {
                                this.props.loginWithToken(response.data.token);
                            }
                        } else {// fail creating a user
                            this.props.snackbarMessage('Something went wrong, can not register, please try again');
                        }
                        if (this.props.invitationCode) {
                            if (response.data.tripInfo) {
                                this.props.updateSelectedTripWithInfo(response.data.tripInfo);
                                this.props.push('/dashboard');
                                this.props.snackbarMessage('Welcome to your new trip!');
                                this.props.removeInvitationCode();
                            } else {
                                this.props.snackbarMessage('can not joint the trip');
                            }
                        } else {
                            this.handleDialogOpen();
                        }
                    }
                })
                .catch((error) => {
                    this.setState({
                        submitButtonDisable: false
                    });
                    console.error(error);
                    this.props.snackbarMessage('Something went wrong, can not register, please try later');
                });
        } else {
            this.props.snackbarMessage('Please fill the form properly according to the hints');
        }

    }
    // end handleSubmit
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <Typography variant="headline" gutterBottom>
                    Sign UP
      </Typography>
                <TextField
                    label="User Name"
                    onChange={this.userNameOnChange}
                    error={Boolean(this.state.userNameErrMessage)}
                    helperText={this.state.userNameErrMessage}
                    onBlur={this.userNameOnBlur}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Email"
                    helperText={this.state.emailErrMessage}
                    error={Boolean(this.state.emailErrMessage)}
                    onChange={this.emailOnchange}
                    onBlur={this.emailOnBlur}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Phone Number"
                    helperText={this.state.phoneNumberErrMessage}
                    error={Boolean(this.state.phoneNumberErrMessage)}
                    onChange={this.phoneNumberOnChange}
                    className={classes.textField}
                /><br />
                <TextField
                    label="Password"
                    type="password"
                    helperText={this.state.passwordErrMessage}
                    error={Boolean(this.state.passwordErrMessage)}
                    onChange={this.passwordOnChange}
                    onFocus={this.passwordOnFocus}
                    onBlur={this.passwordOnBlur}
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
                    // id='passwordCnfInputField'
                    label="Confirm Password"
                    type="password"
                    helperText={this.state.passwordConfirmErrMessage}
                    error={Boolean(this.state.passwordConfirmErrMessage)}
                    onChange={this.passwordConfirmOnChange}
                    className={classes.textField}
                    onKeyPress={this.passwordConfirmOnPressEnter}
                    onBlur={this.passwordConfirmOnBlur}
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

SignUPForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUPForm);