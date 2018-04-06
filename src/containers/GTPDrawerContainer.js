import React from 'react';
import { connect } from 'react-redux';
import { toggleDrawer, updateSelectedTrip } from '../actions';
import GTPDrawer from '../components/GTPDrawer';

const mapStateToProps = (state) => {
    return {
        isDrawerOpen: state.isDrawerOpen,
        recentTrips: state.recentTrips
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleDrawer: () => {
            dispatch(toggleDrawer);
        },
        updateSelectedTrip: (tripId) => {
            dispatch(updateSelectedTrip(tripId));
        }
    }
}

const GTPDrawerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GTPDrawer)

export default GTPDrawerContainer;