import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { ShowSnackbar } from "./app";
import { clearState as clearConversations } from "./converstion";


const initialState = {
    isLoggedIn: false,
    token: "",
    isLoading: false,
    email: "",
    error: false,
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
        },
        SignOut(state, action) {
            state.isLoggedIn = false;
            state.token = "";
        },
        updateRegisterEmail(state, action) {
            state.email = action.payload.email;
        }
    }
})

//Reducer
export default slice.reducer;

//Login
export function LoginUser(formValues) {
    // fromValues=>{email,password}
    return async (dispatch, getState) => {
        await axios.post("/auth/login", {
            ...formValues,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        }
        ).then(function (response) {
            console.log(response);
            dispatch(slice.actions.logIn({
                isLoggedIn: true,
                token: response.data.token,
            }));

            window.localStorage.setItem("user_id",response.data.user_id);
            dispatch(ShowSnackbar({severity:"success",message:response.data.message}))
        }).catch(function (error) {
            console.log(error);
            dispatch(ShowSnackbar({severity:"error",message:error.message}));
        })
    }
}

export function LogoutUser() {
    return async (dispatch, getState) => {
        window.localStorage.removeItem("user_id");
        dispatch(slice.actions.SignOut());
        dispatch(clearConversations());
    }
}

export function ForgotPassword(formValues) {
    return async (dispatch, getState) => {
        await axios.post("auth/forgot-password", {
            ...formValues
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    }
}

export function NewPassword(formValues, token) {
    return async (dispatch, getState) => {
        await axios.post(`auth/reset-password/${token}`, {
            ...formValues
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.logIn({
                isLoggedIn: true,
                token: response.data.token,
            })
            );
        }).catch((error) => {
            console.log(error);
        })
    }
}

export function RegisterUser(formValues,navigate) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
        await axios.post("auth/register", {
            ...formValues
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.updateRegisterEmail({
                email: formValues.email
            }));
            dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
        }).catch((error) => {
            console.log(error);
            dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
        }).finally(() => {
            if (!getState().auth.error) {
                navigate("/auth/verify");
            }
        })
    }
};


export function VerifyEmail(formValues) {
    return async (dispatch, getState) => {
        await axios.post(`auth/verify`, {
            ...formValues
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
            dispatch(slice.actions.logIn({
                isLoggedIn: true,
                token: response.data.token
            }))
            window.localStorage.setItem("user_id",response.data.user_id);
        }).catch((error) => {
            console.log(error);
        })
    }
}
