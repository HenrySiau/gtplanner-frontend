import React from 'react';
import { connect } from 'react-redux';
import { updateFilteredMarkers } from '../actions';
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
                    updateFilteredMarkers={this.props.updateFilteredMarkers}
                />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tripId: state.selectedTrip.tripId,
        filteredMarkerList: state.filteredMarkerList,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateFilteredMarkers: (markers) => {
            dispatch(updateFilteredMarkers(markers));
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