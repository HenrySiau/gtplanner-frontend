import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DatePicker } from 'material-ui-pickers';
import axios from 'axios';
import settings from '../../config';
import { connect } from 'react-redux';
import { snackbarMessage, updateSelectedTripWithInfo } from '../../actions';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        marginLeft: '130px',
    },

    input: {
        margin: theme.spacing.unit,
        width: '250px'
    },
});

class CreateTripForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tripName: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(),
            isTripNameErr: false,
            isDescriptionErr: false,
            tripNameErrText: '',
            descriptionErrText: '',
            submitButtonDisable: false

        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // toggleLogin = this.props.toggleLogin;
    handleTripNameChange = (event) => {
        if (this.state.isTripNameErr) {
            if (event.target.value.length < 31 && event.target.value.length > 1) {
                this.setState({
                    tripName: event.target.value,
                    isTripNameErr: false,
                    tripNameErrText: '',
                });
            }
        } else {
            if (event.target.value.length > 30) {
                this.setState({
                    isTripNameErr: true,
                    tripNameErrText: 'Trip name must less than 30 characters'
                });
            } else {
                this.setState({
                    tripName: event.target.value
                });
            }
        }
    };

    validateTripNameLength = () => {
        if (this.state.tripName.length < 2) {
            this.setState({
                isTripNameErr: true,
                tripNameErrText: 'Trip name must at least 2 characters'
            });
        }
    }
    handleDescriptionChange = (event) => {
        if (this.state.isDescriptionErr) {
            if (event.target.value.length < 301) {
                this.setState({
                    description: event.target.value,
                    isDescriptionErr: false,
                    descriptionErrText: '',
                });
            }
        } else {
            if (event.target.value.length > 300) {
                this.setState({
                    isDescriptionErr: true,
                    descriptionErrText: 'Trip name must less than 300 characters'
                });
            } else {
                this.setState({
                    description: event.target.value
                });
            }
        }
    }
    handleSubmit = () => {
        if (!(this.state.isTripNameErr || this.state.isDescriptionErr || this.state.tripName.length === 0)) {
            this.setState({ submitButtonDisable: true });
            axios({
                method: 'POST',
                url: settings.serverUrl + '/api/post/trip/new',
                json: true,
                headers: {
                    'x-access-token': localStorage.getItem('id_token'),
                },
                data: {
                    tripName: this.state.tripName,
                    description: this.state.description,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }
            })
                .then((response) => {
                    // TODO: Redirect to create my first trip
                    console.log('Create a new Trip response: ' + response.data);
                    if (response.data.tripInfo) {
                        this.props.dispatch(updateSelectedTripWithInfo(response.data.tripInfo));
                        this.props.dispatch(push('/members/invite/'));
                        this.props.dispatch(snackbarMessage(`Congratulations! You had successfully created a trip, let's invite members!`));
                    } else {
                        this.setState({ submitButtonDisable: false });
                        this.props.dispatch(snackbarMessage('Something went wrong, Please submit again'));
                    }
                })
                .catch((error) => {
                    // TODO: show error message and guide user to re submit
                    console.error(error);
                    this.setState({ submitButtonDisable: false });
                    this.props.dispatch(snackbarMessage('Something went wrong, Please submit again'));
                });
        } else {
            console.log('Please complete the form');
            this.props.dispatch(snackbarMessage('Please complete the form'));
        }
    }

    handleChangeStartDate = (date) => {
        if (date.getTime() > this.state.endDate.getTime()) {
            this.setState({
                startDate: date,
                endDate: date,
            });
        } else {
            this.setState({
                startDate: date
            });
        }

    }

    handleChangeEndDate = (date) => {
        this.setState({
            endDate: date
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <br/>
                <Typography variant="headline" gutterBottom>
                    Create A Trip
      </Typography>
                <TextField
                    id='tripNameInput'
                    label="Trip Name"
                    onChange={this.handleTripNameChange}
                    error={this.state.isTripNameErr}
                    helperText={this.state.tripNameErrText}
                    className={classes.input}
                    margin="normal"
                    onBlur={this.validateTripNameLength}
                /><br />
                <DatePicker
                    value={this.state.startDate}
                    placeholder=""
                    onChange={this.handleChangeStartDate}
                    label="Start Date"
                    autoOk={true}
                    // minDate is time sensitive
                    minDate={new Date().setHours(0, 0, 0, 0)}
                    className={classes.input}
                /><br />
                <DatePicker
                    value={this.state.endDate}
                    onChange={this.handleChangeEndDate}
                    label="End Date"
                    autoOk={true}
                    minDate={this.state.startDate}
                    className={classes.input}

                /><br />

                <TextField
                    label="Description"
                    multiline={true}
                    rows='3'
                    onChange={this.handleDescriptionChange}
                    className={classes.input}
                    error={this.state.isDescriptionErr}
                    helperText={this.state.descriptionErrText}
                /><br />
                <Button
                    variant="raised"
                    color="primary"
                    className={classes.button}
                    onClick={this.handleSubmit}
                    disabled={this.state.submitButtonDisable}
                >
                    Create
                </Button>
            </div>
        );
    }
}

CreateTripForm = withStyles(styles)(CreateTripForm);
export default connect()(CreateTripForm);