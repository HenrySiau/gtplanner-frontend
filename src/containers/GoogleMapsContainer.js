import React from 'react';
import { connect } from 'react-redux';
import { updateFilteredMarkers, snackbarMessage, updateIdeas } from '../actions';
import scriptLoader from 'react-async-script-loader';
import instanceConfig from '../instanceConfig';
import GoogleMaps from '../components/maps/GoogleMaps';

class GoogleMapsContainer extends React.Component {

    render() {
        let { ...props } = this.props;
        return (
            // <div>
            //     {(this.props.isScriptLoadSucceed && this.props.tripId) && <GoogleMaps
            //         filteredMarkerList={this.props.filteredMarkerList}
            //         tripId={this.props.tripId}
            //         selectedTrip={this.props.selectedTrip}
            //         userInfo={this.props.userInfo}
            //         updateFilteredMarkers={this.props.updateFilteredMarkers}
            //         snackbarMessage={this.props.snackbarMessage}
            //         updateIdeas={this.props.updateIdeas}
            //         ideas={this.props.ideas}
            //     />}
            // </div>
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
        selectedTrip: state.selectedTrip,
        filteredMarkerList: state.filteredMarkerList,
        ideas: state.ideas,
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
    }
}

GoogleMapsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GoogleMapsContainer)

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=" + instanceConfig.googleMapApiKey + '&libraries=places']
)(GoogleMapsContainer);