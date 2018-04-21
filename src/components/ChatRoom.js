import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import '../css/chatRoom.css';
import axios from 'axios';
import Message from './Message.js';
import uuidv4 from 'uuid/v4';

const styles = theme => ({
    chatRoom: {
        width: 360,
        marginTop: 65,
    },
    drawerPaper: {
        width: 360,
        boxShadow: '-3px 0px 5px 0px rgba(220,220,220,1)',

        // if paper position is relative, drawer will push main contain
        // otherwise it will over lay main contain
        [theme.breakpoints.up('sm')]: {
            position: 'relative',
        },
    },
    drawerHidden: {
        // position: 'absolute',
        width: 0
    },
    tab: {
        // height: '20px'
        marginTop: '0'
    }
});

class ChatRoom extends React.Component {
    state = {
        value: 0,
        chats: [{
            userName: "Zhiheng Xiao",
            content: `Hello!`,
            img: "/img/user1.jpeg",
            id: "3745ce45-d5ae-469b-a5fd-f73a94c4b142",
            created: "1519155014769"
        }, {
            userName: "Alice Chow",
            content: `Hi~ `,
            img: "/img/user1.jpeg",
            id: "2b58d172-c1a2-4ef6-a788-aafe23352760",
            created: "1519155024769"
        }, {
            userName: "Zhiheng Xiao",
            content: `It is going to rain next week`,
            img: "/img/user1.jpeg",
            id: "9ec0b75f-cf9d-405d-a90b-b97b248ca25d",
            created: "1519155034769"
        }, {
            userName: "I really hate people have long names like this",
            content: `Yes, shall we reschedule then? I have to three weedings to attend next month, omg...`,
            img: "/img/zhiheng.jpg",
            id: "729615b8-4f95-4628-b125-43c2367f241d",
            created: "1519155044769"
        }, {
            userName: "Zhiheng Xiao",
            content: `🤔️`,
            img: "/img/user1.jpeg",
            id: "e5482960-fd2c-486b-9f7a-9c7e3c3d2bd3",
            created: "1519155054769"
        }, {
            userName: "Zhiheng Xiao",
            content: `或许我们可以往北边走`,
            img: "/img/user1.jpeg",
            id: "555df5b4-a394-4040-a8dd-f140b0e2fccf",
            created: "1519155064769"
        }, {
            userName: "Zhiheng Xiao",
            content: `We can go fishing at Bodaga Bay`,
            img: "/img/user1.jpeg",
            id: "a8e77beb-4fc1-402a-9023-0919add14734",
            created: "1519155074769"
        }, {
            userName: "Alice Chow",
            content: `Definitely! Sounds great!`,
            img: "/img/user1.jpeg",
            id: "a87753b3-2cc1-4cbb-9d4f-09a41e5ffc43",
            created: "1519155584769"
        }],
    };
    componentDidMount() {
        this.scrollToBot();
        // axios.get('/api/messages').then(
        //     (response) => {
        //         this.setState({ chats: this.state.chats.concat(response.data.chats) });
        //     }).catch((error) => {
        //         // TODO: add error handling function
        //         console.error(error);
        //     });
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                userName: "Zhiheng Xiao",
                content: `${ReactDOM.findDOMNode(this.refs.msg).value}`,
                img: "/img/user1.jpeg",
                id: uuidv4().toString(),
                created: Date.now()
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });
    }

    render() {
        const userName = "Zhiheng Xiao";
        var messages = [];
        const chats = this.state.chats;
        var lastMessageTime = this.state.chats[0] ? this.state.chats[0].created : Date.now();
        // show create time if the two messages are 5 minutes away
        // TODO: simiify time indicator, only shows time or add yesterday/Feb 9, 2018 22:22
        // hint: Date.getTimezoneOffset() then tolocaltime
        chats.forEach((chat) => {
            if (chat.created - lastMessageTime > 300000) {
                var currentChatTime = new Date(parseInt(chat.created)).toUTCString();
                messages.push(<li className="time" key={uuidv4()}>{currentChatTime}</li>);
                messages.push(<Message chat={chat} userName={userName} key={chat.id} />);
            } else {
                messages.push(<Message chat={chat} userName={userName} key={chat.id} />);
            }
            lastMessageTime = chat.created;
        });

        const { classes } = this.props;
        const { value } = this.state;
        const chatRoom = (
            <div className={classes.chatRoom}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        // scrollable
                        // scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Discussion" className={classes.tab} />
                        <Tab label="Members" className={classes.tab} />
                    </Tabs>
                </AppBar>
                {value === 0 && <Typography>
                    <div className="chatroom">
                    <ul className="chats" ref="chats">
                        {messages}
                    </ul>
                    <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                        <input type="text" ref="msg" />
                        <input type="submit" value="Submit" />
                    </form>
                    </div>
                </Typography>}
                {value === 1 && <Typography>Members</Typography>}

            </div >
        );

        return (
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
        );
    }
}

ChatRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoom);