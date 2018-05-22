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
});

class GoogleMaps extends React.Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.markers = new Map();
        this.autocomplete = null;
        this.addressInput = React.createRef();
        this.state = {
            isDialogOpen: false,
        }
    }

    componentDidMount() {
        this.map = new window.google.maps.Map(document.getElementById('googleMap'), {
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
                            map: this.map,
                        });
                        this.markers.set(idea.id, marker);
                    })

                    this.props.updateIdeas(ideas);

                }
            })
            .catch(error => {
                console.error(error);
            })


        console.log('google map loaded');
        // this.props.filteredMarkerList.forEach(place => {
        //     console.log('place: ' + place.lat);
        //     var marker = new window.google.maps.Marker({
        //         position: place,
        //         title: 'Hello',
        //         map: this.map,
        //     })
        // })

    }
    componentDidUpdate(prevProps) {
        // console.log('componentDidUpdate');
        // if (prevProps.filteredMarkerList !== this.props.filteredMarkerList) {
        //     console.log(' filtered marker list changed');
        //     console.log('prevProps.filteredMarkerList: ' + prevProps.filteredMarkerList);
        //     console.log('this.props.filteredMarkerList: ' + this.props.filteredMarkerList);
        //     console.log('props.ideas: ' + this.props.ideas);
        // }
        if (prevProps.ideas !== this.props.ideas) {
            // console.log('props.ideas changed');
            // console.log('prevProps.ideas: ' + prevProps.ideas);
            // console.log('props.ideas: ' + this.props.ideas);
            this.props.ideas.forEach(idea => {
                let marker = new window.google.maps.Marker({
                    position: { lat: Number(idea.lat), lng: Number(idea.lng) },
                    title: idea.title,
                    map: this.map,
                });
                this.markers.set(idea.id, marker);
            });

        }
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