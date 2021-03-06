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
import CommentIcon from '@material-ui/icons/Comment';
import { populateInfoWindow } from '../utility/mapFunctions';
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
    render() {
        const { classes, idea, isChatRoomOpen, members } = this.props;
        let startAt = new Date(idea.startAt);
        let endAt = new Date(idea.endAt);
        let subHeader = `${startAt.getMonth()}/${startAt.getDate()} ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDate()} ${endAt.getHours()}:${endAt.getMinutes()}`;
        const getIdeaCardWidth = breakPoint => {
            switch (breakPoint) {
                case 'xs':
                    return 12
                case 'sm':
                    if (isChatRoomOpen) {
                        return 12
                    } else {
                        return 6
                    }
                case 'md':
                    if (isChatRoomOpen) {
                        return 6
                    } else {
                        return 4
                    }
                case 'lg':
                    if (isChatRoomOpen) {
                        return 4
                    } else {
                        return 3
                    }
                case 'xl':
                    if (isChatRoomOpen) {
                        return 3
                    } else {
                        return 2
                    }
                default:
                    return 12
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
        console.log('profilePictureURL: ' + profilePictureURL);
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
                                <Avatar aria-label="User Icon" className={classes.avatar}
                                    src={profilePictureURL}
                                />
                                <span className="tooltiptext">{userName}</span>
                            </div>
                        }
                        action={
                            <IconButton className="leftTooltip" onClick={() => {
                                window.map.panTo({ lat: Number(idea.lat), lng: Number(idea.lng) });
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
                        <IconButton aria-label="Likes" >
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="Comments" className="tooltip">
                            <CommentIcon />
                            <span className="tooltiptext">{'Comments'}</span>
                        </IconButton>
                        <div className={classes.ideaCardMoreInfoButton}>
                            <IconButton aria-label="More Info" className="leftTooltip" onClick={
                                () => {
                                    this.props.updateFocusedIdea(idea.id);
                                    let marker = window.markers.get(idea.id);
                                    if (marker) {
                                        if (window.activeMarker !== marker) {
                                            if (window.activeMarker) {
                                                window.activeMarker.setIcon(window.window.googleMapDefaultIcon);
                                            }
                                            window.activeMarker = marker;
                                            marker.setIcon(window.googleMapHighlightedIcon);
                                            populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
                                            window.map.panTo(marker.position);
                                        }
                                    }
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