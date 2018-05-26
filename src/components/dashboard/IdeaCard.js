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

class ideaCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
        // let userName = 'Posted by: ' + members.get(idea.userId).userName || '';
        // let userName = 'Posted by: ' + members.get(idea.id).userName || '';
        const getUserName = userId => {
            let member = members.get(userId);
            if (member) {
                return member.userName;
            } else {
                return ''
            }
        }
        return (
            <Grid item
                xs={getIdeaCardWidth('xs')} sm={getIdeaCardWidth('sm')}
                md={getIdeaCardWidth('md')} lg={getIdeaCardWidth('lg')}
                xl={getIdeaCardWidth('xl')}
            >
                <Card className={classes.card} key={idea.id}>
                    <CardHeader
                        avatar={
                            <Tooltip title={'Posted by: ' + getUserName(idea.userId)} placement="top">
                                <Avatar aria-label="User Icon" className={classes.avatar}>
                                    R
      </Avatar>
                            </Tooltip>
                        }
                        action={
                            <Tooltip title='Show on the map' placement="top">
                                <IconButton>
                                    <PlaceIcon />
                                </IconButton>
                            </Tooltip>
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
                        <Tooltip title='Like this idea' placement="top">
                            <IconButton aria-label="Add to favorites">
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Add to itinerary' placement="top">
                            <IconButton aria-label="Add to Itinerary">
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='More Info' placement="top">
                            <IconButton aria-label="More Info" className={classes.ideaCardMoreInfoButton}>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                        {/* Todo: add comment input and submit button */}
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

ideaCard.propTypes = {
    idea: PropTypes.object.isRequired,
    isChatRoomOpen: PropTypes.bool.isRequired,
    members: PropTypes.object.isRequired,
};
export default withStyles(styles)(ideaCard)