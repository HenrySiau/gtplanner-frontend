import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router-dom';
import Badge from 'material-ui/Badge';
import Icon from 'material-ui/Icon';
import Hidden from 'material-ui/Hidden';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import GTPAvatar from './GTPAvatar';
import GTPRightMenu from './GTPRightMenu';
import axios from 'axios';
import settings from '../config';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 63,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    GTPAppBar: {
        zIndex: theme.zIndex.drawer + 1,

    },
    link: {
        color: 'white'
    },
    paper: {
        marginRight: theme.spacing.unit * 2,

    },
    messageNotification: {
        marginRight: theme.spacing.unit * 2,

    },
    notification: {
        marginRight: theme.spacing.unit * 3,
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flexEnd',
    }

});


class GTPAppBar extends React.Component {
    componentDidMount() {
        // do not need to check if user already login because this function will
        // invoke immediately each time user use our app
        // if user has an id_token
        if (localStorage.getItem('id_token')) {
            // do not fetch selectedTrip when joining a code
            // will fetch a new trip at joint a trip page
            if (!window.location.href.match(/\/trip\/join/)) {
                // wil login if id_token is valid
                // this.props.validateJWT(localStorage.getItem('id_token'));
                axios.post(settings.serverUrl + '/api/post/login/token', {
                    token: localStorage.getItem('id_token'),
                })
                    .then((response) => {
                        if (response.data.success) {
                            const tripInfo = response.data.tripInfo;
                            if (tripInfo) {
                                this.props.updateSelectedTripWithInfo(tripInfo);
                            }
                            const userInfo = response.data.userInfo;
                            if (userInfo) {

                                this.props.updateUserInfo(userInfo);
                            }
                            if (response.data.token) {
                                this.props.loginWithToken(response.data.token);
                            }
                        } else {
                            // token error or expired
                            this.props.logout();
                        }
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        // TODO: show error message and guide user to re submit
                        console.error(error);
                    });
            }
        }
        if (window.innerWidth < 600) {
            this.props.closeChatRoom();
            console.log(window.innerWidth);
        }
        window.addEventListener('resize', this.handleResize)
    }

    handleResize = () => {
        if (window.innerWidth < 600) {
            console.log(window.innerWidth);
            this.props.closeChatRoom();
        }

    }
    toggleChatRoomOpen = event => {
        event.preventDefault();
        if (!this.props.isChatRoomOpen && this.props.chatRoomTabsValue === 0 && this.props.chatMessageBadgeContent > 0) {
            console.log('clearChatMessageBadgeContent');
            this.props.clearChatMessageBadgeContent();
        }
        this.props.toggleChatRoomOpen();
        // console.log('clicked message notification button');
    }

    testEvent = () => {
        console.log('clicked system notification button');
        // this.props.updateFilteredMarkers([{ lat: 1, lng: 1 }, { lat: 1, lng: 2 }]);
        // if(window.markers && window.map){
        //     window.markers.forEach((value, key) => {
        //         value.setMap(null);
        //     })
        // }
    }

    render() {
        const { classes } = this.props;

        const Login = () => {
            return (
                <div>
                    <Button onClick={() => { window.location = "/login"; }} className={classes.link}> Login </Button>
                    <Button component={Link} to="/register" className={classes.link}> Register </Button>
                </div>
            );
        }

        const Logged = () => {
            return (
                <div className={classes.container} >
                    <div className={classes.notification}>
                        <IconButton
                            id='systemMessageNotificationButton'
                            onClick={this.testEvent}
                            color="inherit" >
                            {this.props.systemMessageBadgeContent ? <Badge
                                badgeContent={this.props.systemMessageBadgeContent}
                                color="secondary">
                                <Icon className={classes.icon} style={{ fontSize: 28 }}>notifications</Icon>
                            </Badge> : <Icon className={classes.icon} style={{ fontSize: 28 }}>notifications</Icon>}
                        </IconButton>

                    </div>

                    <GTPAvatar />
                    <GTPRightMenu />
                    <div className={classes.messageNotification}>
                        {Boolean(this.props.tripId) &&
                            // <IconButton color="inherit" onClick={this.toggleChatRoomOpen} >
                            <IconButton color="inherit" onClick={this.toggleChatRoomOpen} >
                                {this.props.chatMessageBadgeContent ? <Badge className={classes.question_answer_badge} badgeContent={this.props.chatMessageBadgeContent} color="secondary">
                                    <Icon >textsms</Icon>
                                </Badge> : <Icon >textsms</Icon>}
                            </IconButton>
                        }
                    </div>
                </div>
            );
        }

        const Title = () => {
            return (
                <Typography variant="title" color="inherit" className={classes.flex} >
                    {this.props.selectedTrip && (this.props.selectedTrip.title || 'Group Travel Planner')}
                </Typography>
            )
        }
        const XsTitle = () => {
            return (
                <Typography variant="title" color="inherit" className={classes.flex} style={{ opacity: 0 }} >
                    |
                            </Typography>
            )
        }
        return (
            <div className={classes.root}>
                <AppBar position="absolute" className={classes.GTPAppBar}>
                    <Toolbar>
                        {(this.props.isLoggedIn && Boolean(this.props.tripId))
                            && <IconButton
                                className={classes.menuButton}
                                color="inherit" aria-label="Menu"
                                onClick={this.props.toggleDrawer} >
                                <Icon className={classes.icon} style={{ fontSize: 30, color: 'white' }}>menu</Icon>
                            </IconButton>
                        }
                        {this.props.width === 'xs' ? <XsTitle /> : <Title />}
                        {this.props.isLoggedIn ? <Logged /> : <Login />}

                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

GTPAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withWidth())(GTPAppBar);