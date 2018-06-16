import React, { Component } from 'react';
import GTPAppBarContainer from '../containers/GTPAppBarContainer';
import GTPDrawerContainer from '../containers/GTPDrawerContainer';
import ChatRoomContainer from '../containers/ChatRoomContainer';
import { Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PrivateRoute from './PrivateRoute';
import LoginSection from '../sections/LoginSection';
import CreateTripSection from '../sections/CreateTripSection';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import GTPSnackbar from './GTPSnackbar';
import RegisterForm from './forms/RegisterForm';
import InviteMemberForm from './forms/InviteMemberForm';
import JoinATrip from './JoinATrip';
import GTPDashboard from './GTPDashboard';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MyAccount from '../sections/MyAccount';
import TestComponent from './forms/TestComponent';


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
    // const { classes, isDrawerOpen, isChatRoomOpen, isDrawerExtended } = this.props;
    const { classes } = this.props;
    // const mainSectionStyle = () => {
    //   let result = {};
    //   if (isDrawerOpen) {
    //     result.width = 'calc(100% -360px - 73px)'
    //   } else {
    //     result.width = 'calc(100% -360px - 73px)'
    //   }

    //   // if (isDrawerOpen) {
    //   //   result.marginRight = '360px'
    //   //   result.marginLeft = '73px';
    //   //   if (isDrawerExtended) {
    //   //     result.marginLeft = '0';
    //   //   }
    //   // } else {
    //   //   result.marginLeft = '0';
    //   // }
    //   return result
    // }
    return (
      // <TestComponent />
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className={classes.root}>
          {/* <TestComponent /> */}
            <GTPAppBarContainer />
            <GTPDrawerContainer />
            <main className={classes.content}
            // style={mainSectionStyle()}
            >
              <Route exact path="/" component={LoginSection} />
              <Route exact path="/login" component={LoginSection} />
              <Route exact path="/register" component={RegisterForm} />
              <Route exact path="/trip/join" component={JoinATrip} />
              <PrivateRoute exact path="/members/invite" component={InviteMemberForm} />
              <PrivateRoute exact path="/trip/new" component={CreateTripSection} />
              <PrivateRoute exact path="/dashboard" component={GTPDashboard} />
              <PrivateRoute exact path="/myaccount" component={MyAccount} />
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

const mapStateToProps = (state) => {
  return {
    isDrawerOpen: state.isDrawerOpen,
    isDrawerExtended: state.isDrawerExtended,
    isChatRoomOpen: state.isChatRoomOpen,
  }
}

export default withStyles(styles)(App);

// App = withStyles(styles)(App);
// export default withRouter(
//   connect(mapStateToProps)(App)
// );
