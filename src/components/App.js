import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PrivateRoute from './PrivateRoute';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import GTPAppBarContainer from './appBar/GTPAppBarContainer';
import SignUpForm from './signUp/SignUpForm';
import LoginForm from './login/LoginForm';

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
    // padding: theme.spacing.unit * 3,
    margin: '63px 0 0 0',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100% - 63px)',
    overflow: 'scroll',
  },
});

class App extends Component {

  mainSectionStyle = () => {
    if (this.props.isDrawerExtended) {
      return { marginRight: '490px' }
    } else {
      return { marginRight: '0' }
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <div className={classes.root}>
            <GTPAppBarContainer />
            {/* <GTPDrawerContainer /> */}
            <main className={classes.content}
            >
             <Route exact path="/" component={LoginForm} />
              <Route exact path="/login" component={LoginForm} />
             <Route exact path="/signup" component={SignUpForm} />
              {/* 
              <Route exact path="/trip/join" component={JoinATrip} />
              <Route exact path="/privacy-policy" component={privacyPolicy} />
              <PrivateRoute exact path="/members/invite" component={InviteMemberForm} />
              <PrivateRoute exact path="/trip/new" component={CreateTripSection} />
              <PrivateRoute exact path="/dashboard" component={GTPDashboard} />
              <PrivateRoute exact path="/myaccount" component={MyAccount} /> */}
            </main>
            {/* <ChatRoomContainer /> */}
            {/* <GTPSnackbar /> */}
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

// App = withStyles(styles)(App);
// export default withRouter(
//   connect(mapStateToProps)(App)
// );
