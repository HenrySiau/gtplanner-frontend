import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import { populateMarkers, clearMarkers } from '../utility/mapFunctions';
import settings from '../../config';

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
    },
    unSelected: {

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

    showItinerary = () => {
        this.goToDashboard();
        if (this.props.dashboardView === 'map') {
            this.props.setDashboardViewToSplit();
        };
        let filteredIdeasList = []
        this.props.ideas.forEach(idea => {
            if (idea.inItinerary) {
                filteredIdeasList.push(idea)
            }
        })
        this.props.updateFilteredIdeas(filteredIdeasList);
        window.googleMapBounds = new window.google.maps.LatLngBounds();
        clearMarkers(window.markers);
        populateMarkers(filteredIdeasList, this.props.updateFocusedIdea, window.map);
        if (window.activeMarker) {
            window.googleMapInfoWindow.close();
            window.activeMarker.setIcon(window.window.googleMapDefaultIcon);
            window.activeMarker = null;
        }
        this.props.showItinerary();
        this.props.updateFocusedIdea('');
    }

    showIdeas = () => {
        this.goToDashboard();
        if (this.props.dashboardView === 'map') {
            this.props.setDashboardViewToSplit();
        };
        let filteredIdeasList = []
        this.props.ideas.forEach(idea => {
            if (!idea.inItinerary) {
                filteredIdeasList.push(idea)
            }
        })
        this.props.updateFilteredIdeas(filteredIdeasList);
        window.googleMapBounds = new window.google.maps.LatLngBounds();
        clearMarkers(window.markers);
        populateMarkers(filteredIdeasList, this.props.updateFocusedIdea, window.map);
        if (window.activeMarker) {
            window.googleMapInfoWindow.close();
            window.activeMarker.setIcon(window.window.googleMapDefaultIcon);
            window.activeMarker = null;
        }
        this.props.showIdeas();
        this.props.updateFocusedIdea('');
    }


    goToDashboard = () => {
        if (window.location.href !== settings.serverUrl + '/dashboard') {
            this.props.push('/dashboard');
        }
    }
    goToItinerary = () => {
        if (window.location.href !== settings.serverUrl + '/dashboard') {
            this.props.push('/itinerary');
        }
    }
    mapButtonOnClick = () => {
        this.goToDashboard();
        this.props.setDashboardViewToMap();
    }
    listButtonOnClick = () => {
        this.goToDashboard();
        this.props.setDashboardViewToList();
    }
    splitButtonOnClick = () => {
        this.goToDashboard();
        this.props.setDashboardViewToSplit();
    }

    render() {
        const { classes, dashboardView, ideasOrItinerary, } = this.props;
        const sideList = (
            <div className={classes.list}>
                <List>
                    {this.generateNavigationIcon()}
                    <ListItem button onClick={this.mapButtonOnClick} className={dashboardView === 'map' ? classes.selected : classes.unSelected}>
                        <ListItemIcon >
                            <Icon >map</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Map" />
                    </ListItem>
                    <ListItem button onClick={this.listButtonOnClick} className={dashboardView === 'list' ? classes.selected : classes.unSelected}>
                        <ListItemIcon>
                            <Icon >view_list</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Events" />
                    </ListItem>
                    <ListItem button onClick={this.splitButtonOnClick} className={dashboardView === 'split' ? classes.selected : classes.unSelected}>
                        <ListItemIcon>
                            <Icon >pie_chart</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Split" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={this.showItinerary} className={ideasOrItinerary === 'itinerary' ? classes.selected : classes.unSelected}>
                        <ListItemIcon>
                            <Icon >event</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Itinerary" />
                    </ListItem>
                    <ListItem button onClick={this.showIdeas} className={ideasOrItinerary === 'ideas' ? classes.selected : classes.unSelected}>
                        <ListItemIcon>
                            <Icon >favorite</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Ideas" />
                    </ListItem>
                    <ListItem button onClick={this.goToItinerary}>
                        <ListItemIcon>
                            <Icon >event_available</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Agenda" />
                    </ListItem>
                    <ListItem button >
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