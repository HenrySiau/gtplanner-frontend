import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '../../css/dashboard.css';
import { DateTimePicker } from 'material-ui-pickers';
import axios from 'axios';
import settings from '../../config';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import AvatarEditor from 'react-avatar-editor'

const styles = theme => ({
    root: {
        width: 500,
        display: 'flex',
        // alignContent: 'center',
        flexDirection: 'column',
        justifyContent: 'center',

    },
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    input: {
        margin: '10px',
        width: 450,
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
                new Date(this.props.selectedTrip.startDate) : new Date(),
            ideaEndDate: new Date(this.props.selectedTrip.startDate) > Date.now() ?
                new Date(this.props.selectedTrip.startDate) : new Date(),
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
            imageFile: '',
            imageScale: 1,
            imageType: 'image/png',
            isImageReady: false,
            coverImageError: false,
        }
    }

    componentDidMount() {
        this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('googleMapAutocomplete'));
        this.geocoder = new window.google.maps.Geocoder();
        this.imageFileInput = document.getElementById('imageFileInput');
        this.imageZoomSlider = document.getElementById('imageZoomSlider');
        const that = this;
        this.imageZoomSlider.oninput = function () {
            that.setState({ imageScale: Number(this.value) / 100 });
        }

        let fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            this.setState({
                imageFile: fileReader.result,
                isImageReady: true,
                coverImageError: false,
            });

        }, false);
        this.imageFileInput.addEventListener('change', () => {
            let file = this.imageFileInput.files[0];

            if (file) {
                fileReader.readAsDataURL(file);
                console.log('imageType: ' + file.type);
                this.setState({ imageType: file.type })
            }
        })
    }

    setImageEditorRef = (editor) => this.ImageEditor = editor

    handleTitleBlur = (event) => {
        if (event.target.value.length === 1) {
            this.setState({
                isIdeaTitleErr: true,
                ideaTitleErrText: 'Title must be 2-30 characters'
            });
        }
        if (event.target.value.length === 0) {
            if (!this.state.isIdeaTitleErr) {
                this.setState({
                    isIdeaTitleErr: false,
                    ideaTitleErrText: ''
                });
            }
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
    handleTypeChange = event => {
        if (this.state.typeHelperText) {
            this.setState({
                isTypeError: false,
                typeHelperText: '',
                type: event.target.value
            });
        } else {
            this.setState({
                type: event.target.value
            });
        }
    }

    validateAll = (data) => {
        let result = true;
        if (data.title.length > 30 || data.title.length < 2) {
            this.setState({
                isIdeaTitleErr: true,
                ideaTitleErrText: 'Title must be 2 - 30 characters',
            });
            result = false
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
            result = false
        } else {
            this.setState({
                isIdeaAddressErr: false,
            });
        }
        if (!data.startAt || !data.endAt) {
            result = false
        }
        if (!data.tripId) {
            result = false
        }
        if (data.description.length > 500) {
            this.setState({
                isIdeaDescriptionErr: true,
                ideaDescriptionErrText: 'Description must less than 500 characters',
            });
            result = false
        }
        if (!data.type) {
            this.setState({
                isTypeError: true,
                typeHelperText: 'please select a idea type',
            });
            result = false
        }
        if (!this.state.isImageReady) {
            this.setState({
                coverImageError: true
            });
            result = false
        }
        return result;
    }

    handleSubmit = () => {
        let ideaData = {
            title: this.state.ideaTitle,
            address: document.getElementById('googleMapAutocomplete').value,
            description: document.getElementById('ideaDescription').value,
            link: document.getElementById('ideaLink').value,
            startAt: this.state.ideaStartDate.toString(),
            endAt: this.state.ideaEndDate.toString(),
            tripId: this.props.selectedTrip.tripId,
            userId: this.props.userInfo.userId,
            inItinerary: this.state.inItinerary ? 1 : 0,
            type: this.state.type,
        }
        if (this.validateAll(ideaData)) {
            this.geocoder.geocode({ 'address': ideaData.address }, (result, status) => {
                if (status === 'OK') {
                    if (result) {
                        let data = new FormData();
                        ideaData.lat = result[0].geometry.location.lat();
                        ideaData.lng = result[0].geometry.location.lng();
                        data.append('lat', result[0].geometry.location.lat());
                        data.append('lng', result[0].geometry.location.lng());
                        const canvas = this.ImageEditor.getImage();
                        canvas.toBlob(blob => {
                            data.append('imageData', blob);
                            data.append('title', ideaData.title);
                            data.append('address', ideaData.address);
                            data.append('description', ideaData.description);
                            data.append('link', ideaData.link);
                            data.append('startAt', ideaData.startAt);
                            data.append('endAt', ideaData.endAt.toString());
                            data.append('tripId', ideaData.tripId.toString());
                            data.append('userId', ideaData.userId);
                            data.append('inItinerary', ideaData.inItinerary);
                            data.append('type', ideaData.type);
                            data.append('imageType', this.state.imageType);
                            data.append('idea', ideaData);
                            this.setState({ submitButtonDisabled: true });
                            axios({
                                method: 'POST',
                                url: settings.serverUrl + '/api/post/idea/new',
                                json: true,
                                headers: {
                                    'x-access-token': localStorage.getItem('id_token'),
                                },
                                data: data,
                            })
                                .then(response => {
                                    console.log(response);
                                    let newIdea = response.data.newIdea;
                                    if (newIdea) {
                                        console.log('newIdea: ' + newIdea);
                                        this.props.toggleDialogClose();
                                        this.props.handleNewIdea(newIdea);
                                    } else {
                                        console.log('not success');
                                        this.setState({ submitButtonDisabled: false });
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                })

                        }, this.state.imageType, 1);
                    } // if result
                } // if status === ok
                else {
                    console.error('can not find this address in the map');
                }
            }); // geocode()
        } else {
            this.props.snackbarMessage('Please complete the form');
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                
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
                <FormControl className={classes.input} error={this.state.isTypeError}>
                    <InputLabel htmlFor="type-native-simple">Type</InputLabel>
                    <Select
                        native
                        value={this.state.type}
                        onChange={this.handleTypeChange}
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
                </FormControl><br />
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
                    className={classes.input}
                /><br />
                <div className={classes.input}>
                    <AvatarEditor
                        ref={this.setImageEditorRef}
                        image={this.state.imageFile}
                        width={400}
                        height={300}
                        border={[40, 30]}
                        scale={this.state.imageScale}
                    />
                    <input id='imageFileInput' name="Image File" type="file" accept="image/*" /><br />
                    {/* <p>Zoom</p> */}
                    {this.state.coverImageError && <p style={{ color: 'red' }}>{'** image required **'} </p>}
                    <label>Zoom  </label><br />
                    <input id="imageZoomSlider" type="range" min="100" max="400" defaultValue="100" style={{ width: '450px' }} />
                    <br />
                </div>
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
                    className={classes.input}
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
                    className={classes.input}
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
                <div>
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={this.props.toggleDialogClose}
                        className={classes.dialogButton}
                    >
                        Cancel
            </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={this.handleSubmit}
                        // onClick={this.testImageUpload}
                        className={classes.dialogButton}
                        disabled={this.state.submitButtonDisabled}
                    >
                        Submit
            </Button>

                </div>
            </div >
        )
    }
}


export default withStyles(styles)(NewIdea)