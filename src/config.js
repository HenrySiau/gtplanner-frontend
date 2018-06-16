const isProductionStage = true;
const serverUrl = isProductionStage ? 'https://gtplanner.com' : 'http://localhost:8080';
const defaultProfilePictureURL = serverUrl + '/images/user.png'
const imageServerUrl = isProductionStage ? 'https://gtplanner.com' : 'http://localhost:8080';
const imagePath = '/images/';
// const imageServerUrl = 'https://gtplanner.com';

const settings = {
    serverUrl: serverUrl,
    imageServerUrl: imageServerUrl,
    defaultProfilePictureURL: defaultProfilePictureURL,
    imagePath: imagePath,
};

export default settings; 