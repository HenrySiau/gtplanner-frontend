import React from 'react';
import PropTypes from 'prop-types';
import settings from '../config';

// TODO: props validation 
const Message = ({ chat, userName}) => (
    <li className= {`chat ${userName === chat.userName ? "right" : "left speech-bubble"}`} >
        {userName !== chat.userName
            && <div>
                {/* <img src={chat.img} alt={`${chat.userName}'s profile pic`} /> */}
                <img src={settings.imageServerUrl + '/images/user.png'} alt={`${chat.userName}'s profile pic`} />
                <h6 className='userName'>{chat.userName}</h6>
            </div>
        }

        <p>{chat.content}</p>
    </li>
);
Message.propTypes = {
    chat: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
};
export default Message;