import { combineReducers } from 'redux';
import isLoggedIn from './isLoggedIn';
import isDrawerOpen from './isDrawerOpen';
import { isSnackbarOpen, snackbarMessage } from './snackbar';
import { selectedTrip, invitationCode } from './selectedTrip';
import { recentTrips } from './recentTrips';
import isChatRoomOpen from './isChatRoomOpen';
import isDrawerExtended from './isDrawerExtended';
import {userInfo} from './userInfo';
import chatRoomTabsValue from './chatRoomTabsValue';
import {chatMessageBadgeContent, systemMessageBadgeContent} from './messageBadgeContents';
import {filteredMarkerList} from './googleMapMarkers';

export default combineReducers({
    isLoggedIn,
    isDrawerOpen,
    isSnackbarOpen,
    snackbarMessage,
    selectedTrip,
    invitationCode,
    recentTrips,
    isChatRoomOpen,
    isDrawerExtended,
    userInfo,
    chatRoomTabsValue,
    chatMessageBadgeContent,
    systemMessageBadgeContent,
    filteredMarkerList,
})