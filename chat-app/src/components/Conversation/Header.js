import React, { useState } from 'react'
import { faker } from '@faker-js/faker'
import { Avatar, Box, Divider, Fade, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react'
import { styled, useTheme } from "@mui/material/styles"
import StyledBadge from '../StyledBadge'
import { ToggleSidebar } from '../../redux/slices/app'
import { useDispatch, useSelector } from 'react-redux'
import useResponsive from '../../hooks/useResponsive'
import { StartAudioCall } from '../../redux/slices/audioCall'

const Conversation_Menu = [
    {
        title: "Contact info",
    },
    {
        title: "Mute notifications",
    },
    {
        title: "Clear messages",
    },
    {
        title: "Delete chat",
    },
];

const Header = () => {
    const theme = useTheme()
    const isMobile = useResponsive("between", "md", "xs", "sm");
    const dispatch = useDispatch();
    const { current_conversation } = useSelector((state) => state.conversation.direct_chat);

    const [conversationMenuAnchorEl, setConversationMenuAnchorEl] = useState(null);
    const openConversationMenu = Boolean(conversationMenuAnchorEl);

    const handleClickConversationMenu = (event) => {
        setConversationMenuAnchorEl(event.currentTarget);
    };

    const handleCloseConversationMenu = () => {
        setConversationMenuAnchorEl(null);
    };
    return (
        <Box
            p={2}
            sx={{
                width: "100%",
                backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
                boxShadow: "0px 0px 2px rgba(0,0,0,0.25)"
            }}>
            <Stack
                alignItems={"center"}
                direction={"row"}
                justifyContent={"space-between"}
                sx={{ width: "100%", height: "100%" }}
            >
                <Stack onClick={() => {
                    dispatch(ToggleSidebar());
                }}
                    direction={"row"} spacing={2}>
                    <Box>
                        <StyledBadge overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            variant="dot"
                        >
                            <Avatar alt={current_conversation?.name} src={faker.image.avatar()} />
                        </StyledBadge>
                    </Box>
                    <Stack spacing={0.2}>
                        <Typography variant='subtitle2'>{current_conversation?.name}</Typography>
                        <Typography variant='caption'>Online</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
                    <IconButton>
                        <VideoCamera />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            dispatch(StartAudioCall(current_conversation.user_id));
                        }}
                    >
                        <Phone />
                    </IconButton>
                    {!isMobile && (
                        <IconButton>
                            <MagnifyingGlass />
                        </IconButton>
                    )}
                    <Divider orientation='vertical' flexItem />
                    <IconButton id="conversation-positioned-button"
                        aria-controls={
                            openConversationMenu
                                ? "conversation-positioned-menu"
                                : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openConversationMenu ? "true" : undefined}
                        onClick={handleClickConversationMenu}
                    >
                        <CaretDown />
                    </IconButton>
                    <Menu
                        MenuListProps={{
                            "aria-labelledby": "fade-button",
                        }}
                        TransitionComponent={Fade}
                        id="conversation-positioned-menu"
                        aria-labelledby="conversation-positioned-button"
                        anchorEl={conversationMenuAnchorEl}
                        open={openConversationMenu}
                        onClose={handleCloseConversationMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <Box>
                            <Stack spacing={1}>
                                {
                                    Conversation_Menu.map((el) => (
                                        <MenuItem onClick={handleCloseConversationMenu}>
                                            <Stack
                                                sx={{ minWidth: 100 }}
                                                direction="row"
                                                alignItems={"center"}
                                                justifyContent="space-between"
                                            >
                                                <span>{el.title}</span>
                                            </Stack>{" "}
                                        </MenuItem>
                                    ))
                                }
                            </Stack>
                        </Box>
                    </Menu>
                </Stack>
            </Stack>
        </Box>
    )
}

export default Header
