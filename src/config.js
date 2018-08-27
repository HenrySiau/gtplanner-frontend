const isProductionStage = false;
const serverUrl = isProductionStage ? 'https://gtplanner.com' : 'http://localhost:8080';
const defaultProfilePictureURL = serverUrl + '/system-images/user.png'
const imageServerUrl = isProductionStage ? 'https://gtplanner.com' : 'http://localhost:8080';
const imagePath = '/images/';
const systemImagePath = '/system-images/';
const version = 'v0.23'
// const imageServerUrl = 'https://gtplanner.com';

const settings = {
    serverUrl: serverUrl,
    imageServerUrl: imageServerUrl,
    defaultProfilePictureURL: defaultProfilePictureURL,
    imagePath: imagePath,
    systemImagePath: systemImagePath,
    version: version,
};

export default settings; 