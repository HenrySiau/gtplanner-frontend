import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Icon from 'material-ui/Icon';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Popover from 'material-ui/Popover';


const styles = theme => ({
    rightMenuIcon: {
        marginRight: theme.spacing.unit,
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
                    <Icon className={classes.rightMenuIcon} style={{ fontSize: 30, color: 'white' }}>menu</Icon>
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
                            this.props.dispatch(push('/event/new'));
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