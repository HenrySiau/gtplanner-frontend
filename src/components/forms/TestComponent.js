
import React from 'react';
import { connect } from 'react-redux';
import { updateProfilePictureUrl } from '../../actions';


class TestComponent extends React.Component {
    render() {
        return (
            <div >
<h1>{'TEST... TEST...'}</h1>
            </div>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        tripId: state.selectedTrip.tripId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateProfilePictureUrl: (imageName) => {
            dispatch(updateProfilePictureUrl(imageName));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);