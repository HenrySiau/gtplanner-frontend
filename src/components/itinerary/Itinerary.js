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
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    panelSummary: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    }
});

class Itinerary extends React.Component {
    state = {
        itineraryList: []
    }

    componentDidMount() {
        // TODO get trip info if tripInfo does not exist
        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/ideas',
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            params: {
                tripId: this.props.selectedTrip.tripId
            },
        })
            .then((response) => {
                if (response.data) {
                    const ideas = response.data.ideas;
                    if (ideas) {
                        let itineraryList = []
                        ideas.forEach(idea => {
                            if (idea.inItinerary) {
                                itineraryList.push(idea)
                            }
                        })
                        this.setState({ itineraryList: itineraryList });
                    }
                }
            })
            .catch((error) => {
                // TODO: show error message and guide user to re submit
                console.log(error);
                this.props.snackbarMessage('Network or Server error');
            });
    }

    getFormatedDate = (date) => {
        return (`${date.getMonth()}/${date.getDate()} `);
    }

    isItSameDate = (date1, date2) => {
        if (date1.getYear() !== date2.getYear()) {
            return false
        } else if (date1.getMonth() !== date2.getMonth()) {
            return false
        } else if (date1.getDate() !== date2.getDate()) {
            return false
        } else {
            console.log('same Date....')
            return true
        }
    }

    render() {
        const { classes } = this.props;
        let Content = [];
        const itineraryList = this.state.itineraryList;

        if (itineraryList.length > 0) {
            let temp = new Date(itineraryList[0].startAt);
            Content.push(<h3 key={'time1324erqrqradf'}> {this.getFormatedDate(temp)}</h3>)
            itineraryList.forEach(item => {
                const startAt = new Date(item.startAt);
                const endAt = new Date(item.endAt);

                if (this.isItSameDate(temp, new Date(item.startAt))) {
                    // Content.push(<h3 key={item.id}>{item.title} </h3>);
                    Content.push(
                        <ExpansionPanel key={item.id}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                                <div className={classes.panelSummary}>
                                    <Typography className={classes.heading}>{item.title}</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {`${startAt.getMonth()}/${startAt.getDate()}  ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDate()} ${endAt.getHours()}:${endAt.getMinutes()}`}
                                    </Typography>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails >
                                <Typography variant="caption">
                                    {item.description}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                } else {
                    temp = new Date(item.startAt);
                    Content.push(<h3 key={item.id + '-time'}> {this.getFormatedDate(temp)}</h3>)
                    // Content.push(<h3 key={item.id}>{item.title}</h3>)
                    Content.push(
                        <ExpansionPanel key={item.id}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <div className={classes.panelSummary}>
                                    <Typography className={classes.heading}>{item.title}</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {`${startAt.getMonth()}/${startAt.getDate()}  ${startAt.getHours()}:${startAt.getMinutes()} -- ${endAt.getMonth()}/${endAt.getDate()} ${endAt.getHours()}:${endAt.getMinutes()}`}
                                    </Typography>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails >
                                <Typography variant="caption">
                                    {item.description}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                }

            })

        }

        return (
            <div className={classes.root}>
                {Content}
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

Itinerary = withStyles(styles)(Itinerary);
export default connect(mapStateToProps, mapDispatchToProps)(Itinerary);