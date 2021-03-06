import React from 'react';
import { connect } from 'react-redux';
import { updateFilteredMarkers, snackbarMessage, updateIdeas, addIdea, updateFilteredIdeas, addFilteredIdea, updateFocusedIdea } from '../../actions';
import scriptLoader from 'react-async-script-loader';
import instanceConfig from '../../instanceConfig';
import GoogleMaps from './GoogleMaps';

class GoogleMapsContainer extends React.Component {

    render() {
        let { ...props } = this.props;
        return (
            <div>
                {(this.props.isScriptLoadSucceed && this.props.tripId) && <GoogleMaps
                    {...props}
                />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tripId: state.selectedTrip.tripId,
        selectedTrip: state.selectedTrip,
        userInfo: state.userInfo,
        filteredMarkerList: state.filteredMarkerList,
        ideas: state.ideas,
        isDrawerOpen: state.isDrawerOpen,
        isDrawerExtended: state.isDrawerExtended,
        isChatRoomOpen: state.isChatRoomOpen,
        dashboardView: state.dashboardView,
        ideasOrItinerary: state.ideasOrItinerary,
        filteredIdeas: state.filteredIdeas,
        focusedIdea: state.focusedIdea,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateFilteredMarkers: (markers) => {
            dispatch(updateFilteredMarkers(markers));
        },
        snackbarMessage: (msg) => {
            dispatch(snackbarMessage(msg));
        },
        updateIdeas: (ideas) => {
            dispatch(updateIdeas(ideas));
        },
        addIdea: idea => {
            dispatch(addIdea(idea));
        }, 
        updateFilteredIdeas: ideas => {
            dispatch(updateFilteredIdeas(ideas));
        },
        addFilteredIdea: idea => {
            dispatch(addFilteredIdea(idea));
        },
        updateFocusedIdea: ideaId => {
            dispatch(updateFocusedIdea(ideaId));
        },
    }
}

GoogleMapsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GoogleMapsContainer)

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=" + instanceConfig.googleMapApiKey + '&libraries=places']
)(GoogleMapsContainer);