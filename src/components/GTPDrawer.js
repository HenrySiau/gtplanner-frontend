import React from 'react';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import PropTypes from 'prop-types';


const styles = theme => ({
    list: {
        width: 250,
    },
});

class GTPDrawer extends React.Component {
    
    render() {
        const { classes } = this.props;
        const sideList = (
            <div className={classes.list}>
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                </List>

            </div >
        );

        return (<Drawer
            anchor='left'
            open={this.props.isDrawerOpen}
            onClose={this.props.toggleDrawer}
        >
            <div
                tabIndex={0}
                role="button"
            >
                {sideList}
            </div>
        </Drawer>);
    }
}

GTPDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(GTPDrawer);