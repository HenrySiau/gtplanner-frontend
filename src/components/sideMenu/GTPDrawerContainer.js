import { connect } from 'react-redux';
import { toggleDrawer, updateSelectedTrip, toggleDrawerExtend, toggleDrawerFold } from '../actions';
import { setDashboardViewToMap, setDashboardViewToList, setDashboardViewToSplit, showItinerary, showIdeas, updateFilteredIdeas, updateFocusedIdea } from '../actions';
import GTPDrawer from '../components/GTPDrawer';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        isDrawerOpen: state.isDrawerOpen,
        isDrawerExtended: state.isDrawerExtended,
        recentTrips: state.recentTrips,
        tripId: state.selectedTrip.tripId,
        isLoggedIn: state.isLoggedIn,
        dashboardView: state.dashboardView,
        ideasOrItinerary: state.ideasOrItinerary,
        // filteredIdeas: state.filteredIdeas,
        ideas: state.ideas,
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
        setDashboardViewToMap: () => {
            dispatch(setDashboardViewToMap());
        },
        setDashboardViewToList: () => {
            dispatch(setDashboardViewToList());
        },
        setDashboardViewToSplit: () => {
            dispatch(setDashboardViewToSplit());
        },
        showItinerary: () => {
            dispatch(showItinerary());
        },
        showIdeas: () => {
            dispatch(showIdeas());
        },
        updateFilteredIdeas: (ideas) => {
            dispatch(updateFilteredIdeas(ideas));
        },
        updateFocusedIdea: ideaId => {
            dispatch(updateFocusedIdea(ideaId));
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GTPDrawer));