import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import{v4} from 'uuid'
import S3 from "../../utils/s3";
import { S3_BUCKET_NAME } from "../../config";

const initialState = {
  user: {},
  sidebar: {
    open: false,
    type: "CONTACT" // can be CONTACT, STARRED, SHARED
  },
  snackbar: {
    open: false,
    message: null,
    severity: null,
  },
  users: [],
  all_users:[],
  friends: [],
  friendRequests: [],
  senderfriendRequest:[],
  chat_type:null,
  room_id:null,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Toggle Sidebar
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateAllUsers(state,action){
      state.all_users=action.payload.all_users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests =action.payload.friendRequests;
    },
    updateSenderFriendRequests(state, action) {
      state.senderfriendRequest =action.payload.senderfriendRequest;
    },
    selectConverstion(state,action){
      state.chat_type="individual";
      state.room_id=action.payload.room_id
    },
    updateUser(state, action) {
      state.user = action.payload.user;
    },
    fetchUser(state, action) {
      state.user = action.payload.user;
    },
  }
});

export default slice.reducer;

//
export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebar());
  }
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSidebarType({
      type,
    }));
  }
}

export function ShowSnackbar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackbar({
        message, severity
      })
    );
    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar());
    }, 4000);
  }
}

export const closeSnackbar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackbar());
}

export const FetchUsers = () => {
  return async (dispatch, getState) => {
    await axios.get("/user/get-users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`
      },
    }).then((response) => {
      console.log(response);
      dispatch(slice.actions.updateUsers({
        users: response.data.data
      }));
    }).catch((error) => {
      console.log(error);
    });
  }
}
export function FetchAllUsers() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-all-verified-users",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
export const FetchFriends = () => {
  return async (dispatch, getState) => {
    await axios.get("/user/get-friends", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`
      },
    }).then((response) => {
      console.log(response);
      dispatch(slice.actions.updateFriends({
        friends: response.data.data
      }));
    }).catch((error) => {
      console.log(error);
    });
  }
}

export const FetchFriendRequests = () => {
  return async (dispatch, getState) => {
      try {
          const response = await axios.get("/user/get-friend-request", {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getState().auth.token}`
              },
          });
          console.log("Fetched friend requests from server:", response.data.data);
          dispatch(slice.actions.updateFriendRequests({
              friendRequests: response.data.data
          }));
      } catch (error) {
          console.log(error);
      }
  }
};
export const FetchSenderRequests = () => {
  return async (dispatch, getState) => {
      try {
          const response = await axios.get("/user/get--sender-friend-request", {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getState().auth.token}`
              },
          });
          console.log("Fetched friend requests from server:", response.data.data);
          dispatch(slice.actions.updateSenderFriendRequests({
            senderfriendRequest: response.data.data
          }));
      } catch (error) {
          console.log(error);
      }
  }
}

export const FetchUserProfile = () => {
  return async (dispatch, getState) => {
    axios.get("/user/get-me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.fetchUser({ user: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
export const UpdateUserProfile = (formValues) => {
  return async (dispatch, getState) => {
    const file = formValues.avatar;
    const key=v4();
    try{
      S3.getSignedUrl(
        "putObject",
        {Bucket:S3_BUCKET_NAME,Key:key,ContentType:`image/${file.type}`},
        async (_err, presignedURL) => {
          await fetch(presignedURL, {
            method: "PUT",
  
            body: file,
  
            headers: {
              "Content-Type": file.type,
            },
          });
        }
      );
    }catch(error) {
        console.log(error);
    }
    axios.put(
        "/user/update-me",
        { ...formValues},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateUser({ user: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
export const selectConverstion=({room_id})=>{
  return(dispatch,getState)=>{
    dispatch(slice.actions.selectConverstion({room_id}));
  }
}
