import React from 'react';
import Drawer from 'material-ui/Drawer';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';

const drawerWidth = 150;
const styles = theme => ({
    drawer: {
    },
    drawerPaperExtended: {
        width: drawerWidth,
        // boxShadow: '-3px 0px 5px 0px rgba(220,220,220,1)',
        position: 'relative',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerPaperFolded: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    drawerClosed: {
        width: 0
    },
    list: {
        width: drawerWidth,
        marginTop: 55,
    },
    navigationIconExtended: {
        marginLeft: '0 90 0 0'
    },
    navigationIconFolded: {
    }
});

class GTPDrawer extends React.Component {
    componentDidMount() {
        if (this.props.width === 'md' || this.props.width === 'lg' || this.props.width === 'xl') {
            this.props.toggleDrawer();
        }
        if (this.props.width === 'xl') {
            this.props.toggleDrawerExtend();
        }
    }

    getDrawerClass = () => {
        if(!Boolean(this.props.tripId)){
            return ({ paper: this.props.classes.drawerClosed })
        }
        if (!this.props.isLoggedIn ) {
            return ({ paper: this.props.classes.drawerClosed })
        } else {
            if (!this.props.isDrawerOpen) {
                return ({ paper: this.props.classes.drawerClosed })
            } else {
                if (this.props.isDrawerExtended) {
                    return ({ paper: this.props.classes.drawerPaperExtended })
                } else {
                    return { paper: this.props.classes.drawerPaperFolded }
                }
            }
        }

    }
    generateNavigationIcon = () => {
        if (this.props.isDrawerExtended) {
            return (
                <ListItem button onClick={this.props.toggleDrawerFold}>
                    <ListItemIcon className={this.props.isDrawerExtended ? 'navigationIconExtended' : 'navigationIconFolded'}>
                        <Icon >chevron_left</Icon>
                    </ListItemIcon>
                </ListItem>
            )
        } else {
            return (
                <ListItem button onClick={this.props.toggleDrawerExtend}>
                    <ListItemIcon className={this.props.isDrawerExtended ? 'navigationIconExtended' : 'navigationIconFolded'}>
                        <Icon >chevron_right</Icon>
                    </ListItemIcon>
                </ListItem>
            )
        }
    }

    render() {
        const { classes } = this.props;
        const sideList = (
            <div className={classes.list}>
                <List>
                    {this.generateNavigationIcon()}
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >map</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Map" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >view_list</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Events" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >pie_chart</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Split" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >event</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Calender" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >favorite</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Ideas" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >check_box</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Checklist" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >camera_alt</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Photos" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >account_balance_wallet</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Budget" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Icon >mail_outline</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Invites" />
                    </ListItem>
                </List>
            </div >
        );

        return (<Drawer
            anchor='left'
            variant='persistent'
            open={this.props.isDrawerOpen && this.props.isLoggedIn && Boolean(this.props.tripId)}
            onClose={this.props.toggleDrawer}
            classes={this.getDrawerClass()}
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

export default compose(withStyles(styles), withWidth())(GTPDrawer);