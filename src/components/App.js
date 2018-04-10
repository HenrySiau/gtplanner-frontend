import React, { Component } from 'react';
import GTPAppBarContainer from '../containers/GTPAppBarContainer';
import GTPDrawerContainer from '../containers/GTPDrawerContainer';
import ChatRoomContainer from '../containers/ChatRoomContainer';
import { Route} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import PrivateRoute from './PrivateRoute';
import LoginForm from './LoginForm';
import CreateTripSection from '../sections/CreateTripSection';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

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
    position: 'relative',
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    marginTop: '60px',
    marginRight: '20px',
    justifyContent: 'center',
    width: '100%',
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={this.props.classes.root}>
        <GTPAppBarContainer />
        <GTPDrawerContainer />
        <main className={this.props.classes.content}>
        <Route exact path="/login" component={LoginForm} />
        <PrivateRoute exact path="/trip/new" component={CreateTripSection} />
        </main>
        <ChatRoomContainer />
        
        </div>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}



App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
