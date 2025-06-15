import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass } from 'phosphor-react';
import { CallElement } from '../../components/CallElement';
import { ScrollableStack } from '../../components/ScrollTool';
import { useDispatch, useSelector } from 'react-redux';
import { FetchAllUsers, FetchFriends } from '../../redux/slices/app';
import { faker } from '@faker-js/faker';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
    const { all_users = [], friends = [] } = useSelector((state) => state.app); // Default value as empty array
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchAllUsers());
        dispatch(FetchFriends());
    }, [dispatch]);

    console.log(all_users, "Call List Info");
    console.log(friends, "Friends List Info");

    const userList = all_users.map((el) => ({
        id: el?._id,
        name: `${el?.firstname} ${el?.lastname}`,
        image: faker.image.avatar(),
    }));

    const friendList = friends.map((el) => ({
        id: el?._id,
        name: `${el?.firstname} ${el?.lastname}`,
        image: faker.image.avatar(),
    }));

    return (
        <Dialog fullWidth
            maxWidth="xs"
            open={open}
            TransitionComponent={Transition}
            keepMounted
            sx={{ p: 4 }}
            onClose={handleClose}
        >
            {/* Title */}
            <DialogTitle sx={{ mb: 3 }}>Start Call</DialogTitle>
            {/* Content */}
            <DialogContent>
                <Stack spacing={3}>
                    <Stack className='search' sx={{ width: "100%" }}>
                        <Search>
                            <SearchIconWrapper>
                                <MagnifyingGlass color='#709CE6' size={24} />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
                        </Search>
                    </Stack>
                    <ScrollableStack>
                        {/* Friends List */}
                        <Stack spacing={2}>
                            {friendList.map((el) => <CallElement key={el.id} {...el} handleClose={handleClose} />)}
                        {/* All Users List */}
                            {userList.map((el) => <CallElement key={el.id} {...el} handleClose={handleClose} />)}
                        </Stack>
                    </ScrollableStack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default StartCall;
