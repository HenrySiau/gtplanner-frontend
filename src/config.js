const isProductionStage = false;
const serverUrl = isProductionStage ? 'https://gtplanner.com' : 'http://localhost:8080';
const defaultProfilePictureURL = serverUrl + '/images/user.png'
const imageServerUrl = 'http://localhost:8080';
// const imageServerUrl = 'https://gtplanner.com';

const settings = {
    serverUrl: serverUrl,
    imageServerUrl: imageServerUrl,
    defaultProfilePictureURL: defaultProfilePictureURL
};

export default settings; 