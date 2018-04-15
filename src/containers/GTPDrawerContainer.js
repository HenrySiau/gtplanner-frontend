import React from 'react';
import { connect } from 'react-redux';
import { toggleDrawer, updateSelectedTrip, toggleDrawerExtend, toggleDrawerFold } from '../actions';
import GTPDrawer from '../components/GTPDrawer';

const mapStateToProps = (state) => {
    return {
        isDrawerOpen: state.isDrawerOpen,
        isDrawerExtended: state.isDrawerExtended,
        recentTrips: state.recentTrips,
        tripId: state.selectedTrip.tripId,
        isLoggedIn: state.isLoggedIn,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleDrawer: () => {
            dispatch(toggleDrawer());
        },
        updateSelectedTrip: (tripId) => {
            dispatch(updateSelectedTrip(tripId));
        },
        toggleDrawerExtend: () => {
            dispatch(toggleDrawerExtend());
        },
        toggleDrawerFold: () => {
            dispatch(toggleDrawerFold());
        },
    }
}

const GTPDrawerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GTPDrawer)

export default GTPDrawerContainer;