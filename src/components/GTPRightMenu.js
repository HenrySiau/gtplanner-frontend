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
import Icon from 'material-ui/Icon';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    rightMenuIcon: {
        [theme.breakpoints.down('sm')]: {
        marginRight: theme.spacing.unit * 2,
        },
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


class GTPRightMenu extends React.Component {

    state = {
        isMenuPopoverOpen: false
    };

    handleMenuPopoverToggle = () => {
        this.setState({ isMenuPopoverOpen: !this.state.isMenuPopoverOpen });
    };

    handleMenuPopoverClose = event => {
        if (this.GTPMenu.contains(event.target)) {
            return;
        }
        this.setState({ isMenuPopoverOpen: false });
    };

    render() {
        const { classes } = this.props;
        const { isMenuPopoverOpen } = this.state;
        return (
            <div>
                <Manager>
                    <Target>
                        <div
                            ref={node => {
                                this.GTPMenu = node;
                            }}
                        >
                            <IconButton
                                aria-owns={isMenuPopoverOpen ? 'menu-list-grow' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenuPopoverToggle}>
                                <Icon className={classes.rightMenuIcon} style={{ fontSize: 30, color: 'white' }}>menu</Icon>
                            </IconButton >
                        </div>
                    </Target>
                    {/* <Portal> */}
                    <Popper
                        placement="bottom-start"
                        eventsEnabled={isMenuPopoverOpen}
                        className={isMenuPopoverOpen ? classes.popperOpen : classes.popperClose}
                    >
                        <ClickAwayListener onClickAway={this.handleMenuPopoverClose}>
                            <Grow in={isMenuPopoverOpen} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                                <Paper>
                                    <MenuList role="menu">
                                        <MenuItem onClick={this.handleMenuPopoverClose}>Profile</MenuItem>
                                        <MenuItem onClick={this.handleMenuPopoverClose}>My account</MenuItem>
                                        <MenuItem onClick={this.handleMenuPopoverClose}>Logout</MenuItem>
                                    </MenuList>
                                </Paper>
                            </Grow>
                        </ClickAwayListener>
                    </Popper>
                    {/* </Portal> */}
                </Manager>
            </div>
        )
    }
}

GTPRightMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GTPRightMenu);