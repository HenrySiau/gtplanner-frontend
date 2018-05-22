import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '../../css/googleMaps.css';
import { DateTimePicker } from 'material-ui-pickers';
import axios from 'axios';
import settings from '../../config';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    input: {
        margin: '0 10px 0 10px'
    },
});

class NewIdea extends React.Component {
    constructor(props) {
        super(props);
        this.autocomplete = null;
        this.geocoder = null;
        this.state = {
            isIdeaTitleErr: false,
            // default date will be either now or current trip's start date
            ideaStartDate: new Date(this.props.selectedTrip.startDate) > Date.now() ?
                new Date(this.props.selectedTrip.startDate) : Date.now(),
            ideaEndDate: new Date(this.props.selectedTrip.startDate) > Date.now() ?
                new Date(this.props.selectedTrip.startDate) : Date.now(),
            ideaTitle: '',
            ideaTitleErrText: '',
            isIdeaAddressErr: false,
            ideaAddressErrText: '',
            isIdeaDescriptionErr: false,
            ideaDescriptionErrText: '',
            submitButtonDisabled: false,
            type: '',
            inItinerary: false,
            typeHelperText: '',
            isTypeError: false,
        }
    }

    componentDidMount() {
        this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('googleMapAutocomplete'));
        this.geocoder = new window.google.maps.Geocoder();
    }

    handleTitleBlur = (event) => {
        if (event.target.value.length === 1) {
            this.setState({
                isIdeaTitleErr: true,
                ideaTitleErrText: 'Title must be at least 2 characters'
            });
        }
        if (event.target.value.length === 0) {
            this.setState({
                isIdeaTitleErr: false,
                ideaTitleErrText: ''
            });
        }

    }
    handleTitleChange = (event) => {
        if (this.state.isIdeaTitleErr) {
            if (event.target.value.length > 1 && event.target.value.length < 31) {
                this.setState({
                    isIdeaTitleErr: false,
                    ideaTitle: event.target.value,
                    ideaTitleErrText: '',
                })
            }
        } else {
            if (event.target.value.length > 30) {
                this.setState({
                    isIdeaTitleErr: true,
                    ideaTitleErrText: 'Title must less than 30 characters',
                    ideaTitle: event.target.value,
                });
            } else {
                this.setState({
                    ideaTitle: event.target.value
                });
            }
        }
    }

    validateAll = (data) => {
        if (data.title.length > 30 || data.title.length < 2) {
            this.setState({
                isIdeaTitleErr: true,
                ideaTitleErrText: 'Title must be 2 - 30 characters',
            });
            return false
        } else {
            this.setState({
                isIdeaTitleErr: false,
            });
        }
        if (!data.address) {
            this.setState({
                isIdeaAddressErr: true,
                ideaAddressErrText: 'Please complete the address',
            });
            return false
        } else {
            this.setState({
                isIdeaAddressErr: false,
            });
        }
        if (!data.startAt || !data.endAt) {
            return false
        }
        if (!data.tripId) {
            return false
        }
        if (data.description.length > 500) {
            this.setState({
                isIdeaDescriptionErr: true,
                ideaDescriptionErrText: 'Description must less than 500 characters',
            });
            return false
        }
        if (!data.type) {
            this.setState({
                isTypeError: true,
                typeHelperText: 'please select a idea type',
            });
            return false
        }

        return true
    }
    handleSubmit = () => {
        let ideaData = {
            title: this.state.ideaTitle,
            address: document.getElementById('googleMapAutocomplete').value,
            description: document.getElementById('ideaDescription').value,
            link: document.getElementById('ideaLink').value,
            startAt: this.state.ideaStartDate,
            endAt: this.state.ideaEndDate,
            tripId: this.props.selectedTrip.tripId,
            userId: this.props.userInfo.userId,
            inItinerary: this.state.inItinerary,
            type: this.state.type,
        }
        if (this.validateAll(ideaData)) {
            console.log('address : ' + ideaData.address);
            this.geocoder.geocode({ 'address': ideaData.address }, (result, status) => {
                if (status === 'OK') {
                    if (result) {
                        console.log(result);
                        console.log(result[0].geometry.location.lat());
                        console.log(result[0].geometry.location.lng());
                        ideaData.lat = result[0].geometry.location.lat();
                        ideaData.lng = result[0].geometry.location.lng();

                        this.setState({ submitButtonDisabled: true })
                        axios({
                            method: 'POST',
                            url: settings.serverUrl + '/api/post/idea/new',
                            json: true,
                            headers: {
                                'x-access-token': localStorage.getItem('id_token'),
                            },
                            data: { idea: ideaData }
                        })
                            .then((response) => {
                                if (response.data.newIdea) {
                                    this.props.toggleDialogClose();
                                    this.props.addIdea(response.data.newIdea);
                                    console.log(response.data);
                                } else {
                                    console.log('not success');
                                    this.setState({ submitButtonDisabled: false })
                                }
                            })
                            .catch((error) => {
                                // TODO: show error message and guide user to re submit
                                console.error(error);
                            });
                    }
                } else {
                    console.error('can not find this address in the map');
                }
            });
        } else {
            this.props.snackbarMessage('Please complete the form');
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <TextField
                    id='ideaTitleInput'
                    label="Title"
                    error={this.state.isIdeaTitleErr}
                    helperText={this.state.ideaTitleErrText}
                    className={classes.input}
                    margin="normal"
                    onBlur={this.handleTitleBlur}
                    onChange={this.handleTitleChange}
                /><br />
                <FormControl className={classes.formControl} error={this.state.isTypeError}>
                    <InputLabel htmlFor="type-native-simple">Type</InputLabel>
                    <Select
                        native
                        value={this.state.type}
                        onChange={(event) => { this.setState({ type: event.target.value }) }}
                        inputProps={{
                            id: 'type-native-simple',
                        }}
                    >
                        <option value="" />
                        <option value={'Activity'}>Activity</option>
                        <option value={'Restaurant'}>Restaurant</option>
                        <option value={'Hotel'}>Hotel</option>
                        <option value={'Transport'}>Transport</option>
                    </Select>
                    <FormHelperText>{this.state.typeHelperText}</FormHelperText>
                </FormControl>
                <br />
                <TextField
                    id="googleMapAutocomplete"
                    label="Address"
                    className={classes.input}
                    onChange={this.handleAddressChange}
                    margin="normal"
                    // onBlur={this.handleAddressChangeOnBlur}
                    error={this.state.isIdeaAddressErr}
                    helperText={this.state.ideaAddressErrText}
                /><br />
                <TextField
                    id="ideaLink"
                    label="Link or website"
                    className={classes.input}
                    margin="normal"
                /><br />
                <DateTimePicker
                    id="ideaStartDate"
                    value={this.state.ideaStartDate}
                    disablePast
                    minDate={this.props.selectedTrip.startDate}
                    maxDate={this.props.selectedTrip.endDate}
                    onChange={(date) => { this.setState({ ideaStartDate: date }) }}
                    label="Start Date"
                    format="YYYY/MM/DD hh:mm A"
                /><br />
                <DateTimePicker
                    id="ideaEndDate"
                    value={this.state.ideaEndDate}
                    disablePast
                    minDate={this.props.selectedTrip.startDate}
                    maxDate={this.props.selectedTrip.endDate}
                    onChange={(date) => { this.setState({ ideaEndDate: date }) }}
                    label="End Date"
                    format="YYYY/MM/DD hh:mm A"
                /><br />

                <TextField
                    id="ideaDescription"
                    label="Description"
                    multiline
                    rows='3'
                    className={classes.input}
                    margin="normal"
                    error={this.state.isIdeaDescriptionErr}
                    helperText={this.state.ideaDescriptionErrText}
                /><br />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.inItinerary}
                            onChange={(event) => { this.setState({ inItinerary: event.target.checked }) }}
                            value="inItinerary"
                            color="primary"
                        />
                    }
                    label="Add to itinerary"
                /><br />
                <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleSubmit}
                    className={classes.dialogButton}
                    disabled={this.state.submitButtonDisabled}
                >
                    Submit
            </Button>
                <Button
                    variant="raised"
                    color="primary"
                    onClick={this.props.toggleDialogClose}
                    className={classes.dialogButton}
                >
                    Cancel
            </Button>
            </div >
        )
    }
}


export default withStyles(styles)(NewIdea)