import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import axios from 'axios';
import settings from '../config';
import { connect } from 'react-redux';
import { loginWithPassword } from '../actions';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
  });
  

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    // toggleLogin = this.props.toggleLogin;

    handleEmailChange = (event) => {

        this.setState({
            email: event.target.value
        });
    };
    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    };

    handleSubmit = () => {
        this.props.dispatch(loginWithPassword(this.state.email, this.state.password, this.props.inviteCode));
    }

    handlePressEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <TextField
                    label="Email"
                    onChange={this.handleEmailChange}
                /><br />
                <TextField
                    label="Password"
                    type="password"
                    onChange={this.handlePasswordChange}
                    onKeyPress={this.handlePressEnter}
                /><br />
                <Button variant="raised" color="primary" className={classes.button}>
                Login
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        inviteCode: state.inviteCode
    }
}

LoginForm = connect(mapStateToProps)(withStyles(styles)(LoginForm));
export default LoginForm