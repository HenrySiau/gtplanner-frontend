import { UPDATE_FILTERED_MARKER_LIST } from '../actions/actionTypes';
import settings from '../config';

// export const filteredMarkerList = (state = [{lat: 10.794234, lng: 106.807000}, {lat: 10.794234, lng: 106.706541}], action) => {
export const filteredMarkerList = (state = [{ lat: 37.7749300, lng: -122.4194200 }, { lat: 37.7749300, lng: -122.4154200 }], action) => {
    switch (action.type) {
        case UPDATE_FILTERED_MARKER_LIST:
            return action;

        default:
            return state
    }
}

