import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import settings from '../config';
import { MenuItem, MenuList } from 'material-ui/Menu';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import {logout} from '../actions';
import { push } from 'react-router-redux';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
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
});


class GTPAvatar extends React.Component {

    state = {
        isAvatarPopoverOpen: false,
    };

    handleAvatarPopoverToggle = () => {
        this.setState({ isAvatarPopoverOpen: !this.state.isAvatarPopoverOpen });

    };

    handleAvatarPopoverClose = event => {
        if (this.GTPAvatar.contains(event.target)) {
            return;
        }
        this.setState({ isAvatarPopoverOpen: false });
    };


    render() {
        const { classes } = this.props;
        const { isAvatarPopoverOpen} = this.state;

        return (
            <Manager>
                <Target>
                    <div
                        ref={node => {
                            this.GTPAvatar = node;
                        }}
                    >
                        <IconButton 
                        aria-owns={isAvatarPopoverOpen ? 'menu-list-grow' : null}
                        aria-haspopup="true"
                        onClick={this.handleAvatarPopoverToggle}>
                            <Avatar
                                alt="Profile Photo"
                                src={settings.imageServerUrl + '/images/user.png'}
                                className={classes.avatar}
                            /> </IconButton >
                    </div>
                </Target>
                {/* <Portal> */}
                <Popper
                    placement="bottom-start"
                    eventsEnabled={isAvatarPopoverOpen}
                    // className={classNames({ [classes.popperClose]: !open })}
                    className={isAvatarPopoverOpen ? classes.popperOpen : classes.popperClose}
                >
                    <ClickAwayListener onClickAway={this.handleAvatarPopoverClose}>
                        <Grow in={isAvatarPopoverOpen} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                            <Paper>
                                <MenuList role="menu">
                                    <MenuItem onClick={()=>{
                                        this.props.dispatch(push('/myaccount'));
                                        this.setState({ isAvatarPopoverOpen: false });
                                    }}>My account</MenuItem>
                                     <MenuItem onClick={()=>{
                                        this.props.dispatch(push('/help'));
                                        this.setState({ isAvatarPopoverOpen: false });
                                    }}>Help</MenuItem>
                                    <MenuItem onClick={()=>{
                                        this.props.dispatch(logout);
                                        this.setState({ isAvatarPopoverOpen: false });
                                        window.location = "/";
                                    }}>Logout</MenuItem>
                                </MenuList>
                            </Paper>
                        </Grow>
                    </ClickAwayListener>
                </Popper>
                {/* </Portal> */}
            </Manager>
        )
    }
}

GTPAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
};
GTPAvatar = withStyles(styles)(GTPAvatar);
export default connect()(GTPAvatar)