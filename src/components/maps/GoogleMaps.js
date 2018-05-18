import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NewIdeal from '../forms/NewIdeal';

const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
});

class GoogleMaps extends React.Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.autocomplete = null;
        this.addressInput = React.createRef();
        this.state = {
            isDialogOpen: false,

        }
    }


    componentDidMount() {
        const { isScriptLoadSucceed } = this.props;
        if (isScriptLoadSucceed) {
            this.map = new window.google.maps.Map(document.getElementById('googleMap'), {
                zoom: 12,
                center: { lat: 37.7749300, lng: -122.4194200 }
            });
            console.log('google map loaded');
            this.props.filteredMarkerList.forEach(place => {
                console.log('place: ' + place.lat);
                var marker = new window.google.maps.Marker({
                    position: place,
                    title: 'Hello',
                    map: this.map,
                })
            })
            console.log('addressInput: ' + this.addressInput.current)
        } else {
            console.log('google map did not load');
        }

    }
    componentDidUpdate(prevProps) {
        if (prevProps.filteredMarkerList !== this.props.filteredMarkerList) {
            console.log('componentDidUpdate');
        }

    }

    handleDialogOpen = () => {

    }

    handleAddressChange = (event) => {
        console.log(event.target.value);
    }

    toggleDialogClose = () => {
        this.setState({ isDialogOpen: false })
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div style={{ height: '800px', width: '800px' }} id='googleMap'></div>
                <Button
                    variant="raised"
                    color="primary"
                    onClick={() => { this.setState({ isDialogOpen: true }) }}
                    className={classes.dialogButton}
                >
                    New Ideal
            </Button>

                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isDialogOpen}
                >
                    <DialogTitle >
                        {"add new ideal"}
                    </DialogTitle>
                    <DialogContent>
                        <NewIdeal
                            snackbarMessage={this.props.snackbarMessage}
                            selectedTrip={this.props.selectedTrip}
                            userInfo={this.props.userInfo}
                            toggleDialogClose={this.toggleDialogClose}
                        />
                    </DialogContent>
                    {/* <DialogActions>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={() => { }}
                            className={classes.dialogButton}
                        >
                            Create
            </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={() => { this.setState({ isDialogOpen: false }) }}
                            className={classes.dialogButton}
                        >
                            Cancel
            </Button>

                    </DialogActions> */}
                </Dialog>
            </div>
        )
    }
}


export default withStyles(styles)(GoogleMaps) 