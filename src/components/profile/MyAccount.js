import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { updateUserInfo } from '../../actions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import UpdateAvatarForm from './UpdateAvatarForm';
import UpdateUserProfileForm from './UpdateUserProfileForm';
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

    componentDidMount() {

    }

    setImageEditorRef = editor => this.ImageEditor = editor

    toggleEditUserInfo = () => {
        this.setState({ editUserInfo: true });
    }
    CloseImageEditor = () => {
        this.setState({ editImage: false });
    }
    CloseProfileEditor = () => {
        this.setState({ editUserInfo: false });
    }
    onSubmit = () => {

    }

    render() {
        const { classes, userInfo } = this.props;
        const UserInfo = () => {
            let userName = userInfo.userName || '';
            let email = userInfo.email || '';
            let phoneNumber = userInfo.phoneNumber || '';
            return (
                <div className={classes.form}>
                    <Avatar
                        alt="Profile Photo"
                        src={this.props.userInfo.profilePictureURL}
                        className={classes.avatar}
                    />
                    <p > {`User Name: ${userName}`}</p>
                    <p > {`Email: ${email}`}</p>
                    <p > {`phoneNumber Number: ${phoneNumber}`}</p>
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
                    {!this.state.editImage && <div className={classes.row}>
                        <Avatar
                            alt="Profile Photo"
                            src={this.props.userInfo.profilePictureURL}
                            className={classes.avatar}
                        />
                        <Button
                            variant="outlined"
                            // color="primary"
                            className={classes.changePhoto}
                            onClick={() => {
                                this.setState({ editImage: true })
                            }}
                        >
                            Change Photo
      </Button>

                    </div>}
                    {this.state.editImage ?
                        <UpdateAvatarForm
                            defaultImageUrl={this.props.userInfo.profilePictureURL}
                            onCancel={this.CloseImageEditor}
                        /> :
                        <UpdateUserProfileForm
                            onCancel={this.CloseProfileEditor}
                            userInfo={userInfo}
                        />}
                </div>
            )
        }


        return (
            <div className={classes.root} >
                {/* <h1>{this.props.userInfo.userName}</h1> */}
                {this.state.editUserInfo ? <EditUserInfo /> : <UserInfo />}

            </div >

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