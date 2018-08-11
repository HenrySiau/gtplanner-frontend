import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Icon from '@material-ui/core/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Popover from '@material-ui/core/Popover';


const styles = theme => ({
    rightMenuIcon: {
        // marginRight: theme.spacing.unit,
        fontSize: 30, 
        color: 'white'
    },
});


class GTPRightMenu extends React.Component {

    state = {
        menuAnchor: null,
    };


    handleClick = event => {
        this.setState({ menuAnchor: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ menuAnchor: null });
    };

    render() {
        const { classes } = this.props;
        const { menuAnchor } = this.state;
        return (
            <div>

                <IconButton
                    id='appBarRightMenu'
                    onClick={this.handleClick}>
                    <Icon className={classes.rightMenuIcon}>menu</Icon>
                </IconButton >

                <Popover
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={this.handleClose}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                >

                    <MenuList role="menu">
                        <MenuItem onClick={() => {
                            this.props.dispatch(push('/dashboard'));
                            this.setState({ menuAnchor: null });
                        }}>New Event</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.dispatch(push('/members/invite'));
                            this.setState({ menuAnchor: null });
                        }}>Invite Members</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.dispatch(push('/trip/new'));
                            this.setState({ menuAnchor: null });
                        }}>Create Trip</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.dispatch(push('/trips'));
                            this.setState({ menuAnchor: null });
                        }}>My Trips</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.dispatch(push('/trip/members'));
                            this.setState({ menuAnchor: null });
                        }}>Trip Members</MenuItem>
                    </MenuList>
                </Popover>

            </div>
        )
    }
}

GTPRightMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

GTPRightMenu = withStyles(styles)(GTPRightMenu);

export default connect()(GTPRightMenu)