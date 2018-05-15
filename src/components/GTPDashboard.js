import React from 'react';
import { withStyles } from 'material-ui/styles';
import scriptLoader from 'react-async-script-loader'
import GoogleMaps from './GoogleMaps';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        marginLeft: '130px',
    },

    input: {
        margin: theme.spacing.unit,
        width: '250px'
    },
});

class GTPDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit = () => {

    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                {/* <MapContainer /> */}
                <GoogleMaps />

            </div>
        );
    }
}

export default GTPDashboard = withStyles(styles)(GTPDashboard);