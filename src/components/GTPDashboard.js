import React from 'react';
import GoogleMapsContainer from '../containers/GoogleMapsContainer';

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
        return (
            <div>
                <GoogleMapsContainer />
            </div>
        );
    }
}

export default GTPDashboard;