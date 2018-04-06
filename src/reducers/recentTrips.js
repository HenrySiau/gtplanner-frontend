import { UPDATE_RECENT_TRIPS } from '../actions/actionTypes';

export const recentTrips = (state = [], action) => {
    switch (action.type) {
        case UPDATE_RECENT_TRIPS:
            return action.trips
        default:
            return state
    }
}