import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';

const styles = theme => ({
    avatar: {
        width: 36,
        height: 36,
    },
    avatarButton: {
        marginRight: theme.spacing.unit * 2,
    }
});

class GTPAvatar extends React.Component {

    state = {
        avatarAnchor: null,
    };

    handleClick = event => {
        this.setState({ avatarAnchor: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ avatarAnchor: null });
    };

    render() {
        const { classes } = this.props;
        const { avatarAnchor } = this.state;

        return (
            <div >

                <IconButton
                    id='appBarAvatar'
                    onClick={this.handleClick}
                    className={classes.avatarButton}
                    >
                    <Avatar
                        alt="Profile Photo"
                        src={this.props.profilePictureURL}
                        className={classes.avatar}
                    /> </IconButton >

                <Popover
                    anchorEl={avatarAnchor}
                    open={Boolean(avatarAnchor)}
                    onClose={this.handleClose}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                    <MenuList role="menu">
                        <MenuItem onClick={() => {
                            this.props.push('/myaccount');
                            this.setState({ avatarAnchor: null });
                        }}>My account</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.snackbarMessage('Helping Center Under Construction');
                            this.setState({ avatarAnchor: null });
                        }}>Help</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.logout();
                            this.setState({ avatarAnchor: null });
                            window.location = "/";
                        }}>Logout</MenuItem>
                    </MenuList>
                </Popover>
            </div>
        )
    }
}
GTPAvatar.defaultProps = {
    profilePictureURL: '/defaultUserIcon.png',
};

GTPAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
    profilePictureURL: PropTypes.string.isRequired,
    push: PropTypes.func,
    logout: PropTypes.func,
};

export default GTPAvatar = withStyles(styles)(GTPAvatar);