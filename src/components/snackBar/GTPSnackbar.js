import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from 'react-redux';
import {snackbarMessageClose} from '../../actions';
import { withRouter } from 'react-router-dom';


class GTPSnackbar extends React.Component {
    
    render() {
        return (
            <Snackbar
            open={this.props.isSnackbarOpen}
            message={this.props.snackbarMessage}
            autoHideDuration={4500}
            onClose={this.props.snackbarMessageClose}
          />
        );
    }
}

const mapStateToProps = (state) => {
    return {
      isSnackbarOpen: state.isSnackbarOpen,
      snackbarMessage: state.snackbarMessage
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
        snackbarMessageClose: () => {
            dispatch(snackbarMessageClose());
        }
    }
}

export default GTPSnackbar = withRouter(connect(mapStateToProps, mapDispatchToProps)(GTPSnackbar));