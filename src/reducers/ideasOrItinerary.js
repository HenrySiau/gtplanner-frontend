import { SET_VIEW_IDEA, SET_VIEW_ITINERARY } from '../actions/actionTypes';
import settings from '../config';

export const ideasOrItinerary = (state = 'itinerary', action) => {
    switch (action.type) {
        case SET_VIEW_IDEA:
            return 'idea';
        case SET_VIEW_ITINERARY:
            return 'itinerary';
        default:
            return state
    }
}

