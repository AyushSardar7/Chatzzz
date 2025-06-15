import { Link, Stack, Typography } from '@mui/material'
import React from 'react'
import NewPasswordFrom from '../../sections/auth/NewPasswordFrom'
import { CaretLeft } from 'phosphor-react'
import { Link as RouterLink } from 'react-router-dom'

const NewPassword = () => {
  return (
    <>
        <Stack className='new-password' spacing={2} sx={{mb:5,position:"relative" }}>
        <Typography variant='h3' paragraph>
          Reset Password
        </Typography>
        <Typography sx={{color:"text.secondary",mb:5}}>
            Please set your new password
        </Typography>
        {/*New Password Form*/}
        <NewPasswordFrom/>
        <Link
         component={RouterLink} 
        to="/auth/login" 
        color="inherit" 
        variant='subtitle2' 
        sx={{
          mt:3, 
          mx:"auto",
          alignItems:"center", 
          display:"inline"
          }}>
          <CaretLeft/>Return to Sign in
        </Link>
    </Stack>
    </>
  )
}

export default NewPassword
