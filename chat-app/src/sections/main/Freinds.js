import { Dialog, DialogContent, Stack, Tab, Tabs } from '@mui/material';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FetchFriendRequests, FetchFriends, FetchSenderRequests, FetchUsers } from '../../redux/slices/app';
import { FriendComponent, FriendRequestComponent, UserComponent } from '../../components/Friends';


const UserList=()=>{
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(FetchUsers());
    dispatch(FetchSenderRequests());
  },[dispatch])
  const {users,senderfriendRequest,friendRequests}=useSelector((state)=>state.app);
  return(
    <>
    {
      users.map((el,idx)=>{
        return<UserComponent key={el._id} friendRequest={friendRequests} senderfriendRequest={senderfriendRequest} {...el}/>
      })
    }
    </>
  )
}
const FreindList=()=>{
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(FetchFriends());
  },[])
  const {friends}=useSelector((state)=>state.app);
  return(
    <>
    {
      friends.map((el,idx)=>{
        return<FriendComponent key={el._id}{...el}/>
      })
    }
    </>
  )
}
const FreindRequestList=()=>{
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(FetchFriendRequests());
  },[])
  const {friendRequests}=useSelector((state)=>state.app);

  if (!Array.isArray(friendRequests) || !friendRequests.length) {
    return <div>No friend requests</div>;
  }
  
  return(
    <>
    {
     friendRequests.map((el,idx)=>{
        return<FriendRequestComponent key={el._id}{...el.sender}id={el._id}/>
      })
    }
    </>
  )
}

const Freinds = ({open,handleClose}) => {
    const [value,setValue]=useState(0);
    const handleChange=(event,newValue)=>{
        setValue(newValue);
    }
  return (
    <Dialog 
    fullWidth 
    maxWidth="xs" open={open} 
    keepMounted 
    onClose={handleClose} 
    sx={{p:4}}>
      <Stack className='main' p={2} sx={{width:"100%"}}>
        <Tabs value={value} onChange={handleChange} centered> 
        <Tab label="Explore"/>
        <Tab label="Friends"/>
        <Tab label="Requests"/>
        </Tabs>
      </Stack>
      {/* Dialog content */}
      <DialogContent>
        <Stack className='conetent-box' 
        sx={{height:"100%"}}>
          <Stack spacing={2.5}>
            {(()=>{
              switch (value) {
                case 0://display all users
                return <UserList/>
              
                case 1://display all friends
                return<FreindList/>
            
                case 2://display all friend request
                return <FreindRequestList/>
                
                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default Freinds
