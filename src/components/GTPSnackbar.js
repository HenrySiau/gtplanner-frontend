import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { connect } from 'react-redux';
import {snackbarMessageClose} from '../actions';


class GTPSnackbar extends React.Component {
    constructor(props) {
        super(props);
    }

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
            dispatch(snackbarMessageClose);
        }
    }
}

GTPSnackbar = connect(mapStateToProps, mapDispatchToProps)(GTPSnackbar);
export default GTPSnackbar