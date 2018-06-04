import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';

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
        position: 'relative',
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 9,
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
    },
    selected: {
        backgroundColor: grey[200]
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
        if (!Boolean(this.props.tripId)) {
            return ({ paper: this.props.classes.drawerClosed })
        }
        if (!this.props.isLoggedIn) {
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
        const { classes, dashboardView, ideasOrItinerary, showItinerary, showIdeas } = this.props;
        const sideList = (
            <div className={classes.list}>
                <List>
                    {this.generateNavigationIcon()}
                    <ListItem button onClick={this.props.setDashboardViewToMap} className={dashboardView === 'map' && classes.selected}>
                        <ListItemIcon >
                            <Icon >map</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Map" />
                    </ListItem>
                    <ListItem button onClick={this.props.setDashboardViewToList} className={dashboardView === 'list' && classes.selected}>
                        <ListItemIcon>
                            <Icon >view_list</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Events" />
                    </ListItem>
                    <ListItem button onClick={this.props.setDashboardViewToSplit} className={dashboardView === 'split' && classes.selected}>
                        <ListItemIcon>
                            <Icon >pie_chart</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Split" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={showItinerary} className={ideasOrItinerary === 'itinerary' && classes.selected}>
                        <ListItemIcon>
                            <Icon >event</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Itinerary" />
                    </ListItem>
                    <ListItem button onClick={showIdeas} className={ideasOrItinerary === 'idea' && classes.selected}>
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