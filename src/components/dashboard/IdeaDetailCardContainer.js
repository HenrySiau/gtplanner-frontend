import { connect } from 'react-redux';
import { updateFilteredMarkers, snackbarMessage, updateIdeas, addIdea, updateFilteredIdeas, addFilteredIdea, updateFocusedIdea } from '../../actions';
import IdeaDetailCard from './IdeaDetailCard';


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
        updateIdeas: (ideasMap) => {
            dispatch(updateIdeas(ideasMap));
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

export default connect(mapStateToProps, mapDispatchToProps)(IdeaDetailCard)