import React from 'react';
import LoginForm from '../components/LoginForm';
import { withStyles } from '@material-ui/core/styles';
import settings from '../config';

const styles = theme => ({
    loginSection: {
        // display: 'flex',
        // width: '100%',
        // height: '100%',
        // backgroundImage: settings.imageServerUrl + '/images/travel.png',
        // backgroundColor: 'green'
    },
    button: {
        margin: theme.spacing.unit,
        width: '250px',
    },
    forgotPasswordButton: {
        margin: theme.spacing.unit,
        width: '250px',
        color: '#616161',
        backgroundColor: '#EEEEEE',
        textTransform: 'capitalize',
    },
    textField: {
        width: '250px',
        margin: theme.spacing.unit,
    },
    loginWith: {
        width: '250px',
        textTransform: 'capitalize',
    },
    signUpButton: {
        width: '250px',
        textTransform: 'capitalize',
        margin: theme.spacing.unit,
    }
});

class LoginSection extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.loginSection} style={{backgroundColor: 'green'}}>
                <LoginForm />

            </div>


        );
    }

}
export default withStyles(styles)(LoginSection);