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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    googleMap: {
        marginTop: '0',
        height: 'calc((100vh - 40px)/2)',
    },
    ideaExpansionPanels: {
        height: 'calc((100vh - 40px)/2 - 70px)',
        overflow: 'scroll',
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
        const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended, ideas } = this.props;
        let ideaExpansionPanels = []
        ideas.forEach(idea => {
            ideaExpansionPanels.push(
                <ExpansionPanel key={idea.id}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{idea.title}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            {idea.description}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );
        })

        const mapContainerStyle = () => {
            console.log('window.innerWidth: ' + window.innerWidth);
            let spaceTaken = 0;
            if (isChatRoomOpen) {
                spaceTaken += (window.innerWidth > 600) ? 360 : 0;
            }
            if (isDrawerExtended) {
                spaceTaken += 151;
            } else if (isDrawerOpen) {
                spaceTaken += 73;
            }
            return { width: `calc(100vw - ${spaceTaken}px` }
        }

        return (
            <div>
                <div style={mapContainerStyle()} id='googleMap' className={classes.googleMap}></div>
                <div className={classes.ideaExpansionPanels}>{ideaExpansionPanels}</div>
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