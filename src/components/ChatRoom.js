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
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
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
            <Tab label="Discussion" />
            <Tab label="Members" />
          </Tabs>
        </AppBar>
        {value === 0 && <Typography>Discussion</Typography>}
        {value === 1 && <Typography>Members</Typography>}

            </div >
        );

        return (
            <Hidden xsDown implementation="css">
        <Drawer
            variant="permanent"
            anchor='right'
            open
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div
                tabIndex={0}
                role="button"
            >
                {chatRoom}
            </div>
        </Drawer>
        </Hidden>
        );
    }
}

ChatRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoom);