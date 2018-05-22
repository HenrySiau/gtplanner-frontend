import { UPDATE_FILTERED_MARKER_LIST } from '../actions/actionTypes';
import settings from '../config';

// export const filteredMarkerList = (state = [{lat: 10.794234, lng: 106.807000}, {lat: 10.794234, lng: 106.706541}], action) => {
export const filteredMarkerList = (state = [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }], action) => {
    switch (action.type) {
        case UPDATE_FILTERED_MARKER_LIST:
            return action.value;

        default:
            return state
    }
}

