import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import axiousInstance  from "../../utils/axios";

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};

const user_id = window.localStorage.getItem('user_id');

function formatTime(date) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
    return date.toLocaleTimeString([], options); 
  }else if(date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()){
    return "yesterday";
  }else {
    return date.toLocaleDateString();
  }
}

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchDirectConversations(state, action) {
      const conversations = action.payload.conversations || [];
      const list = conversations.map((el) => {
        const this_user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );

        const latestMessage = el.messages.length > 0 ? el.messages[el.messages.length - 1] : null;
        const msg = latestMessage ? latestMessage.text : '';
        const time = latestMessage ? formatTime(new Date(latestMessage.created_at)) : '';

        return {
          id: el._id,
          user_id: this_user._id,
          name: `${this_user.firstname} ${this_user.lastname}`,
          online: this_user.status === 'Online',
          img: faker.image.avatar(),
          msg,
          time,
          unread: 0,
          pinned: false,
        };
      });
      state.direct_chat.conversations = list;
      console.log(list);
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      if (!this_conversation || !this_conversation.participants) {
        console.error("Invalid conversation data:", this_conversation);
        return;
      }
      state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
        if (el.id !== this_conversation._id) {
          return el;
        } else {
          const user = this_conversation.participants.find(
            (elm) => elm._id.toString() !== user_id
          );
          const latestMessage = this_conversation .messages.length > 0 ? this_conversation .messages[this_conversation .messages.length - 1] : null;
          const msg = latestMessage ? latestMessage.text : '';
          const time = latestMessage ? formatTime(new Date(latestMessage.created_at)) : '';

          return {
            id: this_conversation._id,
            user_id: user._id,
            name: `${user.firstname} ${user.lastname}`,
            online: user.status === "Online",
            img: faker.image.avatar(),
            msg,
            time,
            unread: 0,
            pinned: false,
          };
        }
      });
    },
    addDirectConversations(state, action) {
      const this_conversation = action.payload.conversation;
      if (!this_conversation || !this_conversation.participants) {
        console.error("Invalid conversation data:", this_conversation);
        return;
      }
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );

      const latestMessage = this_conversation.messages.length> 0 ? this_conversation.messages[this_conversation.messages.length - 1] : null;
      const msg = latestMessage ? latestMessage.text : '';
      const time = latestMessage ? formatTime(new Date(latestMessage.created_at)) : '';

      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        online: user.status === "Online",
        img: faker.image.avatar(),
        msg,
        time,
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload.current_conversation;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      console.log('Received messages:', messages);
      const formatted_messages = messages.map((el) => {
        return {
          id: el._id,
          type: el.type,
          message: el.text,
          incoming: el.to === user_id,
          outgoing: el.from === user_id,
        };
      });
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
    clearState() {
     return initialState;
    //  state.direct_chat.conversations = [...state.direct_chat.conversations];
    },
  },
});


export default slice.reducer;

export const {clearState}=slice.actions;

export const FetchtConversations = () => async (dispatch, getState) => {
  try {
    const response = await axiousInstance.get(`conversation/users/${user_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    console.log("Fetched conversations from server:", response.data);
    dispatch(slice.actions.fetchDirectConversations({ conversations: response.data }));
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
}

export const AddDirectConversations = ({ conversation }) => {
  return async (dispatch) => {
    dispatch(slice.actions.addDirectConversations({ conversation }));
  };
};

export const UpdateDirectConversations = ({ conversation }) => {
  return async (dispatch) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch) => {
    dispatch(slice.actions.setCurrentConversation({ current_conversation }));
  };
};

export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  };
};
