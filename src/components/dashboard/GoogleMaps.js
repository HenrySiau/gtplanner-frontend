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

    }
    componentDidUpdate(prevProps) {

    }


    toggleDialogClose = () => {
        this.setState({ isDialogOpen: false })
    }

    render() {
        const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended, ideas, dashboardView, selectedTrip } = this.props;
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
        ideas.forEach(idea => {
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

        return (
            // <div>
            <Grid container direction={'column'} justify={'space-between'} className={classes.root}>
                <Grid style={mapContainerStyle()} id='googleMap' className={getSectionClassName('map')} ></Grid>
                <div className={getSectionClassName('list')}>
                    <Grid container spacing={8} justify={'space-between'}>
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
                {/* </div> */}
            </Grid>
        )
    }
}


export default compose(withStyles(styles), withWidth())(GoogleMaps) 