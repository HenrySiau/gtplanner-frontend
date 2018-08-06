import React from 'react';
import CreateTripForm from '../components/forms/CreateTripForm';

const CreateTripSection = (props) => (
    <div className="createTripSectionContainer">

            <CreateTripForm className="createTripForm" {...props} />
  
    </div>


);

export default CreateTripSection;