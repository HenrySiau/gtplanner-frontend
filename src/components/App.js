import React, { Component } from 'react';
import GTPAppBarContainer from '../containers/GTPAppBarContainer';
import GTPDrawerContainer from '../containers/GTPDrawerContainer';
import ChatRoomContainer from '../containers/ChatRoomContainer';
import { Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#6ec6ff',
      main: '#2196f3',
      dark: '#0069c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    // height: 430,
    zIndex: 1,
    // overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    // width: '100%',
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <div className={this.props.classes.root}>
        <GTPAppBarContainer />
        <GTPDrawerContainer />
        <ChatRoomContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}



App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
