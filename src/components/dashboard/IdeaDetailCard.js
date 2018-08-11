import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaceIcon from '@material-ui/icons/Place';
import CloseIcon from '@material-ui/icons/Close';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import settings from '../../config';
import { populateInfoWindow } from '../utility/mapFunctions';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { populateMarkers, clearMarkers } from '../utility/mapFunctions';

const styles = theme => ({
    root: {
        overflow: 'scroll',
    },
    card: {
        maxWidth: 800,
    },

    avatar: {
        backgroundColor: red[500],
        width: 36,
        height: 36,
    },

    ideaCardContent: {
        overflow: 'scroll',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxHeight: '200px'
    },
    cardMediaImage: {
        width: '100%',
        maxHeight: '600px',
    },
    ideaCardTitle: {
        overflow: 'scroll',
        whiteSpace: 'nowrap',
        width: 165,
    },
    actions: {
        display: 'flex',
    },
    closeDetailCardButton: {
        marginLeft: 'auto',
    },
});




class IdeaDetailCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false
        }
    }

    addToItinerary = (ideaId) => {

        axios({
            method: 'POST',
            url: settings.serverUrl + '/api/post/idea/addToItinerary',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            data: {
                ideaId: ideaId
            }
        })
            .then((response) => {
                if (response.data) {
                    if (response.data.success) {
                        let idea = this.props.ideas.get(ideaId);
                        if (idea) {
                            idea.inItinerary = true;
                            let newIdeasMap = new Map(this.props.ideas);
                            newIdeasMap.set(ideaId, idea);
                            this.props.updateIdeas(newIdeasMap);
                            //updateFilteredIdeas

                            let filteredIdeasList = []
                            newIdeasMap.forEach(idea => {
                                if (!idea.inItinerary) {
                                    filteredIdeasList.push(idea)
                                }
                            })
                            this.props.updateFilteredIdeas(filteredIdeasList);

                            // updateMarkers
                            window.googleMapBounds = new window.google.maps.LatLngBounds();
                            clearMarkers(window.markers);
                            populateMarkers(filteredIdeasList, this.props.updateFocusedIdea, window.map);
                            this.props.updateFocusedIdea('');
                        }
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
        console.log('addToItinerary: ' + ideaId);
    }

    removeFromItinerary = (ideaId) => {
        console.log('removeFromItinerary: ' + ideaId);
        axios({
            method: 'POST',
            url: settings.serverUrl + '/api/post/idea/removeFromItinerary',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            data: {
                ideaId: ideaId
            }
        })
            .then((response) => {
                if (response.data) {
                    if (response.data.success) {
                        let idea = this.props.ideas.get(ideaId);
                        if (idea) {
                            idea.inItinerary = false;
                            let newIdeasMap = new Map(this.props.ideas);
                            newIdeasMap.set(ideaId, idea);
                            this.props.updateIdeas(newIdeasMap);
                                //updateFilteredIdeas

                                let filteredIdeasList = []
                                newIdeasMap.forEach(idea => {
                                    if (idea.inItinerary) {
                                        filteredIdeasList.push(idea)
                                    }
                                })
                                this.props.updateFilteredIdeas(filteredIdeasList);
    
                                // updateMarkers
                                window.googleMapBounds = new window.google.maps.LatLngBounds();
                                clearMarkers(window.markers);
                                populateMarkers(filteredIdeasList, this.props.updateFocusedIdea, window.map);
                                this.props.updateFocusedIdea('');
                        }
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    closeDialog = () => {
        this.setState({
            dialogOpen: false
        })

    }

    openDialog = () => {
        this.setState({
            dialogOpen: true
        })
    }

    deleteIdea = (ideaId) => {
        axios({
            method: 'POST',
            url: settings.serverUrl + '/api/post/idea/delete',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            data: {
                ideaId: ideaId
            }
        })
            .then((response) => {
                if (response.data) {
                    if (response.data.success) {
                        let newIdeasMap = new Map(this.props.ideas);
                        newIdeasMap.delete(ideaId);
                        this.props.updateFocusedIdea('');
                        let updatedFilteredIdeas = [];
                        const filteredIdeas = this.props.filteredIdeas;
                        if (filteredIdeas) {
                            filteredIdeas.forEach(idea => {
                                if (idea.id !== ideaId) {
                                    updatedFilteredIdeas.push(idea);
                                }
                            });
                            this.props.updateFilteredIdeas(updatedFilteredIdeas);
                        }

                        if (window.markers) {
                            console.log('window.markers true');
                            let marker = window.markers.get(ideaId);
                            if (marker) {
                                marker.setMap(null);
                                console.log('marker cleared');
                            }
                        }

                        this.props.updateIdeas(newIdeasMap);
                    }
                }

            })
            .catch((error) => {
                // TODO: show error message and guide user to re submit
                console.error(error);
            });
    }

    render() {
        const { classes, idea, members } = this.props;
        let startAt = new Date(idea.startAt);
        let endAt = new Date(idea.endAt);
        let subHeader = `${startAt.getMonth()}/${startAt.getDay()} ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDay()} ${endAt.getHours()}:${endAt.getMinutes()}`;
        const getUserName = userId => {
            let member = members.get(userId);
            if (member) {
                return member.userName;
            } else {
                return ''
            }
        }
        const getProfilePictureURL = userId => {
            let member = members.get(userId);
            if (member) {
                return member.profilePictureURL;
            } else {
                return ''
            }
        }
        const userName = getUserName(idea.userId);
        const profilePictureURL = getProfilePictureURL(idea.userId);
        const AddOrRemove = () => {
            if (idea.inItinerary) {
                return (
                    <Tooltip title={"Remove from Itinerary"}>
                        <IconButton aria-label="Remove from Itinerary"
                            onClick={() => { this.removeFromItinerary(idea.id) }}
                        >
                            <RemoveCircleIcon />
                        </IconButton>
                    </Tooltip>
                )
            } else {
                return (
                    <Tooltip title={"Add to Itinerary"}>
                        <IconButton aria-label="Add to Itinerary"
                            onClick={() => { this.addToItinerary(idea.id) }}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                )
            }
        }

        return (
            <div className={classes.root}>
                <Card className={classes.card} key={idea.id} >
                    <CardHeader
                        avatar={
                            <div className="tooltip">
                                <Avatar aria-label="User Icon" className={classes.avatar}
                                    src={profilePictureURL}
                                />
                                <span className="tooltiptext">{userName}</span>
                            </div>
                        }
                        action={
                            <IconButton className="leftTooltip" onClick={() => {
                                window.map.panTo({ lat: Number(idea.lat), lng: Number(idea.lng) });
                                // this.handlePlaceIconOnClick({lat:Number(idea.lat), lng: Number(idea.lng)})
                                let marker = window.markers.get(idea.id);
                                if (marker) {
                                    if (window.activeMarker !== marker) {
                                        if (window.activeMarker) {
                                            window.activeMarker.setIcon(window.window.googleMapDefaultIcon);
                                        }
                                        window.activeMarker = marker;
                                        marker.setIcon(window.googleMapHighlightedIcon);
                                        populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
                                    }
                                }
                            }} >
                                <PlaceIcon />
                                <span className="tooltiptext">{'Show on the map'}</span>
                            </IconButton>
                        }

                        title={
                            <Typography variant="body2" className={classes.ideaCardTitle}>
                                {idea.title}
                            </Typography>
                        }
                        subheader={subHeader}
                    />
                    <CardMedia className={classes.media} image={' '}>
                        <img src={settings.imageServerUrl + settings.imagePath + idea.coverImage}
                            alt={idea.title}
                            className={classes.cardMediaImage}
                        />
                    </CardMedia>

                    <CardContent className={classes.ideaCardContent}>
                        <Typography variant="body1">
                            {idea.description}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton aria-label="Like this idea" >
                            <FavoriteIcon />
                        </IconButton>

                        {AddOrRemove()}

                        <Tooltip title={"Delete"}>
                            <IconButton aria-label="Add to Itinerary"
                                onClick={this.openDialog}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <div className={classes.closeDetailCardButton}>
                            <Tooltip title={"Close"}>
                                <IconButton aria-label="close" onClick={
                                    () => {
                                        this.props.updateFocusedIdea('');
                                    }}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </CardActions>
                </Card>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle >{"Are you sure to delete?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {idea.title}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Cancel
            </Button>
                        <Button
                            // onClick={() => { this.deleteIdea(idea.id) }}
                            onClick={() => { this.deleteIdea(idea.id) }}
                            color="primary" autoFocus>
                            Delete
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

IdeaDetailCard.propTypes = {
    idea: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
};
export default withStyles(styles)(IdeaDetailCard)