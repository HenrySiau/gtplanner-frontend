import React from 'react';

class NewIdeal extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
     

    }
    componentDidUpdate(prevProps, prevState) {

        if(prevProps.filteredMarkerList !== this.props.filteredMarkerList){
            console.log('componentDidUpdate');
        }
        
    }


    render() {
        return (
            <div>
                <h1>New Ideal</h1>
            </div>
        )
    }
}


export default NewIdeal