import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { Gear } from 'phosphor-react';
import Logo from '../../assets/Images/logo.ico';
import { Nav_Buttons, Profile_Menu } from '../../data';
import useSettings from '../../hooks/useSettings';
import AntSwitch from '../../components/AntSwitch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogoutUser } from '../../redux/slices/auth';
import { faker } from '@faker-js/faker';

const Sidebar = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { onToggleMode } = useSettings();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selected, setSelected] = useState(0)

    // Update selected state when location changes
    useEffect(() => {
        switch (location.pathname) {
            case '/app':
                setSelected(0);
                break;
            case '/group':
                setSelected(1);
                break;
            case '/call':
                setSelected(2);
                break;
            case '/settings':
                setSelected(3);
                break;
            default:
                setSelected(null); 
                break;
        }
    }, [location.pathname]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMenuItemClick = (index) => {
        if (index === 1) {
            setSelected(3);
        }else{
            setSelected(null);
        }
        navigate(getMenuPath(index));
        handleClose(); 
    };

    const getPath = (index) => {
        switch (index) {
            case 0:
                return '/app';
            case 1:
                return '/group';
            case 2:
                return '/call';
            case 3:
                return '/settings';
            default:
                return '/app'; 
        }
    };

    const getMenuPath = (index) => {
        switch (index) {
            case 0:
                return '/profile';
            case 1:
                return '/settings';
            case 2:
                return '/auth/login';
            default:
                return '/profile'; 
        }
    };
    //First Box is the menu box
    //First Stack in the menu box stacks all the menu items(icon box,people icon,message icon,call icon,settings,profile pic ,toggle button)
    //Second Stack contains the menu item form (icon box to settings)
    //Third Stack contains the menu item form(message icon to settings icon)
    return (
        <Box
            p={2}
            sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 0px 2px rgba(0 ,0 ,0 , 0.25)',
                height: '100vh',
                width: 100,
            }}
        >
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                sx={{ height: '100%' }}
                spacing={3}
            >
                <Stack alignItems="center" spacing={4}>
                    <Box
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            height: 64,
                            width: 64,
                            borderRadius: 1.5,
                        }}
                    >
                        <img src={Logo} alt="App logo" />
                    </Box>
                    <Stack direction="column" alignItems="center" spacing={3}>
                        {Nav_Buttons.map((el) =>
                            el.index === selected ? (
                                <Box
                                    p={1}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: 1.5,
                                    }}
                                    key={el.index}
                                >
                                    <IconButton sx={{ width: 'max-content', color: '#fff' }}>{el.icon}</IconButton>
                                </Box>
                            ) : (
                                <IconButton
                                    onClick={() => {
                                        setSelected(el.index);
                                        navigate(getPath(el.index));
                                    }}
                                    sx={{
                                        width: 'max-content',
                                        color: theme.palette.mode === 'light' ? '#000' : theme.palette.text.primary,
                                    }}
                                    key={el.index}
                                >
                                    {el.icon}
                                </IconButton>
                            )
                        )}
                        <Divider sx={{ width: '48px' }} />
                        {selected === 3 ? (
                            <Box
                                p={1}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: 1.5,
                                }}
                            >
                                <IconButton sx={{ width: 'max-content', color: '#fff' }}>
                                    <Gear />
                                </IconButton>
                            </Box>
                        ) : (
                            <IconButton
                                onClick={() => {
                                    setSelected(3);
                                    navigate(getPath(3));
                                }}
                                sx={{
                                    width: 'max-content',
                                    color: theme.palette.mode === 'light' ? '#000' : theme.palette.text.primary,
                                }}
                            >
                                <Gear />
                            </IconButton>
                        )}
                    </Stack>
                </Stack>
                <Stack spacing={4}>
                    <AntSwitch
                        onChange={() => {
                            onToggleMode();
                        }}
                        defaultChecked
                    />
                    <Avatar
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        src={faker.image.avatar()}
                    />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Stack spacing={1} px={1}>
                            {Profile_Menu.map((el, idx) => (
                                <MenuItem key={idx}>
                                    <Stack
                                        onClick={() => {
                                            if (idx === 2) {
                                                dispatch(LogoutUser());
                                            }
                                            handleMenuItemClick(idx);
                                            handleClose();
                                        }}
                                        sx={{ width: 100 }}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <span>{el.title}</span>
                                        {el.icon}
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Stack>
                    </Menu>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Sidebar;
