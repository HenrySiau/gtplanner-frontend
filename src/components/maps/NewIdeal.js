import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '../../css/googleMaps.css';

const styles = theme => ({
    dialogButton: {
        margin: '0 10px 0 10px'
    },
});

class NewIdeal extends React.Component {
    constructor(props) {
        super(props);
        this.autocomplete = null;
    }

    componentDidMount() {
        this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('googleMapAutocomplete'));

    }
    componentDidUpdate(prevProps, prevState) {

        if (prevProps.filteredMarkerList !== this.props.filteredMarkerList) {
            console.log('componentDidUpdate');
        }

    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <form autoComplete="off">
                    <TextField
                        id="googleMapAutocomplete"
                        label="Address"
                        // className={classes.textField}
                        // value={this.state.name}
                        onChange={this.handleAddressChange}
                        margin="normal"
                    />

                    {/* <input type="text" name="autocomplete" id="googleMapAutocomplete" autoComplete='off'/> */}
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={() => { console.log('value: ' + document.getElementById('googleMapAutocomplete').value) }}
                        className={classes.dialogButton}
                    >
                        Get Address
            </Button>
                </form>
            </div>
        )
    }
}


export default withStyles(styles)(NewIdeal)