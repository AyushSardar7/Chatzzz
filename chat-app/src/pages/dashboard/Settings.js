import { useTheme } from '@mui/material/styles'
import { Avatar, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react';
import React from 'react';
import { Bell, CaretLeft, Image, Info, Key, Keyboard, Lock, Note, PencilCircle } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import { ScrollableBox } from '../../components/ScrollTool';
import Shortcuts from '../../sections/settings/Shortcuts';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const theme = useTheme();
    const [openList,setOpenList]=useState(false);
    const navigate = useNavigate();

    const handleOpenList=()=>{
        setOpenList(true);
    }
    const handleCloseList=()=>{
        setOpenList(false);
    }

    const Setting_list = [
        {
            key: 0,
            icon: <Bell size={20} />,
            title: "Notifications",
            onclick: () => { },
        },
        {
            key: 1,
            icon: <Lock size={20} />,
            title: "Privacy",
            onclick: () => { },
        },
        {
            key: 2,
            icon: <Key size={20} />,
            title: "Security",
            onclick: () => { },
        },
        {
            key: 3,
            icon: <PencilCircle size={20} />,
            title: "Theme",
            //   onclick: handleOpenTheme,
            onclick: () => { },
        },
        {
            key: 4,
            icon: <Image size={20} />,
            title: "Chat Wallpaper",
            onclick: () => { },
        },
        {
            key: 5,
            icon: <Note size={20} />,
            title: "Request Account Info",
            onclick: () => { },
        },
        {
            key: 6,
            icon: <Keyboard size={20} />,
            title: "Keyboard Shortcuts",
            onclick: handleOpenList,
           
        },
        {
            key: 7,
            icon: <Info size={20} />,
            title: "Help",
            onclick: () => { },
        },
    ];

    return (
        <>
        <Stack className='main' direction={"row"} sx={{ width: "100%" }}>
            {/*LeftPanel*/}
            <ScrollableBox className="left-panel" sx={{
                overflowY: "scroll",
                height: "100vh",
                width: 320,
                backgroundColor: theme.palette.mode === 'light'
                    ? "#F8FAFF"
                    : theme.palette.background,
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            }}>
                <Stack className='pannel-content' p={4} spacing={5}>
                    {/*Header*/}
                    <Stack className='header' direction={"row"} alignItems={"center"} spacing={3}>
                        <IconButton>
                            <CaretLeft size={24} color={"#4B4B4B"} />
                        </IconButton>
                        <Typography variant='h6'>Settings</Typography>
                    </Stack>
                    {/*Profile*/}
                    <Stack className='profile' 
                     direction={"row"} 
                     spacing={3}>

                        <Avatar src={faker.image.avatar()} alt={faker.name.fullName()}
                            sx={{ height: 56, width: 56 }}
                            onClick={()=>{
                                navigate("/profile")
                            }} 
                        />
                        <Stack spacing={0.5}>
                            <Typography variant='article'>{faker.name.fullName()}</Typography>
                            <Typography variant='body2'>{faker.random.words()}</Typography>

                        </Stack>
                    </Stack>
                    {/*List of options*/}
                    <Stack className='list' spacing={4}>
                        {
                            Setting_list.map(({ key, icon, title, onclick }) => (
                                <Stack spacing={2} sx={{ cursor: "pointer" }} onClick={onclick} key={key}>
                                    <Stack className='message-gourp' direction={"row"} alignItems={"center"}>
                                        {icon}
                                        <Typography variant='body2' paddingLeft={0.5}>{title}</Typography>
                                    </Stack>
                                    {key !== 7 && <Divider />}
                                </Stack>
                            ))
                        }
                    </Stack>
                </Stack>
            </ScrollableBox>
            {/*RightPanel*/}
        </Stack>
        {openList && <Shortcuts open={openList} handleClose={handleCloseList} />} 
        </>
    )
}

export default Settings
