import { Box, Divider, IconButton, Link, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { DotsThreeVertical, DownloadSimple, Image } from 'phosphor-react';
import React, { useState } from 'react'
import { Message_options } from '../../data';
import htmlReactParser from 'html-react-parser';

const TimeLine = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Divider width="46%" />
            <Typography variant='caption' sx={{ color: theme.palette.text }}>{el.text}</Typography>
            <Divider width="46%" />
        </Stack>
    )
}

const extractURL = (htmlString) => {
    const regex = /href="(.*?)"/;
    const match = regex.exec(htmlString);
    return match ? match[1] : null;
};
const LinkMsg = ({ el,menu }) => {
    const theme = useTheme();
    const url = extractURL(el.message);

    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
                borderRadius: 1.5,
                width: "max-content"
            }}>
               <Stack spacing={2}>
                <Stack 
                p={2}
                spacing={3}
                alignItems={"start"}
                direction={"column"}
                sx={{
                    backgroundColor:theme.palette.mode==="light"?"#F0F4FA":theme.palette.background.default,
                    borderRadius:1
                }}
                >
                    {el.preview &&(
                    <img src={el.preview} 
                    alt={htmlReactParser(el.message)}
                    style={{maxHeight:210 ,borderRadius:"10px"}}
                    />
                )}
                   
                    <Stack spacing={2}>
                    {url && (
                        <Typography
                            variant='subtitle2'
                            component={Link}
                            sx={{ color: theme.palette.primary.main }}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {url}
                        </Typography>
                    )}
                    </Stack> 
                </Stack>
                {url && (
                        <Typography
                            variant='body2'
                            component={Link}
                            sx={{ color:el.incoming 
                                ? theme.palette.text 
                                :"#fff"}}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {url}
                        </Typography>
                    )}
               </Stack>
            </Box>
            {menu && <MessageOptions/>}
        </Stack>
    )
}

const MediaMsg = ({el ,menu}) => {
    const theme = useTheme();
    return (
        <Stack  direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
                borderRadius: 1.5,
                width: "max-content"
            }}>
                <Stack spacing={1}>
                    <img src={el.img}
                    alt={el.message} 
                    style={{maxHeight:210,borderRadius:"10px"}}
                    />
                    <Typography variant='body2' 
                    color={el.incoming 
                    ? theme.palette.text 
                    : "#fff"}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            {menu && <MessageOptions/>}
        </Stack>
    )
}
const ReplyMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
                borderRadius: 1.5,
                width: "max-content"
            }}>
                <Stack spacing={2}>
                    <Stack p={2} 
                    direction={"column"} 
                    spacing={3} alignItems={"center"} 
                    sx={{
                    backgroundColor:theme.palette.background.paper,
                    borderRadius:1
                    }}>
                    <Typography variant='body2' color={theme.palette.text}>{el.message}</Typography>    
                    </Stack>
                    <Typography variant='body2' color={el.incoming 
                        ? theme.palette.text 
                        :"#fff"}>
                    {el.reply}
                    </Typography>
                </Stack>
            </Box>
             {menu && <MessageOptions/>}
        </Stack>
    )
}

const DocMsg = ({ el,menu }) => {
    const theme = useTheme();
    return (
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
                borderRadius: 1.5,
                width: "max-content"
            }}>
                <Stack spacing={2}>
                    <Stack spacing={1}  p={2} direction={"row"} alignItems={"center"}
                      sx={{
                        backgroundColor:theme.palette.mode==="light"
                        ?"#F0F4FA"
                        :theme.palette.background.default,
                        borderRadius:1
                    }}
                    >
                        <Image size={48}/>
                        <Typography variant='caption'>Ayush.png</Typography>
                        <IconButton>
                            <DownloadSimple/>
                        </IconButton>
                    </Stack>
                    <Typography variant='body2'  color={el.incoming ? theme.palette.text : "#fff"}>{el.message}</Typography>
                </Stack>
            </Box>
            {menu && <MessageOptions/>}
        </Stack>
    )
}

const TxtMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
      <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
        <Box
          p={1.5}
          sx={{
            backgroundColor: el.incoming ? theme.palette.background.paper : theme.palette.primary.main,
            borderRadius: 1.5,
            width: "max-content",
          }}
        >
          <Typography variant='body2' color={el.incoming ? theme.palette.text.primary : "#fff"}>
            {el.message}
          </Typography>
        </Box>
        {menu && <MessageOptions />} 
      </Stack>
    );
}

const MessageOptions=()=>{
    const [anchorEl, setAnchorEl] =useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    return(
        <>
         <DotsThreeVertical size={20} 
         id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} />
         <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
      <Stack spacing={1} px={1}>
        { Message_options.map((el)=>(
            <MenuItem onClick={handleClick}>{el.title}</MenuItem>
        ))}

      </Stack>
      </Menu>
        </>
    )
}

export { TimeLine, TxtMsg,MediaMsg,ReplyMsg,LinkMsg,DocMsg};
