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
import grey from '@material-ui/core/colors/grey';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaceIcon from '@material-ui/icons/Place';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

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
    card: {
        // maxWidth: 800,
        // minWidth: 250,
        width: '100%',
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
        // justifyContent: 'center',
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
        const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended, ideas, dashboardView } = this.props;
        const getIdeaCardWidth = breakPoint => {
            switch (breakPoint) {
                case 'xs':
                    return 12
                    break
                case 'sm':
                    if (isChatRoomOpen) {
                        return 12
                    } else {
                        return 6
                    }
                    break
                case 'md':
                    if (isChatRoomOpen) {
                        return 6
                    } else {
                        return 4
                    }
                    break
                case 'lg':
                    if (isChatRoomOpen) {
                        return 4
                    } else {
                        return 3
                    }
                    break
                case 'xl':
                    if (isChatRoomOpen) {
                        return 3
                    } else {
                        return 2
                    }
                    break
            }
        }
        const getSectionClassName = section => {
            console.log(dashboardView);
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
                    console.log('list split');
                        return classes.listHalf
                        break;
                    default:
                        break;
                }
            }

        }
        let ideaCards = [];
        ideas.forEach(idea => {
            let startAt = new Date(idea.startAt);
            let endAt = new Date(idea.endAt);
            let subHeader = `${startAt.getMonth()}/${startAt.getDay()} ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDay()} ${endAt.getHours()}:${endAt.getMinutes()}`;
            ideaCards.push(
                <Grid item xs={getIdeaCardWidth('xs')} sm={getIdeaCardWidth('sm')} md={getIdeaCardWidth('md')} lg={getIdeaCardWidth('lg')} xl={getIdeaCardWidth('xl')} key={idea.id}>
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

                        <CardMedia className={classes.media} image={' '}>
                            <img src="https://material-ui.com/static/images/grid-list/breakfast.jpg"
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
                </Grid>
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
            // <div>
            <Grid container direction={'column'} justify={'space-between'} className={classes.root}>
                {/* <div style={mapContainerStyle()} id='googleMap' className={classes.googleMap} style={{ height: 'calc((100vh - 40px)/2)' }}></div> */}
                <Grid style={mapContainerStyle()} id='googleMap' className={getSectionClassName('map')} ></Grid>

                {/* <div className={classes.ideaCards}> */}
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
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={() => { this.setState({ isDialogOpen: true }) }}
                        className={classes.dialogButton}
                    >
                        New Idea
            </Button>
                </Paper>

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
                {/* </div> */}
            </Grid>
        )
    }
}


export default withStyles(styles)(GoogleMaps) 