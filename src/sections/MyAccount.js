import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import settings from '../config';
import { connect } from 'react-redux';
import { updateUserInfo } from '../actions';
import AvatarEditor from 'react-avatar-editor'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit * 2,

    },
    avatar: {
        // margin: 10,
        width: 50,
        height: 50,
        // marginRight: theme.spacing.unit * 2,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: 350,
        // backgroundColor: 'green',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: theme.spacing.unit,

        // width: 500,
        // backgroundColor: 'green',
    },
    editProfile: {
        height: 20,
    },
    changePhoto: {
        marginLeft: theme.spacing.unit * 2,
        height: 20,
    },
    input: {
        marginTop: theme.spacing.unit,
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
    }
});

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editUserInfo: false,
            editImage: false,
        }
    }

    toggleEditUserInfo = () => {
        this.setState({ editUserInfo: true });
    }
    toggleUserInfo = () => {
        this.setState({ editUserInfo: false });
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onSubmit = () => {

    }

    render() {
        const { classes, userInfo } = this.props;
        const UserInfo = () => {
            let userName = userInfo.userName || '';
            let email = userInfo.email || '';
            let phone = userInfo.phone || '';
            return (
                <div className={classes.form}>
                    <Avatar
                        alt="Profile Photo"
                        src={this.props.userInfo.profilePictureURL}
                        className={classes.avatar}
                    />
                    <p > {`User Name: ${userName}`}</p>
                    <p > {`Email: ${email}`}</p>
                    <p > {`Phone Number: ${phone}`}</p>
                    <div>
                        <Button
                            variant="raised"
                            color="primary"
                            className={classes.editProfile}
                            onClick={this.toggleEditUserInfo}>
                            Edit Profile
      </Button></div>
                </div>
            )
        }
        const EditUserInfo = () => {
            return (
                <div className={classes.form}>
                    <div className={classes.row}>
                    <Avatar
                        alt="Profile Photo"
                        src={this.props.userInfo.profilePictureURL}
                        className={classes.avatar}
                    />
                        {!this.state.editImage && <Button
                            variant="outlined"
                            // color="primary"
                            className={classes.changePhoto}
                            onClick={() => {
                                this.setState({ editImage: true })
                            }}
                        >
                            Change Photo
      </Button>}

                    </div>
                    {this.state.editImage ? <ImageEditor /> : <UserInfoEditor />}
                </div>
            )
        }
        const ImageEditor = () => {
            return (
                <div className={classes.imageEditor}>
                    <AvatarEditor
                        ref={this.setImageEditorRef}
                        image={this.state.imageFile}
                        width={200}
                        height={200}
                        border={[20, 20]}
                        borderRadius={100}
                        scale={this.state.imageScale}
                    /><br />
                    <input id='imageFileInput' name="Image File" type="file" accept="image/*" />
                    <br />
                    <div className={classes.row}>
                        <Button
                            variant="raised"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                this.setState({ editImage: false })
                            }}>
                            Cancel
      </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            className={classes.button}
                        // onClick={this.onSubmit}
                        >
                            Submit
      </Button>
                    </div>
                </div>
            )
        }
        const UserInfoEditor = () => {
            return (
                <div className={classes.userInfoEditor}>
                    <TextField
                        id="userName"
                        label="User Name"
                        className={classes.textField}
                        value={this.state.userName}
                        onChange={this.handleChange('userName')}
                        margin="normal"
                    /><br />
                    <TextField
                        id="email"
                        label="Email"
                        className={classes.textField}
                        value={this.state.email}
                        onChange={this.handleChange('email')}
                        margin="normal"
                    /><br />
                    <TextField
                        id="phone"
                        label="Phone Number"
                        className={classes.textField}
                        value={this.state.phone}
                        onChange={this.handleChange('phone')}
                        margin="normal"
                    /><br />
                    <div className={classes.row}>
                        <Button
                            variant="raised"
                            color="primary"
                            className={classes.button}
                            onClick={this.toggleUserInfo}>
                            Cancel
      </Button>
                        <Button
                            variant="raised"
                            color="primary"
                            className={classes.button}
                            onClick={this.onSubmit}>
                            Submit
      </Button>
                    </div>
                </div>
            )
        }

        return (
            <div className={classes.root}>
                {/* <h1>{this.props.userInfo.userName}</h1> */}
                {this.state.editUserInfo ? <EditUserInfo /> : <UserInfo />}

            </div>

        );
    }

}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: (userInfo) => {
            dispatch(updateUserInfo(userInfo));
        },
    }
}

MyAccount = connect(mapStateToProps, mapDispatchToProps)(MyAccount);
export default withStyles(styles)(MyAccount);