import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaceIcon from '@material-ui/icons/Place';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import InfoIcon from '@material-ui/icons/Info';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import '../../css/ideaCard.css';
import settings from '../../config';


const styles = theme => ({
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
});

class IdeaCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handlePlaceIconOnClick = (position) => {
        console.log(position);
        window.map.panTo(position);
    }
    populateInfoWindow = (marker, infoWindow, map) => {
        let content = `<div style="width: 100px, margin: 0">
        <h4>${marker.title}</h4>
        <img src="${marker.coverImageUrl}" alt="" style="width: 100px"/>
        </div>`;

        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    }
    render() {
        const { classes, idea, isChatRoomOpen, members } = this.props;
        let startAt = new Date(idea.startAt);
        let endAt = new Date(idea.endAt);
        let subHeader = `${startAt.getMonth()}/${startAt.getDay()} ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDay()} ${endAt.getHours()}:${endAt.getMinutes()}`;
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
        const getUserName = userId => {
            let member = members.get(userId);
            if (member) {
                return member.userName;
            } else {
                return ''
            }
        }
        const userName = getUserName(idea.userId);
        return (
            <Grid item
                xs={getIdeaCardWidth('xs')} sm={getIdeaCardWidth('sm')}
                md={getIdeaCardWidth('md')} lg={getIdeaCardWidth('lg')}
                xl={getIdeaCardWidth('xl')}
            >
                <Card className={classes.card} key={idea.id}>
                    <CardHeader
                        avatar={
                            <div className="tooltip">
                                <Avatar aria-label="User Icon" className={classes.avatar}>R</Avatar>
                                <span className="tooltiptext">{userName}</span>
                            </div>
                        }
                        action={
                            <IconButton className="leftTooltip" onClick={() => {
                                window.map.panTo({ lat: Number(idea.lat), lng: Number(idea.lng) });
                                // this.handlePlaceIconOnClick({lat:Number(idea.lat), lng: Number(idea.lng)})
                                let marker = window.markers.get(idea.id);
                                if (marker) {
                                    if (window.activeMarker != marker) {
                                        if (window.activeMarker) {
                                            window.activeMarker.setIcon(window.window.googleMapDefaultIcon);
                                        }
                                        window.activeMarker = marker;
                                        marker.setIcon(window.googleMapHighlightedIcon);
                                        this.populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
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
                        {/* <img src="https://material-ui.com/static/images/grid-list/breakfast.jpg" */}
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
                        <IconButton aria-label="Like this idea" className="tooltip">
                            <FavoriteIcon />
                            <span className="tooltiptext">{'Like this idea'}</span>
                        </IconButton>
                        <IconButton aria-label="Add to Itinerary" className="tooltip">
                            <AddCircleIcon />
                            <span className="tooltiptext">{'Add to Itinerary'}</span>
                        </IconButton>
                        <div className={classes.ideaCardMoreInfoButton}>
                            <IconButton aria-label="More Info" className="leftTooltip" onClick={
                                () => {
                                    this.props.updateFocusedIdea(idea.id);
                                }}>
                                <InfoIcon />
                                <span className="tooltiptext">{'More Info'}</span>
                            </IconButton>
                        </div>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

IdeaCard.propTypes = {
    idea: PropTypes.object.isRequired,
    isChatRoomOpen: PropTypes.bool.isRequired,
    members: PropTypes.object.isRequired,
    className: PropTypes.object,
    updateFocusedIdea: PropTypes.func.isRequired,
};
export default withStyles(styles)(IdeaCard)