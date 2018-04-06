import React, { Component } from 'react';
import GTPAppBarContainer from '../containers/GTPAppBarContainer';
import GTPDrawerContainer from '../containers/GTPDrawerContainer';
import { Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

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


class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <GTPAppBarContainer />
        <GTPDrawerContainer />
      </MuiThemeProvider>
    );
  }
}

export default App;
