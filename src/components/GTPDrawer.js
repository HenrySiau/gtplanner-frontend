import React from 'react';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';


const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

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
            // width={200}
            // docked={false}
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

export default withStyles(styles)(GTPDrawer);