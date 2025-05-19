import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

type User = {
  id: string;
  username: string;
  photo_url: string | null;
  isFriend?: boolean;
  isRequested?: boolean;
};

type Friendship = {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  sender?: User;
  receiver?: User;
};

interface FriendsState {
  pending: Friendship[];
  friends: User[];
  searchResults: User[];
  reqIds: string[];
  resIds: string[];
  recReqIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  pending: [],
  friends: [],
  searchResults: [],
  reqIds: [],
  resIds: [],
  recReqIds: [],
  loading: false,
  error: null,
};

const ApiUrl = '/api/friend';

export const sendFriendRequest = createAsyncThunk(
  'friends/sendRequest',
  async (
    {
      senderId,
      receiverId,
    }: { senderId: string | undefined; receiverId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${ApiUrl}/request`, {
        senderId,
        receiverId,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to send request'
      );
    }
  }
);

// Respond to friend request
export const respondToRequest = createAsyncThunk(
  'friends/respond',
  async (
    {
      requestId,
      action,
    }: { requestId: string; action: 'accepted' | 'rejected' },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${ApiUrl}/respond`, {
        requestId,
        action,
      });
      return res.data as { message: string; newFriend: User };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to respond to request'
      );
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'friends/fetchPending',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ApiUrl}/respond?userId=${userId}`);
      return res.data as Friendship[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to fetch pending requests'
      );
    }
  }
);

export const fetchFriendsList = createAsyncThunk(
  'friends/fetchFriends',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ApiUrl}/list?userId=${userId}`);
      return res.data as User[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to fetch friends list'
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  'friends/searchUsers',
  async (
    { query, userId }: { query: string; userId: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `/api/user/search?query=${query}&userId=${userId}`
      );
      return res.data as User[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to search users'
      );
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearFriendsState: (state) => {
      state.pending = [];
      state.friends = [];
      state.searchResults = [];
      state.loading = false;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // sendFriendRequest
      .addCase(sendFriendRequest.pending, (state, action) => {
        const id = action.meta.arg.receiverId;
        state.reqIds.push(id);
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const id = action.meta.arg.receiverId;
        state.reqIds = state.reqIds.filter((i) => i !== id);
        state.recReqIds.push(id);
        // console.log('madame');

        toast.success(`Add success`);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        const id = action.meta.arg.receiverId;
        // state.reqIds = state.reqIds.filter((i) => i !== id);
        state.recReqIds.push(id);
        state.error = action.payload as string;
      })

      //  respondToRequest
      .addCase(respondToRequest.pending, (state, action) => {
        const id = action.meta.arg.requestId;
        state.recReqIds.push(id);
      })
      .addCase(respondToRequest.fulfilled, (state, action) => {
        const { requestId, action: responseAction } = action.meta.arg;
        const id = action.meta.arg.requestId;
        const newFriend = action.payload.newFriend;

        // Remove from pending
        state.pending = state.pending.filter((req) => req.id !== requestId);

        // If accepted, add to friends
        if (responseAction === 'accepted' && newFriend) {
          state.friends.push(newFriend);
          toast.success(`${newFriend.username} is now your friend!`);
        }
      })

      .addCase(respondToRequest.rejected, (state, action) => {
        const id = action.meta.arg.requestId;
        state.recReqIds.push(id);
        state.error = action.payload as string;
      })

      //  fetchPendingRequests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPendingRequests.fulfilled,
        (state, action: PayloadAction<Friendship[]>) => {
          state.loading = false;
          state.pending = action.payload;
        }
      )
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //  fetchFriendsList
      .addCase(fetchFriendsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFriendsList.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.friends = action.payload;
        }
      )
      .addCase(fetchFriendsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //  searchUsers
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.searchResults = action.payload;
        }
      )
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFriendsState, clearSearchResults } = friendsSlice.actions;
export default friendsSlice.reducer;
