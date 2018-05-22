import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NewIdea from '../forms/NewIdea';
import io from 'socket.io-client';
import settings from '../../config';
import axios from 'axios';


const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    googleMap: {
        marginTop: '10px',
        // height: 'calc(50% - 40px)',
        height: 'calc((100vh - 40px)/2)',
    }
});

class GoogleMaps extends React.Component {
    constructor(props) {
        super(props);
        window.map = null;
        window.markers = new Map();
        this.autocomplete = null;
        this.addressInput = React.createRef();
        this.state = {
            isDialogOpen: false,
        }
    }

    componentDidMount() {
        window.map = new window.google.maps.Map(document.getElementById('googleMap'), {
            zoom: 12,
            center: { lat: 37.7749300, lng: -122.4194200 }
        });

        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/ideas',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            params: {
                tripId: this.props.tripId
            }
        })
            .then(response => {
                let ideas = response.data.ideas;
                if (ideas) {
                    ideas.forEach(idea => {
                        console.log('add Marker');
                        let marker = new window.google.maps.Marker({
                            position: { lat: Number(idea.lat), lng: Number(idea.lng) },
                            title: idea.title,
                            map: window.map,
                        });
                        window.markers.set(idea.id, marker);
                    })

                    this.props.updateIdeas(ideas);

                }
            })
            .catch(error => {
                console.error(error);
            })

        console.log('google map loaded');

    }
    componentDidUpdate(prevProps) {

    }

    handleAddressChange = (event) => {
        console.log(event.target.value);
    }

    toggleDialogClose = () => {
        this.setState({ isDialogOpen: false })
    }
    render() {
        const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended } = this.props;

        const mapContainerStyle = () => {
            // let result = {};
            let spaceTaken = 0;
            if (isChatRoomOpen) {
              spaceTaken += 360;
            } 
            if(isDrawerExtended){
                spaceTaken += 151;
            }else if(isDrawerOpen){
                spaceTaken += 73;
            }
            return {width: `calc(100vw - ${spaceTaken}px`}
          }

        return (
            <div>
                <div style={mapContainerStyle()} id='googleMap' className={classes.googleMap}></div>
                <Button
                    variant="raised"
                    color="primary"
                    onClick={() => { this.setState({ isDialogOpen: true }) }}
                    className={classes.dialogButton}
                >
                    New Idea
            </Button>

                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isDialogOpen}
                >
                    <DialogTitle >
                        {"add new idea"}
                    </DialogTitle>
                    <DialogContent>
                        <NewIdea
                            snackbarMessage={this.props.snackbarMessage}
                            selectedTrip={this.props.selectedTrip}
                            userInfo={this.props.userInfo}
                            toggleDialogClose={this.toggleDialogClose}
                            addIdea={this.props.addIdea}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}


export default withStyles(styles)(GoogleMaps) 