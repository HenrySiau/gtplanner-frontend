import React from 'react';
import PropTypes from 'prop-types';

class MemberList extends React.Component {

    render() {
        const { members } = this.props;
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

export default MemberList;
