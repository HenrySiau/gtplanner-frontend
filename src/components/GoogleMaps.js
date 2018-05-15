import React from 'react';
import scriptLoader from 'react-async-script-loader';
import instanceConfig from '../instanceConfig';

// @scriptLoader(['https://maps.googleapis.com/maps/api/js?key=' +instanceConfig.googleMapApiKey])
class GoogleMaps extends React.Component {
    constructor(props) {
        super(props);
        // this.map = null;
        this.mapsDiv = React.createRef();
    }

    componentWillReceiveProps({ isScriptLoadSucceed }) {
        if (isScriptLoadSucceed) {
            // var map = new window.google.maps.Map(document.getElementById('map'), {
            //     center: { lat: 10.794234, lng: 106.706541 },
            //     zoom: 20
            // });
            this.map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: { lat: 37.7749300, lng: -122.4194200 }
            });
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    this.map.setCenter(pos);

                    const marker = new window.google.maps.Marker({
                        position: pos,
                        map: this.map,
                        title: 'Hello World!'
                    });
                }, () => {
                    console.log('navigator disabled');
                });
            } else {
                // Browser doesn't support Geolocation
                console.log('navigator disabled');
            }
        }
        else {
            console.error('can not load google map');
        }

    }

    render() {
        return (
            <div>
                <div style={{ height: '800px', width: '800px' }} id='map'></div>
                {/* {this.map && <div className="center-md">Loading...</div>} */}
            </div>
        )
    }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=" + instanceConfig.googleMapApiKey]
)(GoogleMaps)