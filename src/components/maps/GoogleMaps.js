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
import InfoIcon from '@material-ui/icons/Info';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaceIcon from '@material-ui/icons/Place';

const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
    googleMap: {
        marginTop: '0',
        height: 'calc((100vh - 40px)/2)',
    },
    card: {
        maxWidth: 300,
        margin: '5px',
    },
    media: {
        // height: '100px',
        // width: '100%',
        // height: 'auto',
        // paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
        width: 36,
        height: 36,
    },
    ideaCards: {
        height: 'calc((100vh - 40px)/2 - 70px)',
        overflow: 'scroll',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        // justifyContent: 'space-around',
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
    ideaCardMoreInfoButton: {
        marginLeft: 'auto',
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

        let ideaCards = [];
        ideas.forEach(idea => {
            let startAt = new Date(idea.startAt);
            let endAt = new Date(idea.endAt);
            let subHeader = `${startAt.getMonth()}/${startAt.getDay()} ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDay()} ${endAt.getHours()}:${endAt.getMinutes()}`;
            ideaCards.push(
                <Card className={classes.card} key={idea.id}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="User Icon" className={classes.avatar}>
                                R
              </Avatar>
                        }
                        action={
                            <IconButton>
                                <PlaceIcon />
                            </IconButton>
                        }

                        title={
                            <Typography variant="body2" className={classes.ideaCardTitle}>
                                {idea.title}
                            </Typography>
                        }
                        subheader={subHeader}
                    />

                    <CardMedia className={classes.media}>
                        <img src="https://material-ui.com/static/images/grid-list/breakfast.jpg"
                            alt={idea.title}
                            className={classes.cardMediaImage}
                        />
                    </CardMedia>
                    <div className={classes.ideaCardContent}>
                        <CardContent>
                            <Typography variant="body1">
                                {idea.description}
                            </Typography>

                        </CardContent>
                    </div>
                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton aria-label="Add to favorites">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="Add to Itinerary">
                            <AddCircleIcon />
                        </IconButton>
                        <IconButton aria-label="More Info" className={classes.ideaCardMoreInfoButton}>
                            <InfoIcon />
                        </IconButton>
                        {/* Todo: add comment input and submit button */}
                    </CardActions>
                </Card>
            );
        });

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
                {/* <div className={classes.ideaExpansionPanels}>{ideaExpansionPanels}</div> */}
                {/* <div className={classes.ideaExpansionPanels}>
                    <GridList cellHeight={180} className={classes.gridList} cols={3}>
                        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                            <ListSubheader component="div">December</ListSubheader>
                        </GridListTile>
                        {ideaGridList}
                    </GridList>
                </div> */}
                <div className={classes.ideaCards}>{ideaCards}</div>
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