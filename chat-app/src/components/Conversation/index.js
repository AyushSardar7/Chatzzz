import { Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import Msgs from './Msgs';
import useResponsive from '../../hooks/useResponsive';
import { ScrollableBox } from '../ScrollTool';
import { useSelector } from 'react-redux';


const Conversation = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(()=>{
    messageListRef.current.scrollTop=messageListRef.current.scrollHeight
  },[current_messages])
  return (
    <Stack height="100%" maxHeight="100vh" width={isMobile ? "100vw" : "auto"}>
      {/* Chat Header */}
      <Header />

      {/* Messages */}
      <ScrollableBox 
      spacing={2} 
      ref={messageListRef}
      direction="column" 
      width="100%" 
      sx=
      {{ flexGrow: 1, 
      height: "100%", 
      overflowY: "scroll"
       }}
       >
        <Msgs menu={true} isMobile={isMobile}  />
      </ScrollableBox>

      {/* Chat Footer */}
      <Footer />
    </Stack>
  );
};

export default Conversation;
