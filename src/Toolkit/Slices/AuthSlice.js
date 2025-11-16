import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api.js";
import {notify} from "../../Components/UI/notify.jsx";

export const fetchUsers = createAsyncThunk("auth/fetchUsers",
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)


export const registerUser = createAsyncThunk("auth/registerUser",
    async ({username, email, password}, {dispatch, getState, rejectWithValue}) => {
        await dispatch(fetchUsers());
        const state = getState();
        const oldUsers = state.auth.users;

        const findUser = oldUsers.find(user => user.username === username || user.email === email);

        if (!findUser) {
            try {
                const response = await api.post('/users', {username, email, password});
                return response.data;
            } catch (err) {
                return rejectWithValue(err.message);
            }
        } else {
            notify("User already exists", 'red');
        }

    }
)


export const loginUser = createAsyncThunk("auth/loginUser",
    async ({email, password}, {dispatch, getState, rejectWithValue}) => {
        await dispatch(fetchUsers());
        const state = getState();
        const oldUsers = state.auth.users;
        const findUser = oldUsers.find(user => user.email === email && user.password === password);
        if (findUser) {
            localStorage.setItem("token", findUser.username)
            window.location.reload()
        } else {
            notify("User is not found", "red");
        }
    }
)

export const deleteUser = createAsyncThunk("auth/deleteUser",
    async (id, {rejectWithValue}) => {
        try {

        const response = await api.patch(`users/${id}`, {deleted: true});
        return response.data;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)
export const returnUser = createAsyncThunk("auth/returnUser",
  async (id, {rejectWithValue}) => {
    try {

  const response = await api.patch(`users/${id}`, {deleted: false});
  return response.data;
    }catch (e) {
       return rejectWithValue(e.message);
    }
})

export const blockUser = createAsyncThunk("auth/blockUser",
  async ({id, blocked}, {rejectWithValue}) => {
    try {
        const response = await api.patch(`users/${id}`, {blocked: !blocked});
        return response.data;
    }catch (e) {
        return rejectWithValue(e.message);
    }
  }
)




const authSlice = createSlice({
    name: "auth",
    initialState: {
        deletedUsers: [],
        users: [],
        loading: false,
        error: null
    },
    reducers: {
        logout: () => {
            localStorage.removeItem("token");
            window.location.reload();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.filter(user => !user.deleted);
                state.deletedUsers = action.payload.filter(user => user.deleted);
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload.id);
                state.deletedUsers.push(action.payload);
            })
            .addCase(returnUser.fulfilled, (state, action) => {
                state.deletedUsers = state.deletedUsers.filter(user => user.id !== action.payload.id);
                state.users.push(action.payload);
            })

            .addCase(blockUser.fulfilled, (state, action) => {
                state.users = state.users.map(user => user.id === action.payload.id ? action.payload : user);


            })

    },
})

export const {logout} = authSlice.actions;
export default authSlice.reducer;