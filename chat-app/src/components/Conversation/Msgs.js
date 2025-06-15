import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack } from '@mui/material';
import { socket } from '../../socket';
import { FetchCurrentMessages, SetCurrentConversation } from '../../redux/slices/converstion';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TimeLine, TxtMsg } from './MsgTypes';

const Msgs = ({ menu, isMobile }) => {
    const dispatch = useDispatch();
    const { conversations, current_messages } = useSelector(state => state.conversation.direct_chat);
    const { room_id } = useSelector(state => state.app);

    useEffect(() => {
        const current = conversations.find(el => el?.id === room_id);
        if (current) {
            socket.emit("get_message", { conversation_id: current.id }, (data) => {
                dispatch(FetchCurrentMessages({ messages: data }));
            });
            dispatch(SetCurrentConversation(current));
        }
    }, [conversations, room_id,socket,dispatch]);

    return (
        <Box p={isMobile ? 1 : 3}>
            <Stack spacing={3}>
                {current_messages ? (
                    current_messages.map((el) => {
                        if (!el) return null;
                        switch (el.type) {
                            case "divider":
                                return <TimeLine key={el._id} el={el} />;
                            case "Text":
                                return <TxtMsg key={el._id} el={el} menu={menu} />;
                            case "Media":
                                return <MediaMsg key={el._id} el={el} menu={menu} />;
                            case "Document":
                                return <DocMsg key={el._id} el={el} menu={menu} />;
                            case "Link":
                                return <LinkMsg key={el._id} el={el} menu={menu} />;
                            case "reply":
                                return <ReplyMsg key={el._id} el={el} menu={menu} />;
                            default:
                                return <TxtMsg key={el._id} el={el} menu={menu} />;
                        }
                    })
                ) : (
                    <p>No messages available.</p>
                )}
            </Stack>
        </Box>
    );
}

export default Msgs;
