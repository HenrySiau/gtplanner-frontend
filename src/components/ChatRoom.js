import React from 'react';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Hidden from 'material-ui/Hidden';

const styles = theme => ({
    chatRoom: {
        width: 320,
        marginTop: 65,
    },
    drawerPaper: {
        width: 320,
        boxShadow: '-3px 0px 5px 0px rgba(220,220,220,1)',

        // if paper position is relative, drawer will push main contain
        // otherwise it will over lay main contain
        [theme.breakpoints.up('sm')]: {
            position: 'relative',

        },
    },
    drawerHidden: {
        // position: 'absolute',
        width: 0
    },
    tab: {
        // height: '20px'
        marginTop: '0'
    }
});

class ChatRoom extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };


    render() {
        const { classes } = this.props;
        const { value } = this.state;
        const chatRoom = (
            <div className={classes.chatRoom}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        // scrollable
                        // scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Discussion" className={classes.tab} />
                        <Tab label="Members" className={classes.tab} />
                    </Tabs>
                </AppBar>
                {value === 0 && <Typography>Discussion </Typography>}
                {value === 1 && <Typography>Members</Typography>}

            </div >
        );

        return (
            <Drawer
                // variant="permanent"
                variant='persistent'
                anchor='right'
                open={this.props.isChatRoomOpen && this.props.isLoggedIn && Boolean(this.props.tripId)}
                classes={
                    this.props.isChatRoomOpen && this.props.tripId && this.props.isLoggedIn?
                        { paper: classes.drawerPaper, } :
                        { paper: classes.drawerHidden, }}
            >
                <div
                    tabIndex={0}
                    role="button"
                >
                    {chatRoom}
                </div>
            </Drawer>
        );
    }
}

ChatRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoom);