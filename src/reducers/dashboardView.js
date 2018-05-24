import { SET_DASHBOARD_VIEW_MAP, SET_DASHBOARD_VIEW_LIST, SET_DASHBOARD_VIEW_SPLIT } from '../actions/actionTypes';
import settings from '../config';

export const dashboardView = (state = 'split', action) => {
    switch (action.type) {
        case SET_DASHBOARD_VIEW_MAP:
            return 'map';
        case SET_DASHBOARD_VIEW_LIST:
            return 'list';
        case SET_DASHBOARD_VIEW_SPLIT:
            return 'split'
        default:
            return state
    }
}

