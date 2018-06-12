import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NewIdea from '../forms/NewIdea';
import settings from '../../config';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IdeaCard from './IdeaCard';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import IdeaDetailCard from './IdeaDetailCard';

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
            // center: { lat: 37.7749300, lng: -122.4194200 }
        });
        window.googleMapBounds = new window.google.maps.LatLngBounds();
        window.googleMapInfoWindow = new window.google.maps.InfoWindow();
        // window.googleMapDefaultIcon = this.makeMarkerIcon('0091ff');
        window.googleMapDefaultIcon = this.makeMarkerIcon('ff5151');
        window.googleMapHighlightedIcon = this.makeMarkerIcon('fff051');
        let filteredIdeasList = [];
        if(this.props.ideasOrItinerary === 'itinerary'){
            this.props.ideas.forEach(idea => {
                if(idea.inItinerary){
                    filteredIdeasList.push(idea);
                }
            })
            this.props.updateFilteredIdeas(filteredIdeasList);
        } else if(this.props.ideasOrItinerary === 'ideas'){
            this.props.updateFilteredIdeas(this.props.ideas);
        }
        console.log('get ideas for tripId: ' + this.props.tripId);
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
                if (ideas) {
                    ideas.forEach(idea => {
                        let markerInfo = {
                            id: idea.id,
                            position: { lat: Number(idea.lat), lng: Number(idea.lng) },
                            title: idea.title,
                            icon: window.googleMapDefaultIcon,
                            map: window.map,
                            coverImageUrl: settings.imageServerUrl + settings.imagePath + idea.coverImage,
                            description: idea.description
                        }
                        let marker = this.makeMarker(markerInfo);
                        window.markers.set(idea.id, marker);
                        window.googleMapBounds.extend({ lat: Number(idea.lat), lng: Number(idea.lng) });
                    }) // end ideas.forEach
                    window.map.fitBounds(window.googleMapBounds);
                    this.props.updateIdeas(ideas);
                }
            })
            .catch(error => {
                console.error(error);
            })

        window.map.addListener('click', function () {
            window.googleMapInfoWindow.close();
        });

    }
    componentDidUpdate(prevProps) {

    }
    makeMarkerIcon = markerColor => {
        var markerImage = new window.google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new window.google.maps.Size(21, 34),
            new window.google.maps.Point(0, 0),
            new window.google.maps.Point(10, 34),
            new window.google.maps.Size(21, 34));
        return markerImage;
    }

    makeMarker = markerInfo => {
        let marker = new window.google.maps.Marker({
            id: markerInfo.id,
            // position: { lat: Number(idea.lat), lng: Number(idea.lng) },
            position: markerInfo.position,
            title: markerInfo.title,
            icon: markerInfo.icon,
            map: markerInfo.map,
            coverImageUrl: markerInfo.coverImageUrl,
            description: markerInfo.description,
        });
        let that = this;
        marker.addListener('click', function () {
            // focusPlace(this.placeID, this.position);
            window.map.panTo(this.position);
            console.log('you clicked : ' + this.id);
        });
        marker.addListener('mouseover', function () {
            this.setIcon(window.googleMapHighlightedIcon);
            if (window.googleMapInfoWindow.marker !== marker) {
                that.populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
            }

        });
        marker.addListener('mouseout', function () {
            this.setIcon(window.window.googleMapDefaultIcon);
            // window.googleMapInfoWindow.close();
        });
        return marker
    }

    populateInfoWindow = (marker, infoWindow, map) => {
        let content = `<div style="width: 100px, margin: 0">
        <h4>${marker.title}</h4>
        <img src="${marker.coverImageUrl}" alt="" style="width: 100px"/>
        </div>`;

        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    }

    toggleDialogClose = () => {
        this.setState({ isDialogOpen: false })
    }

    render() {
        const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended, ideas, dashboardView, selectedTrip, ideasOrItinerary, filteredIdeas} = this.props;
        const getSectionClassName = section => {
            if (section === 'map') {
                switch (dashboardView) {
                    case 'map':
                        return classes.googleMapFull
                        break;
                    case 'list':
                        return classes.googleMapHidden
                        break;
                    case 'split':
                        return classes.googleMapHalf
                        break;
                    default:
                        break;
                }
            }
            if (section === 'list') {
                switch (dashboardView) {
                    case 'list':
                        return classes.listFull
                        break;
                    case 'map':
                        return classes.listHidden
                        break;
                    case 'split':
                        return classes.listHalf
                        break;
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

        const Ideas = () => {
            return (
                <div>
                    <div className={getSectionClassName('list')}>
                        <Grid container spacing={8} justify={'flex-start'}>
                            {ideaCards}
                        </Grid>
                    </div>
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
                </div>
            )
        }
        const IdeaDetail = () => {
            return (
                <h1>{'idea detail '}</h1>
            )
        }

        return (
            <Grid container direction={'column'} justify={'space-between'} className={classes.root}>
                <Grid style={mapContainerStyle()} id='googleMap' className={getSectionClassName('map')} ></Grid>

                <Ideas />
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
                            addIdea={this.props.addIdea}
                        />
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}


export default compose(withStyles(styles), withWidth())(GoogleMaps) 