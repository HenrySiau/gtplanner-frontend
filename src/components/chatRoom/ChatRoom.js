import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import '../../css/chatRoom.css';
import axios from 'axios';
import Message from './Message.js';
import uuidv4 from 'uuid/v4';
import io from 'socket.io-client';
import settings from '../../config';
import MemberList from './MemberList';


const socket = io(settings.serverUrl, { path: '/api/trip' });

const styles = theme => ({
    chatRoom: {
        width: 360,
        marginTop: 65,
    },
    drawerPaper: {
        position: 'relative',
        width: 360,
        boxShadow: '-3px 0px 5px 0px rgba(220,220,220,1)',

        // if paper position is relative, drawer will push main contain
        // otherwise it will over lay main contain
        [theme.breakpoints.up('sm')]: {
            position: 'relative',
        },
    },
    drawerHidden: {
        // width: 0,
        overflowX: 'hidden',
        display: 'none',
    },
    tab: {
        // height: '20px'
        marginTop: '0'
    }
});

class ChatRoom extends React.Component {
    state = {
        chats: []
    };
    componentDidMount() {
        this.scrollToBot();
        socket.emit('join channel', { tripId: this.props.tripId });
        socket.on('new member', member => {
            console.log('new member');
            this.props.addMember(member);
        });
        socket.on('new idea', idea => {
            console.log('new idea');
            // TODO add idea to list
        });
        // socket.on('new bc message', msg => {
        //     console.log('new bc message: ' + msg);
        // });
        socket.on('new message', msg => {
            console.log('new message: ' + msg);
            if (msg.userId !== this.props.userInfo.userId) {
                this.setState({
                    chats: this.state.chats.concat([msg])
                });
                if (!(this.props.isChatRoomOpen && this.props.chatRoomTabsValue === 0)) {
                    this.props.increaseChatMessageBadgeContent();
                }

            }
        });
        axios({
            method: 'GET',
            url: settings.serverUrl + '/api/get/chat/message',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            params: {
                tripId: this.props.tripId
            }
        })
            .then(response => {
                console.log(response.data.messages);
                this.setState({ chats: response.data.messages });
            })
            .catch(error => {
                console.error(error);
            })
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    handleTabChange = (event, value) => {
        if (value === 0 && this.props.chatMessageBadgeContent > 0) {
            this.props.clearChatMessageBadgeContent();
        }
        this.props.changeChatRoomTabsValue(value);
    };

    scrollToBot() {
        if (ReactDOM.findDOMNode(this.refs.chats)) {
            ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
        }
    }

    submitMessage(e) {
        window.markers += ':::';
        e.preventDefault();
        const message = ReactDOM.findDOMNode(this.refs.msg).value;
        this.setState({
            chats: this.state.chats.concat([{
                userId: this.props.userInfo.userId,
                content: message,
                id: uuidv4().toString(),
                composedAt: Date.now(),
                tripId: this.props.tripId
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });

        axios({
            method: 'POST',
            url: settings.serverUrl + '/api/post/chat/message/new',
            json: true,
            headers: {
                'x-access-token': localStorage.getItem('id_token'),
            },
            data: {
                message: {
                    userId: this.props.userInfo.userId,
                    content: message,
                    composedAt: Date.now(),
                    tripId: this.props.tripId
                }
            }
        })
            .then((response) => {
                console.log('message response: ' + response.data);

            })
            .catch((error) => {
                // TODO: show error message and guide user to re submit
                console.error(error);
            });
    }

    render() {
        let messages = [];
        const chats = this.state.chats;
        let lastMessageTime = this.state.chats[0] ? this.state.chats[0].composedAt : new Date();
        // show create time if the two messages are 5 minutes away
        chats.forEach((chat) => {
            if (new Date(chat.composedAt).getTime() - new Date(lastMessageTime).getTime() > 300000) {
                console.log('add Time');
                // add time indicator
                let currentChatTime = new Date(chat.composedAt);
                let timeString = currentChatTime.getMonth() + '/' + currentChatTime.getDate() + ' ' +
                    currentChatTime.getHours() + ':' + currentChatTime.getMinutes()
                messages.push(<li className="time" key={uuidv4()}>{timeString}</li>);
            }
            if (chat.userId === this.props.userInfo.userId) {
                messages.push(<Message
                    key={chat.id}
                    content={chat.content}
                    self={true}
                />);
            }
            else if (this.props.selectedTrip.members.has(chat.userId)) {
                messages.push(<Message
                    key={chat.id}
                    userName={this.props.selectedTrip.members.get(chat.userId).userName}
                    content={chat.content}
                    self={false}
                    profilePictureURL={this.props.selectedTrip.members.get(chat.userId).profilePictureURL}
                />);
            }
            lastMessageTime = chat.composedAt;
        });

        const { classes } = this.props;
        const chatRoom = (
            <div className={classes.chatRoom}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.props.chatRoomTabsValue}
                        onChange={this.handleTabChange}
                        // scrollable
                        // scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Chat" className={classes.tab} />
                        <Tab label="Members" className={classes.tab} />
                    </Tabs>
                </AppBar>
                {this.props.chatRoomTabsValue === 0 && <div>
                    <div className="chatroom">
                        <div className="chats" ref="chats">
                            {messages}
                        </div>
                        <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                            <input type="text" ref="msg" />
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </div>}
                {this.props.chatRoomTabsValue === 1 && <div>
                    {this.props.selectedTrip && <MemberList members={this.props.selectedTrip.members} />}
                </div>}

            </div >
        );

        return (
            <div>
                <Drawer
                    // variant="permanent"
                    variant='persistent'
                    anchor='right'
                    open={this.props.isChatRoomOpen && this.props.isLoggedIn && Boolean(this.props.tripId)}
                    classes={
                        this.props.isChatRoomOpen && this.props.tripId && this.props.isLoggedIn ?
                            { paper: classes.drawerPaper, } :
                            { paper: classes.drawerHidden, }}
                >
                    <div
                        tabIndex={0}
                        role="button"
                    >
                        {chatRoom}
                    </div>
                </Drawer>
            </div>
        );
    }
}

ChatRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoom);