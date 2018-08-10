import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { snackbarMessage, updateSelectedTripWithInfo } from '../../actions';
import { push } from 'react-router-redux';
import Button from '@material-ui/core/Button';
import settings from '../../config';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        // flexGrow: 1,
        width: "100%",
        padding: theme.spacing.unit * 2,

    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    panel: {
        width: '100%',
        margin: '0 20 0 20'
    },
    selectTripButton: {
        width: 180,
        margin: '200 100 20 0',
        padding: '100'

    }
});

class Trips extends React.Component {
    state = {
        trips: []
    }

    componentDidMount() {
        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/trips',
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            }
        })
            .then((response) => {
                console.log(response);
                if (response.data) {
                    if (response.data.trips) {
                        this.setState({
                            trips: response.data.trips
                        })
                    }
                }
            })
            .catch((error) => {
                // TODO: show error message and guide user to re submit
                console.log(error);
                this.props.snackbarMessage('Network or Server error');
            });
    }
    createNewTrip = () => {
        this.props.push('/trip/new');
    }
    switchTrip = (tripId) => {
        console.log(tripId);
        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/fullTripInfo',
            params: {
                tripId: tripId
            },
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            }
        })
            .then((response) => {
                if (response.data) {
                    if (response.data.trip) {
                        this.props.updateSelectedTripWithInfo(response.data.trip);
                        // TODO update ideas and markers and messages
                        // maybe it's better just refresh the page 
                    }
                }
            })
            .catch((error) => {
                // TODO: show error message and guide user to re submit
                console.log(error);
                this.props.snackbarMessage('Network or Server error');
            });

    }
    render() {
        const { classes } = this.props;
        let TripList = [];
        let SelectedTripPanel;
        if (this.props.selectedTrip) {
            const trip = this.props.selectedTrip;
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);
            SelectedTripPanel = (
                <div>
                    <Typography variant="subheading" gutterBottom>
                        Selected Trip
  </Typography>
                    <ExpansionPanel key={trip.tripId} className={classes.panel}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>{trip.title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails >
                            <Grid container direction="column" spacing={8}>
                                <Typography variant="subheading" gutterBottom>
                                    {startDate.getMonth() + '/' + startDate.getDate() + '/' + startDate.getFullYear()} --
                                {endDate.getMonth() + '/' + endDate.getDate() + '/' + endDate.getFullYear()}
                                </Typography>
                                <Typography>
                                    {trip.description}
                                </Typography>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            )
        }

        for (let item of this.state.trips) {
            let startDate = new Date(item.startDate);
            let endDate = new Date(item.endDate);
            if (this.props.selectedTrip) {
                if (this.props.selectedTrip.tripId !== item.id) {
                    TripList.push(
                        <ExpansionPanel key={item.id} className={classes.panel}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>{item.title}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction="column" spacing={8}>
                                    <Grid item >
                                        <Typography>
                                            {startDate.getMonth() + '/' + startDate.getDate() + '/' + startDate.getFullYear()} --
                                    {endDate.getMonth() + '/' + endDate.getDate() + '/' + endDate.getFullYear()}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            onClick={() => { this.switchTrip(item.id) }}
                                            className={classes.selectTripButton}
                                        >
                                            Switch to This Trip
            </Button>
                                    </Grid>
                                    <Grid item >
                                        <Typography>
                                            {item.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                }

            } else {
                TripList.push(
                    <ExpansionPanel key={item.id} className={classes.panel}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>{item.title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column" spacing={8}>
                                <Grid item >
                                    <Typography>
                                        {startDate.getMonth() + '/' + startDate.getDate() + '/' + startDate.getFullYear()} --
                                    {endDate.getMonth() + '/' + endDate.getDate() + '/' + endDate.getFullYear()}
                                    </Typography>
                                </Grid>
                                <Grid item >
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        onClick={() => { this.switchTrip(item.id) }}
                                        className={classes.selectTripButton}
                                    >
                                        Switch to This Trip
            </Button>
                                </Grid>
                                <Grid item >
                                    <Typography>
                                        {item.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )
            }
        }
        let OtherTrips;
        if (TripList.length > 0) {
            OtherTrips = (
                <div>
                    <Typography variant="subheading" gutterBottom>
                        Other Trip{TripList.length > 1 && 's'}
                    </Typography>
                    {TripList}
                </div>
            );
        }
        const NoTrip = (
            <div>
                <Typography variant="headline" gutterBottom>
                    You don't have a trip yet.
      </Typography>
                <Button
                    variant="raised"
                    color="primary"
                    onClick={this.createNewTrip}
                    className={classes.createNewTripButton}
                >
                    Create a new Trip
            </Button>
            </div>
        );


        return (
            <div className={classes.root}>

                <br />
                <Typography variant="headline" gutterBottom>
                    My Trips
      </Typography>
                {this.state.trips.length === 0 && NoTrip}
                {SelectedTripPanel && SelectedTripPanel}
                <br />
                {TripList && OtherTrips}

                <br />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        invitationCode: state.invitationCode,
        isLoggedIn: state.isLoggedIn,
        selectedTrip: state.selectedTrip,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        push: (url) => {
            dispatch(push(url));
        },
        snackbarMessage: (msg) => {
            dispatch(snackbarMessage(msg));
        },
        updateSelectedTripWithInfo: (tripInfo) => {
            dispatch(updateSelectedTripWithInfo(tripInfo));
        },

    }
}

Trips = withStyles(styles)(Trips);
export default connect(mapStateToProps, mapDispatchToProps)(Trips);