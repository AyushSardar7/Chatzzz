import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { ShowSnackbar, selectConverstion } from "../../redux/slices/app";
import { AddDirectConversations, AddDirectMessage, FetchtConversations, UpdateDirectConversations } from "../../redux/slices/converstion";
import useResponsive from "../../hooks/useResponsive";
import { PushAudioCallQueue, ResetAudioCallQueue, UpdateAudioCallDialog } from "../../redux/slices/audioCall";
import AudioCallNotification from "../../sections/settings/Audio/CallNotification";
import AudioCallDialog from "../../sections/settings/Audio/CallDailog";


const DashboardLayout = () => {
  const dispatch = useDispatch();
  const isDesktop = useResponsive("up", "md");
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector((state) => state.conversation.direct_chat);
  const { open_audio_notification_dialog, open_audio_dialog } = useSelector((state) => state.audioCall);
  const user_id = window.localStorage.getItem("user_id");


  // useEffect(() => {
  //   dispatch(FetchUserProfile());
  // }, []);
  const handleCloseAudioDialog = () => {
    dispatch(UpdateAudioCallDialog({ state: false }));
    dispatch(ResetAudioCallQueue());
  };

  // const handleCloseVideoDialog = () => {
  //   dispatch(UpdateVideoCallDialog({ state: false }));
  // };
  useEffect(() => {
    if (isLoggedIn) {
      if (!window.location.hash) {
        window.location.hash = "loaded";
        window.location.reload();
      } else {
        if (!socket) {
          connectSocket(user_id);
        }
        socket.on("new-friend-request", (data) => {
          dispatch(ShowSnackbar({ severity: "success", message: data.message }));
        });
        socket.on("request_accepted", (data) => {
          dispatch(ShowSnackbar({ severity: "success", message: data.message }));
        });
        socket.on("request_sent", (data) => {
          dispatch(ShowSnackbar({ severity: "success", message: data.message }));
        });
        socket.on("start_chat", (data) => {
          console.log(data);

          // Ensure data is valid
          if (!data || !data._id || !data.participants) {
            return console.error("Invalid conversation data:", data);
          }

          const existing_conversation = conversations.find((el) => el.id === data._id);
          if (existing_conversation) {
            dispatch(UpdateDirectConversations({ conversation: data }));
          } else {
            dispatch(AddDirectConversations({ conversation: data }));
          }
          dispatch(selectConverstion({ room_id: data._id }));
        });

        socket.on("audio_call_notification", (data) => {
          // TODO => dispatch an action to add this in call_queue
          dispatch(PushAudioCallQueue(data));
        });

        // socket.on("video_call_notification", (data) => {
        //   // TODO => dispatch an action to add this in call_queue
        //   dispatch(PushToVideoCallQueue(data));
        // });

        socket.on("new_message", (data) => {
          const message = data.message;

          // Check if message belongs to the currently selected conversation
          if (current_conversation?.id === data.conversation_id) {
            dispatch(
              AddDirectMessage({
                id: message._id,
                type: message.type,
                message: message.text,
                incoming: message.to === user_id,
                outgoing: message.from === user_id,
              }),
              dispatch(FetchtConversations())
            );
          }
        });
      }
    }
    return () => {
      if (socket) {
        socket.off("new-friend-request");
        socket.off("request_accepted");
        socket.off("request_sent");
        socket.off("start_chat");
        socket?.off("new_message");
        socket?.off("audio_call_notification");
      }
    };
  }, [isLoggedIn, dispatch, conversations, user_id]);

  if (!isLoggedIn) {
    return <Navigate to="auth/login" />;
  }

  return (
    <>
      <Stack direction={"row"}>
        {isDesktop && (
          // SideBar
          <Sidebar />
        )}
        <Outlet />
      </Stack>
      {open_audio_notification_dialog && (
        <AudioCallNotification open={open_audio_notification_dialog}    />
      )}
      {open_audio_dialog && (
        <AudioCallDialog
          open={open_audio_dialog}
          handleClose={handleCloseAudioDialog}
        />
      )}
    </>
  );

};

export default DashboardLayout;
