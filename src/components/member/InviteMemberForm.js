import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import settings from '../../config';
import { isEmailFormatOK } from '../utility/Validator';
import { connect } from 'react-redux';
import { snackbarMessage } from '../../actions';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    form: {
        marginTop: theme.spacing.unit * 2,
    },
    addButton: {
        margin: '10px 10px 5px 120px'
    },
    submitButton: {
        margin: '10px 10px 5px 120px'
    },
    chip: {
        margin: 4,
    },
    chipsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '230px',
        margin: '20px 0 0 0',
    },
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    copyButton: {
        margin: '0 3px 0 10px',
    },
    invitationLink: {
        width: '200px',
        fontSize: '16px',
        padding: '5px 0 5px 0',
        marginBottom: theme.spacing.unit,
    },
    textField: {
        width: '230px',
        // margin: theme.spacing.unit,
    }
});

class InviteMemberForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emailList: [],
            emailToAdd: '',
            emailErrMessage: '',
            message: '',
            subject: '',
            subjectErrMessage: '',
            messageErrMessage: '',
            submitButtonDisable: false,
        };
    }

    isFormReady = () => {
        if (
            this.state.subject && this.state.message && this.state.emailList && (
                !this.state.subjectErrMessage && !this.state.messageErrMessage
            )
        ) {
            return true
        } else {
            return false
        }
    }

    handleEmailChange = (event) => {
        this.setState({
            emailToAdd: event.target.value
        });
        if (this.state.emailErrMessage) {
            if (isEmailFormatOK(event.target.value)) {
                this.setState({
                    emailErrMessage: ''
                });
            }
        }
    };

    handleSubjectChange = (event) => {
        if (this.state.subjectErrMessage) {
            if (event.target.value.length < 101) {
                this.setState({
                    subjectErrMessage: '',
                    subject: event.target.value
                });
            }
        } else {
            if (event.target.value.length > 100) {
                this.setState({
                    subjectErrMessage: 'Subject must within 100 characters',
                    subject: event.target.value
                });
            } else {
                this.setState({
                    subject: event.target.value
                });
            }
        }
    }

    handleMessageChange = (event) => {
        if (this.state.messageErrMessage) {
            if (event.target.value.length < 1001) {
                this.setState({
                    messageErrMessage: '',
                    message: event.target.value
                });
            }
        } else {
            if (event.target.value.length > 1000) {
                this.setState({
                    messageErrMessage: 'Subject must within 1000 characters',
                    message: event.target.value
                });
            } else {
                this.setState({
                    message: event.target.value
                });
            }
        }
    }

    handleRequestDelete = (email) => {
        this.emailList = this.state.emailList;
        this.emailList.splice(email, 1);
        this.setState({ emailList: this.emailList });
    };

    renderChip(email) {
        return (
            <Chip
                key={email}
                label={email}
                onDelete={() => this.handleRequestDelete(email)}
                className={this.props.classes.chip}
            />
        );
    };

    handleSubmit = () => {
        if (this.isFormReady()) {
            this.setState({
                submitButtonDisable: true
            });
            axios({
                method: 'POST',
                url: settings.serverUrl + '/api/post/members/invite',
                json: true,
                headers: {
                    'x-access-token': localStorage.getItem('id_token'),
                },
                data: {
                    invitationCode: this.props.invitationCode,
                    tripId: this.props.tripId,
                    emailList: this.state.emailList,
                    message: this.state.message,
                    subject: this.state.subject
                }
            })
                .then((response) => {
                    if (response.data.success) {
                        this.props.push('/dashboard');
                        this.props.snackbarMessage('You had successfully invited ' + response.data.numberOfEmails + ' members');
                    } else {
                        this.setState({
                            submitButtonDisable: false
                        });
                        this.props.snackbarMessage('something went wrong please try again');
                    }
                })
                .catch((error) => {
                    this.props.snackbarMessage('Some went wrong...');
                });
        } else {
            this.props.snackbarMessage('Please fill up the form');
        }

    }

    handleAddEmail = () => {
        this.emailList = this.state.emailList;
        this.email = this.state.emailToAdd;

        if (this.emailList.includes(this.email)) {
            //TODO: flash message: Email already in the list
            this.setState({
                emailToAdd: ''
            });
        } else if (!isEmailFormatOK(this.email)) {
            this.setState({
                emailErrMessage: 'Invalid email format'
            });
        } else {
            this.emailList.push(this.email);
            this.setState({
                emailList: this.emailList,
                emailToAdd: ''
            });
        }
    }

    handlePressEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleAddEmail();
        }
    }

    handleCopyLink = (e) => {
        let invitationLink = document.getElementById('invitationLink');
        invitationLink.select();
        document.execCommand('copy');
        this.props.snackbarMessage('You had copied the link');
    }

    outFunc() {
        var tooltip = document.getElementById("linkTooltip");
        tooltip.innerHTML = "Copy to clipboard";
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.form}>
                <h3>{'Invite Member(s)'}</h3>
                <input type="text"
                    value={settings.serverUrl + `/trip/join?code=${this.props.invitationCode}`}
                    id="invitationLink"
                    onClick={this.handleCopyLink}
                    className={classes.invitationLink}
                    readOnly />
                <IconButton onClick={this.handleCopyLink}>
                    <Tooltip
                        placement="top-end"
                        title="Click to copy"
                    >
                        <Icon
                            className={classes.copyButton}
                        >
                            content_copy
                </Icon>
                    </Tooltip>
                </IconButton>
                <br />

                <TextField
                    label="Email"
                    onChange={this.handleEmailChange}
                    onKeyPress={this.handlePressEnter}
                    value={this.state.emailToAdd}
                    helperText={this.state.emailErrMessage}
                    error={Boolean(this.state.emailErrMessage)}
                    className={classes.textField}
                /><br />

                <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleAddEmail}
                    className={classes.addButton}

                >
                    Add
                </Button>
                <br />
                <TextField
                    label="Subject"
                    onChange={this.handleSubjectChange}
                    className={classes.textField}
                    helperText={this.state.subjectErrMessage}
                    error={Boolean(this.state.subjectErrMessage)}
                /><br />
                <TextField
                    label="Message"
                    multiline={true}
                    rows='3'
                    onChange={this.handleMessageChange}
                    className={classes.textField}
                    helperText={this.state.messageErrMessage}
                    error={Boolean(this.state.messageErrMessage)}
                /><br />
                {this.state.emailList.length > 0 &&
                    <div>
                        <div className={classes.chipsContainer}>
                            {this.state.emailList && this.state.emailList.map(this.renderChip, this)}
                        </div>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.submitButton}
                            disabled={this.state.submitButtonDisable}
                        >
                            Invite
                        </Button></div>
                }

                <Dialog
                    disableBackdropClick={true}
                    open={this.props.invitationCode ? false : true}
                >
                    <DialogTitle >
                        {"You don't have a trip yet"}
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
                            onClick={() => { this.props.push('/trip/new') }}
                            className={classes.dialogButton}
                        >
                            Create a new Trip
            </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={() => { this.props.push('/trip/join') }}
                            className={classes.dialogButton}
                        >
                            Joint a trip with invitation code
            </Button>

                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        invitationCode: state.selectedTrip.invitationCode,
        tripId: state.selectedTrip.tripId,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        push: (url) => {
            dispatch(push(url))
        },
        snackbarMessage: (message) => {
            dispatch(snackbarMessage(message))
        }
    }
}
InviteMemberForm.propTypes = {
    classes: PropTypes.object.isRequired,
};
InviteMemberForm = withStyles(styles)(InviteMemberForm);
export default connect(mapStateToProps, mapDispatchToProps)(InviteMemberForm)