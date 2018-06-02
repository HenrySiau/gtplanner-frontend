
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        width: 340
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: theme.spacing.unit,

        // width: 500,
        // backgroundColor: 'green',
    },

});
class UpdateUserProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onSubmit = () => {

    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.userInfoEditor}>
                <TextField
                    id="userName"
                    label="User Name"
                    className={classes.textField}
                    value={this.state.userName}
                    onChange={this.handleChange('userName')}
                    margin="normal"
                /><br />
                <TextField
                    id="email"
                    label="Email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    margin="normal"
                /><br />
                <TextField
                    id="phone"
                    label="Phone Number"
                    className={classes.textField}
                    value={this.state.phone}
                    onChange={this.handleChange('phone')}
                    margin="normal"
                /><br />
                <div className={classes.row}>
                    <Button
                        variant="raised"
                        color="primary"
                        className={classes.button}
                        onClick={this.props.onCancel}>
                        Cancel
      </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        className={classes.button}
                        onClick={this.onSubmit}>
                        Submit
      </Button>
                </div>
            </div>
        )
    }

}

UpdateUserProfileForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        tripId: state.selectedTrip.tripId,
    }
}

UpdateUserProfileForm = withStyles(styles)(UpdateUserProfileForm);
export default connect(mapStateToProps)(UpdateUserProfileForm);