import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import settings from '../config';
import { MenuItem, MenuList } from 'material-ui/Menu';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Grow from 'material-ui/transitions/Grow';
import Collapse from 'material-ui/transitions/Collapse';
import Portal from 'material-ui/Portal';
import Paper from 'material-ui/Paper';
import classNames from 'classnames';
import Badge from 'material-ui/Badge';
import Icon from 'material-ui/Icon';
import Hidden from 'material-ui/Hidden';

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
    avatar: {
        // margin: 10,
        width: 36,
        height: 36,
        marginRight: theme.spacing.unit * 2,
    },
    paper: {
        marginRight: theme.spacing.unit * 2,

    },
    popperClose: {
        pointerEvents: 'none',
    },
    popperOpen: {
        position: 'relative',
        right: '50px',
        width: '120px',
    },
    question_answer: {

    },
    question_answer_badge: {
    },
    messageNotification: {
        marginRight: theme.spacing.unit * 2,

    },
    container: {
        display: 'flex',
        alignItems: 'center',
    }

});


class GTPAppBar extends React.Component {

    state = {
        open: false,
    };

    handleToggle = () => {
        this.setState({ open: !this.state.open });
    };

    handleClose = event => {
        if (this.target1.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        const Login = () => {
            return (
                <div>
                    <Button component={Link} to="/login" className={classes.link}> Login </Button>
                    <Button component={Link} to="/register" className={classes.link}> Register </Button>
                </div>
            );
        }

        const Logged = () => {
            return (
                <div className={classes.container} >
                    <Badge className={classes.question_answer_badge} badgeContent={3} color="secondary">
                        <Icon className={classes.icon}>notifications</Icon>
                    </Badge>
                    <Manager>
                        <Target>
                            <div
                                ref={node => {
                                    this.target1 = node;
                                }}
                            >
                                <IconButton onClick={this.handleToggle}>
                                    <Avatar
                                        alt="Profile Photo"
                                        src={settings.imageServerUrl + '/images/user.png'}
                                        className={classes.avatar}
                                    /> </IconButton >
                            </div>
                        </Target>
                        <Popper
                            placement="bottom-start"
                            eventsEnabled={open}
                            // className={classNames({ [classes.popperClose]: !open })}
                            className={open ? classes.popperOpen : classes.popperClose}
                        >
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                                    <Paper>
                                        <MenuList role="menu">
                                            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                            <MenuItem onClick={this.handleClose}>My account</MenuItem>
                                            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                                        </MenuList>
                                    </Paper>
                                </Grow>
                            </ClickAwayListener>
                        </Popper>
                    </Manager>

                    <Manager>
                        <Target>
                            <div
                                ref={node => {
                                    this.target2 = node;
                                }}
                            >
                                <IconButton onClick={this.handleToggle}>
                                    <Icon className={classes.icon} style={{ fontSize: 30, color: 'white' }}>menu</Icon>
                                </IconButton >
                            </div>
                        </Target>
                        <Popper
                            placement="bottom-start"
                            eventsEnabled={open}
                            // className={classNames({ [classes.popperClose]: !open })}
                            className={open ? classes.popperOpen : classes.popperClose}
                        >
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                                    <Paper>
                                        <MenuList role="menu">
                                            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                            <MenuItem onClick={this.handleClose}>My account</MenuItem>
                                            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                                        </MenuList>
                                    </Paper>
                                </Grow>
                            </ClickAwayListener>
                        </Popper>
                    </Manager>

                    <div className={classes.messageNotification}>
                        {/* md, medium: 960px or larger */}
                        <Hidden mdUp>
                            <Badge className={classes.question_answer_badge} badgeContent={4} color="secondary">
                                <Icon className={classes.icon}>textsms</Icon>
                            </Badge>
                        </Hidden>
                    </div>
                </div>
            );
        }
        return (
            <div className={classes.root}>
                <AppBar position="absolute" className={classes.GTPAppBar}>
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.props.toggleDrawer} >
                            {/* <MenuIcon style={{ fontSize: 30, color: 'white' }}/> */}
                            <Icon className={classes.icon} style={{ fontSize: 30, color: 'white' }}>menu</Icon>
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Group Travel Planner
            </Typography>
                        {/* {props.isLoggedIn ? <Logged /> : <Login />} */}
                        <Logged />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

GTPAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GTPAppBar);