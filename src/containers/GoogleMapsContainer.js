import React from 'react';
import { connect } from 'react-redux';
import { updateFilteredMarkers, snackbarMessage } from '../actions';
import scriptLoader from 'react-async-script-loader';
import instanceConfig from '../instanceConfig';
import GoogleMaps from '../components/maps/GoogleMaps';

class GoogleMapsContainer extends React.Component {

    render() {
        return (
            <div>
                {(this.props.isScriptLoadSucceed) && <GoogleMaps
                    isScriptLoadSucceed={this.props.isScriptLoadSucceed}
                    filteredMarkerList={this.props.filteredMarkerList}
                    tripId={this.props.tripId}
                    selectedTrip={this.props.selectedTrip}
                    userInfo={this.props.userInfo}
                    updateFilteredMarkers={this.props.updateFilteredMarkers}
                    snackbarMessage={this.props.snackbarMessage}
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
    }
}

GoogleMapsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GoogleMapsContainer)

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=" + instanceConfig.googleMapApiKey + '&libraries=places']
)(GoogleMapsContainer);