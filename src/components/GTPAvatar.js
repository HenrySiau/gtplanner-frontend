import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import settings from '../config';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { connect } from 'react-redux';
import { logout } from '../actions';
import { push } from 'react-router-redux';
import Popover from '@material-ui/core/Popover';

const styles = theme => ({
    avatar: {
        // margin: 10,
        width: 36,
        height: 36,
        marginRight: theme.spacing.unit * 2,
    },
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
                    onClick={this.handleClick}>
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
                            this.props.dispatch(push('/myaccount'));
                            this.setState({ avatarAnchor: null });
                        }}>My account</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.dispatch(push('/help'));
                            this.setState({ avatarAnchor: null });
                        }}>Help</MenuItem>
                        <MenuItem onClick={() => {
                            this.props.dispatch(logout());
                            this.setState({ avatarAnchor: null });
                            window.location = "/";
                        }}>Logout</MenuItem>
                    </MenuList>
                </Popover>
            </div>
        )
    }
}

GTPAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
    return {
        profilePictureURL: state.userInfo.profilePictureURL
    }
}

GTPAvatar = withStyles(styles)(GTPAvatar);
export default connect(mapStateToProps)(GTPAvatar)