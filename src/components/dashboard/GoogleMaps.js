import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import NewIdea from '../forms/NewIdea';
import settings from '../../config';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IdeaCard from './IdeaCard';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import IdeaDetailCard from './IdeaDetailCard';
import { makeMarkerIcon, populateMarkers, populateMarker } from '../mapFunctions';
import '../../css/googleMaps.css';

const styles = theme => ({
    root: {
        height: 'calc(100vh - 63px)',
    },
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    googleMapFull: {
        height: 'calc(100vh - 103px)',
    },
    googleMapHidden: {
        display: 'none'
    },
    googleMapHalf: {
        height: 'calc((100vh - 103px)/2)',
    },
    listFull: {
        height: 'calc(100vh - 103px)',
        overflow: 'scroll',
        display: 'flex',
        flexWrap: 'wrap',
    },
    listHidden: {
        display: 'none'
    },
    listHalf: {
        height: 'calc((100vh - 103px)/2)',
        overflow: 'scroll',
        display: 'flex',
        flexWrap: 'wrap',
    },
    actionsBar: {
        height: 40,
        margin: '0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: grey[100],
    },
    filters: {
        display: 'flex',
        flexDirection: 'row',
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
        });
        window.googleMapBounds = new window.google.maps.LatLngBounds();
        window.googleMapInfoWindow = new window.google.maps.InfoWindow();
        window.activeMarker = null;
        window.googleMapDefaultIcon = makeMarkerIcon('ff5151');
        window.googleMapHighlightedIcon = makeMarkerIcon('fff051');
        this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('addressInput'));
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
                console.log('get/ideas response: ' + response);
                let ideas = response.data.ideas;
                let filteredIdeas = [];
                let ideasMap = new Map();
                if (ideas) {
                    ideas.forEach(idea => {
                        ideasMap.set(idea.id, idea);
                        if (this.props.ideasOrItinerary === 'ideas') {
                            if (!idea.inItinerary) {
                                filteredIdeas.push(idea);
                            }
                        }
                        if (this.props.ideasOrItinerary === 'itinerary') {
                            if (idea.inItinerary) {
                                filteredIdeas.push(idea);
                            }
                        }
                    }) // end ideas.forEach
                    this.props.updateIdeas(ideasMap);
                    this.props.updateFilteredIdeas(filteredIdeas);
                    populateMarkers(filteredIdeas, this.props.updateFocusedIdea, window.map);
                }
            })
            .catch(error => {
                console.error(error);
            })

        window.map.addListener('click', () => {
            if (window.activeMarker) {
                window.activeMarker.setIcon(window.window.googleMapDefaultIcon);
                window.googleMapInfoWindow.close();
            }
            this.props.updateFocusedIdea('');
        });

    }

    toggleDialogClose = () => {
        this.setState({ isDialogOpen: false })
    }

    handleNewIdea = (idea) => {
        this.props.addIdea(idea);
        if (this.props.ideasOrItinerary === 'ideas') {
            if (!idea.inItinerary) {
                populateMarker(idea, this.props.updateFocusedIdea(idea.id), window.map);
                this.props.addFilteredIdea(idea);
            }
        }
        if (this.props.ideasOrItinerary === 'itinerary') {
            if (idea.inItinerary) {
                populateMarker(idea, this.props.updateFocusedIdea(idea.id), window.map);
                this.props.addFilteredIdea(idea);
            }
        }
    }



    render() {
        const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended, dashboardView,
            selectedTrip, filteredIdeas, updateFocusedIdea, focusedIdea, ideas } = this.props;
        const getSectionClassName = section => {
            if (section === 'map') {
                switch (dashboardView) {
                    case 'map':
                        return classes.googleMapFull
                    case 'list':
                        return classes.googleMapHidden
                    case 'split':
                        return classes.googleMapHalf
                    default:
                        break;
                }
            }
            if (section === 'list') {
                switch (dashboardView) {
                    case 'list':
                        return classes.listFull
                    case 'map':
                        return classes.listHidden
                    case 'split':
                        return classes.listHalf
                    default:
                        break;
                }
            }
        }
        let ideaCards = [];
        filteredIdeas.forEach(idea => {
            ideaCards.push(
                <IdeaCard
                    idea={idea}
                    isChatRoomOpen={isChatRoomOpen}
                    key={idea.id}
                    members={selectedTrip.members}
                    updateFocusedIdea={updateFocusedIdea}
                />
            );
        });

        const mapContainerStyle = () => {
            let spaceTaken = 0;
            if (isChatRoomOpen) {
                // spaceTaken += (window.innerWidth > 600) ? 360 : 0;
                spaceTaken += (this.props.width !== 'xs') ? 360 : 0;
            }
            if (isDrawerExtended) {
                spaceTaken += 151;
            } else if (isDrawerOpen) {
                spaceTaken += 73;
            }
            return { width: `calc(100vw - ${spaceTaken}px` }
        }

        const BotActionBarIdeas = () => {
            return (
                <Paper className={classes.actionsBar} square={true}>
                    <div className={classes.filters}>
                        <Typography variant="body2" >
                            {`filters...  filters...    .`}
                        </Typography>
                        <Typography variant="body2" >
                            {`filters...   filters...   .`}
                        </Typography>
                    </div>
                    <Tooltip title="Add an idea" placement="top">
                        <IconButton aria-label="Add Idea"
                            onClick={() => { this.setState({ isDialogOpen: true }) }}
                            className={classes.dialogButton}>
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Paper>
            )
        }
        const BotActionBarIdea = () => {
            return (
                <Paper className={classes.actionsBar} square={true}>
                    <div className={classes.filters}>
                    </div>
                    <Tooltip title="Close" placement="top">
                        <IconButton aria-label="Close"
                            onClick={() => {
                                if (window.activeMarker) {
                                    window.activeMarker.setIcon(window.googleMapDefaultIcon);
                                } else {
                                    window.activeMarker = null;
                                }
                                window.googleMapInfoWindow.close();
                                updateFocusedIdea('');
                            }}
                            className={classes.dialogButton}>
                            <RemoveCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Paper>
            )
        }

        const Ideas = () => {
            return (
                <Grid container spacing={8} justify={'flex-start'}>
                    {ideaCards}
                </Grid>
            )
        }
        const IdeaDetail = () => {
            let idea = ideas.get(focusedIdea);
            console.log('idea: ' + idea);
            console.log('idea title: ' + idea.title);
            return (

                <IdeaDetailCard
                    idea={idea}
                    members={selectedTrip.members}
                />

            )
        }

        return (
            <Grid container direction={'column'} justify={'space-between'} className={classes.root}>
                <Grid style={mapContainerStyle()} id='googleMap' className={getSectionClassName('map')} ></Grid>
               
                <div className={getSectionClassName('list')}>
                    {focusedIdea ? <IdeaDetail /> : <Ideas />}
                </div>
                {focusedIdea ? <BotActionBarIdea /> : <BotActionBarIdeas />}

                {/* <Ideas /> */}
                {/* {ideasOrItinerary === 'itinerary' && <IdeaDetail />} */}
                <Dialog
                    disableBackdropClick={true}
                    open={this.state.isDialogOpen}
                >
                    <DialogTitle >
                        {"Add new idea"}
                    </DialogTitle>
                    <DialogContent>
                        <NewIdea
                            snackbarMessage={this.props.snackbarMessage}
                            selectedTrip={selectedTrip}
                            userInfo={this.props.userInfo}
                            toggleDialogClose={this.toggleDialogClose}
                            handleNewIdea={this.handleNewIdea}
                        />
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}


export default compose(withStyles(styles), withWidth())(GoogleMaps) 