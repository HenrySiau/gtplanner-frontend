import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PrivateRoute from './utility/PrivateRoute';
import GTPAppBarContainer from './appBar/GTPAppBarContainer';
import SignUpFormContainer from './signUp/SignUpFormContainer';
import LoginForm from './login/LoginForm';
import StyleWrapper from './StyleWrapper';
import GTPSnackbar from './snackBar/GTPSnackbar';

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
      <StyleWrapper>
        <div className={classes.root}>
          <GTPAppBarContainer />
          {/* <GTPDrawerContainer /> */}
          <main className={classes.content}
          >
            <Route exact path="/" component={LoginForm} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/signup" component={SignUpFormContainer} />
            {/* 
              <Route exact path="/trip/join" component={JoinATrip} />
              <Route exact path="/privacy-policy" component={privacyPolicy} />
              <PrivateRoute exact path="/members/invite" component={InviteMemberForm} />
              <PrivateRoute exact path="/trip/new" component={CreateTripSection} />
              <PrivateRoute exact path="/dashboard" component={GTPDashboard} />
              <PrivateRoute exact path="/myaccount" component={MyAccount} /> */}
          </main>
          {/* <ChatRoomContainer /> */}
          <GTPSnackbar />
        </div>
      </StyleWrapper>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

