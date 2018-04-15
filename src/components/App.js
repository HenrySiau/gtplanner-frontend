import React, { Component } from 'react';
import GTPAppBarContainer from '../containers/GTPAppBarContainer';
import GTPDrawerContainer from '../containers/GTPDrawerContainer';
import ChatRoomContainer from '../containers/ChatRoomContainer';
import { Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import PrivateRoute from './PrivateRoute';
import LoginForm from './LoginForm';
import CreateTripSection from '../sections/CreateTripSection';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import GTPSnackbar from './GTPSnackbar';
import RegisterForm from './RegisterForm';
import InviteMemberForm from './InviteMemberForm';
import JoinATrip from './JoinATrip';


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
    display: 'flex',
  },
  content: {
    display: 'flex',
    position: 'relative',
    // flexGrow: 1,
    padding: theme.spacing.unit * 3,
    marginTop: '60px',
    justifyContent: 'center',
    width: '100%',
    overflow: 'scroll',
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
              <Route exact path="/" component={LoginForm} />
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/register" component={RegisterForm} />
              <Route exact path="/register" component={RegisterForm} />
              <PrivateRoute exact path="/trip/join" component={JoinATrip} />
              <PrivateRoute exact path="/members/invite" component={InviteMemberForm} />
            </main>
            <ChatRoomContainer />
            <GTPSnackbar />
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
