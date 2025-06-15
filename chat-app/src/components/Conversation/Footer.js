import {
    Camera,
    File,
    Image,
    LinkSimple,
    PaperPlaneTilt,
    Smiley,
    Sticker,
    User,
} from "phosphor-react";
import React, { useRef, useState } from 'react';
import { Box, Fab, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { styled, useTheme } from "@mui/material/styles";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import useResponsive from "../../hooks/useResponsive";
import { socket } from "../../socket";
import { useSelector } from "react-redux";

const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
        paddingTop: "12px",
        paddingBottom: "12px",
    }
}));

const Actions = [
    {
        color: "#4da5fe",
        icon: <Image size={24} />,
        y: 102,
        title: "Photo/Video",
    },
    {
        color: "#1b8cfe",
        icon: <Sticker size={24} />,
        y: 172,
        title: "Stickers",
    },
    {
        color: "#0172e4",
        icon: <Camera size={24} />,
        y: 242,
        title: "Image",
    },
    {
        color: "#0159b2",
        icon: <File size={24} />,
        y: 312,
        title: "Document",
    },
    {
        color: "#013f7f",
        icon: <User size={24} />,
        y: 382,
        title: "Contact",
    },
];

const ChatInput = ({ setValue, value, setOpenpicker, inputRef }) => {
    const [openAction, setOpenAction] = useState(false);
    return (
        <StyledInput 
            inputRef={inputRef} 
            value={value} 
            onChange={(event) => { setValue(event.target.value); }} 
            fullWidth 
            placeholder='Write a message...' 
            variant='filled'
            InputProps={{
                disableUnderline: true,
                startAdornment: (
                    <Stack sx={{ width: 'max-content' }}>
                        <Stack sx={{ position: 'relative', display: openAction ? "inline-block" : "none" }}>
                            {Actions.map((el, index) => (
                                <Tooltip key={el.title + index} placement="right" title={el.title}>
                                    <Fab onClick={() => {
                                        setOpenAction(!openAction)
                                    }}
                                        sx={{
                                            position: "absolute",
                                            top: -el.y,
                                            backgroundColor: el.color
                                        }}>
                                        {el.icon}
                                    </Fab>
                                </Tooltip>
                            ))}
                        </Stack>
                        <InputAdornment position="start">
                            <IconButton onClick={() => {
                                setOpenAction((prev) => !prev);
                            }}>
                                <LinkSimple />
                            </IconButton>
                        </InputAdornment>
                    </Stack>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => {
                            setOpenpicker((prev) => !prev);
                        }}>
                            <Smiley />
                        </IconButton>
                    </InputAdornment>
                )
            }} 
        />
    )
}

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
        urlRegex,
        (url) => `<a href="${url}" target="_blank">${url}</a>`
    );
}

function containsUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
}

const Footer = () => {
    const theme = useTheme();
    const [value, setValue] = useState("");
    const inputRef = useRef(null);
    const [openPicker, setOpenpicker] = useState(false);
    const user_id = window.localStorage.getItem("user_id");
    const isMobile = useResponsive("between", "md", "xs", "sm");

    const { current_conversation } = useSelector(
        (state) => state.conversation.direct_chat
    );

    const { sideBar, room_id } = useSelector((state) => state.app);

    function handleEmojiClick(emoji) {
        const input = inputRef.current;

        if (input) {
            const selectionStart = input.selectionStart;
            const selectionEnd = input.selectionEnd;

            setValue(
                value.substring(0, selectionStart) +
                emoji.native +
                value.substring(selectionEnd)
            );

            // Move the cursor to the end of the inserted emoji
            input.selectionStart = input.selectionEnd = selectionStart + emoji.native.length;
        }
    }

    const handleMessageSend = () => {
        if (!user_id) {
            console.error("User ID is undefined. Cannot send message.");
            return;
        }

        if (!current_conversation || !current_conversation.user_id) {
            console.error("Invalid conversation data. Cannot send message.");
            return;
        }

        socket.emit("text_message", {
            message: linkify(value),
            conversation_id: room_id,
            from: user_id,
            to: current_conversation.user_id,
            type: containsUrl(value) ? "Link" : "Text",
        });

        setValue(""); // Clear input after sending message
    };

    return (
        <Box
            p={isMobile ? 1 : 2}
            sx={{
                width: "100%",
                backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
                boxShadow: "0px 0px 2px rgba(0,0,0,0.25)"
            }}>
            <Stack direction="row" alignItems={"center"} spacing={3}>
                <Stack sx={{ width: "100%" }}>
                    <Box sx={{ display: openPicker ? "inline" : "none", zIndex: 10, position: "fixed", bottom: 81, right: 100 }}>
                        <Picker data={data} theme={theme.palette.mode} onEmojiSelect={handleEmojiClick} />
                    </Box>
                    <ChatInput
                        value={value}
                        setValue={setValue}
                        setOpenpicker={setOpenpicker}
                        openPicker={openPicker}
                        inputRef={inputRef}
                    />
                </Stack>
                <Box sx={{ height: 48, width: 48, backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
                    <Stack sx={{ height: "100%", width: "100%" }} alignItems={"center"} justifyContent={"center"}>
                        <IconButton onClick={handleMessageSend}>
                            <PaperPlaneTilt color='#fff' />
                        </IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}

export default Footer;
