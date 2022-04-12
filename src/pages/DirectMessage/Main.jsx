import React from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import ContainerChannelList from './components/ContainerChannelList';
import ContainerChannel from './components/ContainerChannel';

const API_KEY = '9z6vzf5r88js';

const client = StreamChat.getInstance(API_KEY);

const Main = () => {
    return (
        <div className='app_wrapper'>
            <Chat client={client} theme="team light">
                <ContainerChannelList/>
                <ContainerChannel/>
            </Chat>
        </div>
    )
}

export default Main;