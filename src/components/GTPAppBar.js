import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
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
                            this.props.updateSelectedTrip(null); //fetch default trip info
                            console.log('updateSelectedTrip at App Bar');
                            const userInfo = response.data.userInfo;
                            if (userInfo) {
                                const newUserInfo = {
                                    userId: userInfo.userId,
                                    userName: userInfo.userName,
                                    email: userInfo.email,
                                    phoneNumber: userInfo.phoneNumber || '',
                                    profilePictureURL: userInfo.profilePicture || (userInfo.facebookProfilePictureURL || '')
                                }
                                this.props.updateUserInfo(newUserInfo);
                            }
                            if (response.data.token) {
                                this.props.loginWithToken(response.data.token);
                            }
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
                        <IconButton color="inherit" >
                            <Badge badgeContent={3} color="secondary">
                                <Icon className={classes.icon} style={{ fontSize: 28 }}>notifications</Icon>
                            </Badge>
                        </IconButton>
                    </div>

                    <GTPAvatar />
                    <GTPRightMenu />
                    <div className={classes.messageNotification}>
                        {Boolean(this.props.tripId) &&
                            <IconButton color="inherit" onClick={this.props.toggleChatRoomOpen}>
                                <Badge className={classes.question_answer_badge} badgeContent={6} color="secondary">
                                    <Icon className={classes.icon}>textsms</Icon>
                                </Badge>
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