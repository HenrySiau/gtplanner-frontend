import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '../../css/googleMaps.css';
import { DateTimePicker } from 'material-ui-pickers';
import axios from 'axios';
import settings from '../../config';

const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    input: {
        margin: '0 10px 0 10px'
    },
});

class NewIdeal extends React.Component {
    constructor(props) {
        super(props);
        this.autocomplete = null;
        this.geocoder = null;
        this.state = {
            isIdealTitleErr: false,
            // default date will be either now or current trip's start date
            idealStartDate: this.props.selectedTrip.startDate > Date.now() ? this.props.selectedTrip.startDate : Date.now(),
            idealEndDate: this.props.selectedTrip.startDate > Date.now() ? this.props.selectedTrip.startDate : Date.now(),
            lat: null,
            lng: null,
        }
    }

    componentDidMount() {
        this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('googleMapAutocomplete'));
        this.geocoder = new window.google.maps.Geocoder();
    }

    validateIdealTitleLength = () => {
        console.log('validateIdealTitleLength');
    }
    handleEndDateChange = stateName => (date) => {
        console.log(stateName);
        console.log(date);
        console.log('selectedTrip: ' + this.props.selectedTrip);
        console.log('userInfo: ' + this.props.userInfo);
        this.props.snackbarMessage('date');
    }
    getGeoCode = () => {
        this.geocoder.geocode({ 'address': document.getElementById('googleMapAutocomplete').value }, (result, status) => {
            if (status === 'OK') {
                if (result) {
                    console.log(result[0].geometry.location.lat());
                    console.log(result[0].geometry.location.lng());
                    this.setState({
                        lat: result[0].geometry.location.lat(),
                        lng: result[0].geometry.location.lng(),
                    })
                }
            } else {
                console.error('can not find this address in the map');
            }
        });
    }
    onSubmit = () => {

    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <TextField
                    id='idealTitleInput'
                    label="Title"
                    error={this.state.isIdealTitleErr}
                    helperText={this.state.idealTitleErrText}
                    className={classes.input}
                    margin="normal"
                    onBlur={this.validateIdealTitleLength}
                /><br />
                <TextField
                    id="googleMapAutocomplete"
                    label="Address"
                    className={classes.input}
                    onChange={this.handleAddressChange}
                    margin="normal"
                    onBlur={this.getGeoCode}
                /><br />
                <TextField
                    id="idealLink"
                    label="Link or website"
                    className={classes.input}
                    margin="normal"
                /><br />
                <DateTimePicker
                    id="idealStartDate"
                    value={this.state.idealStartDate}
                    disablePast
                    minDate={this.props.selectedTrip.startDate}
                    maxDate={this.props.selectedTrip.endDate}
                    onChange={(date) => { this.setState({ idealStartDate: date }) }}
                    label="Start Date"
                    format="YYYY/MM/DD hh:mm A"
                /><br />
                <DateTimePicker
                    id="idealEndDate"
                    value={this.state.idealEndDate}
                    disablePast
                    minDate={this.props.selectedTrip.startDate}
                    maxDate={this.props.selectedTrip.endDate}
                    onChange={this.handleEndDateChange('stateName: idealEndDate')}
                    label="End Date"
                    format="YYYY/MM/DD hh:mm A"
                /><br />

                <TextField
                    id="idealDescription"
                    label="Description"
                    multiline
                    rows='3'
                    className={classes.input}
                    margin="normal"
                /><br />
                <Button
                    variant="raised"
                    color="primary"
                    onClick={() => { console.log('value: ' + document.getElementById('idealEndDate').value) }}
                    className={classes.dialogButton}
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
            </div>
        )
    }
}


export default withStyles(styles)(NewIdeal)