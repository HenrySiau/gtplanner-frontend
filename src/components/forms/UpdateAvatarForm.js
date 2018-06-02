
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AvatarEditor from 'react-avatar-editor'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import PropTypes from 'prop-types';


const styles = theme => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: theme.spacing.unit,

        // width: 500,
        // backgroundColor: 'green',
    },
    imageEditor: {
        marginTop: theme.spacing.unit,
        // marginTop: 5,
    },
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        width: 340
    },
});
class UpdateAvatarForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageFile: '',
            imageScale: 1,
            imageType: 'image/png',
        }
    }
    componentDidMount() {
        this.imageFileInput = document.getElementById('imageFileInput');
        this.imageZoomSlider = document.getElementById('imageZoomSlider');
        const that = this;
        this.imageZoomSlider.oninput = function () {
            that.setState({ imageScale: Number(this.value) / 100 });
        }

        let fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            console.log('file loaded');
            this.setState({
                imageFile: fileReader.result,
                // isImageReady: true,
            });
        }, false);
        this.imageFileInput.addEventListener('change', () => {
            let file = this.imageFileInput.files[0];

            if (file) {
                fileReader.readAsDataURL(file);
                console.log('imageType: ' + file.type);
                this.setState({ imageType: file.type })
            }
        })
    }
    onSubmit = () => {

    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.imageEditor} >
                <AvatarEditor
                    ref={this.setImageEditorRef}
                    // image={this.state.imageFile}
                    width={200}
                    height={200}
                    border={[20, 20]}
                    borderRadius={100}
                    scale={this.state.imageScale}
                /> <br />
                <input id='imageFileInput' name="Image File" type="file" accept="image/*" />
                <br />
                <label>Zoom  </label> <br />
                <input id="imageZoomSlider" type="range" min="100" max="400" defaultValue="100" className={classes.textField} />
                <br />
                <div className={classes.row}>
                    <Button
                        variant="raised"
                        color="primary"
                        className={classes.button}
                        onClick={this.props.onCancel}>
                        Cancel
  </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        className={classes.button}
                        onClick={this.onSubmit}
                    >
                        Submit
  </Button>
                </div>
            </div>
        )
    }

}

UpdateAvatarForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    defaultImage: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        tripId: state.selectedTrip.tripId,
    }
}

UpdateAvatarForm = withStyles(styles)(UpdateAvatarForm);
export default connect(mapStateToProps)(UpdateAvatarForm);