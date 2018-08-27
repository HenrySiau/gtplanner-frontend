import React from 'react';

// TODO: props validation 

const Message = ({ userName, content, self, profilePictureURL }) => (
    <div className={`chat ${self ? "right" : "left speech-bubble"}`} >
        {!self
            && <div>
                {/* <img src={chat.img} alt={`${chat.userName}'s profile pic`} /> */}
                <img src={profilePictureURL} alt={`${userName}'s profile pic`} />
                <h6 className='userName'>{userName}</h6>
            </div>
        }
        <p className='chatContent'>{content}</p>
    </div>
);
Message.propTypes = {
    // chat: PropTypes.object.isRequired,
    // userName: PropTypes.string.isRequired,
};
export default Message;