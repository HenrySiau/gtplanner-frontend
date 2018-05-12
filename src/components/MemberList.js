import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    rightMenuIcon: {
        marginRight: theme.spacing.unit,
        fontSize: 30,
        color: 'white'
    },
});


class MemberList extends React.Component {

    render() {
        const { classes, members } = this.props;
        let memberListItems = [];
        for (let key of members.keys()) {
            // console.log(value.userName);
            memberListItems.push(<li key={key}>{members.get(key).userName}</li>);
        }
        return (
            <ul>
                {memberListItems}
            </ul>
        )
    }
}

MemberList.propTypes = {
    classes: PropTypes.object.isRequired,
    // members: PropTypes.object.isRequired,
};

export default MemberList = withStyles(styles)(MemberList);
