import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { NormalInput } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  fetchFriendsList,
  fetchPendingRequests,
  respondToRequest,
  searchUsers,
  clearSearchResults,
  sendFriendRequest,
} from '@/redux/reducers/friendSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  userId: string | undefined;
}

const FriendList = ({ userId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    friends,
    pending,
    searchResults,
    loading,
    recReqIds,
    reqIds,
    resIds,
    error,
  } = useSelector((state: RootState) => state.friends);

  const [query, setQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFriendsList(userId));
      dispatch(fetchPendingRequests(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (query.trim() === '') {
      dispatch(clearSearchResults()); // clear when query is empty
    }
  }, [query, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') return; // prevent empty search
    dispatch(searchUsers({ query, userId }));
    setHasSearched(true);
  };

  const handleSendRequest = (receiverId: string) => {
    dispatch(sendFriendRequest({ senderId: userId, receiverId }));
  };

  const handleRespond = (
    requestId: string,
    action: 'accepted' | 'rejected'
  ) => {
    dispatch(respondToRequest({ requestId, action }));
  };

  return (
    <>
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            dispatch(clearSearchResults());
            setQuery('');
            setHasSearched(false);
          }
        }}
      >
        <SheetTrigger className="m-auto">
          <Icon icon="mdi:people-group-outline" width={25} />
        </SheetTrigger>
        <SheetContent className="bg-gray-100/50 dark:bg-gray-900/50  backdrop-filter backdrop-blur-sm">
          <div className="space-y-6 mt-10">
            <form onSubmit={handleSearch} className="flex gap-2">
              <NormalInput
                className="border px-2 py-1 rounded-lg"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-600 text-white p-2 rounded-lg"
              >
                <Icon icon="flowbite:search-outline" width={25} />
              </button>
            </form>

            {hasSearched && (
              <>
                <h2 className="font-semibold">Search Results</h2>

                {loading ? (
                  <>loading...</>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        className="flex justify-between items-center p-2"
                      >
                        <div className="flex align-center gap-3">
                          <Avatar className="md:h-8 md:w-8 h-6 w-6">
                            {user?.photo_url ? (
                              <AvatarImage
                                src={user.photo_url}
                                alt="User Picture"
                              />
                            ) : (
                              <Icon
                                icon="solar:user-circle-outline"
                                width={25}
                              />
                            )}
                          </Avatar>
                          <span>{user.username}</span>
                        </div>

                        {user.isFriend ? (
                          <span className="text-green-600 font-medium">
                            Friend
                          </span>
                        ) : user.isRequested || recReqIds.includes(user.id) ? (
                          <motion.button
                            disabled
                            key="requested"
                            className="bg-gray-300 px-3 py-1 rounded-lg cursor-not-allowed"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon
                              icon="mdi:check-circle-outline"
                              className="text-green-500"
                              width={25}
                            />
                          </motion.button>
                        ) : (
                          <motion.button
                            key="add"
                            onClick={() => handleSendRequest(user.id)}
                            className="bg-green-500/30 text-white px-3 py-1 rounded-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {reqIds.includes(user.id) ? (
                              <Icon
                                icon="eos-icons:loading"
                                className="animate-spin"
                                width={20}
                              />
                            ) : (
                              <Icon
                                icon="cuida:user-add-outline"
                                className="text-green-500"
                                width={25}
                              />
                            )}
                          </motion.button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">User Not Found</p>
                )}
              </>
            )}

            <div>
              <h2 className="font-semibold">Friends</h2>
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li key={friend.id} className="p-2">
                    <div className="flex align-center gap-3">
                      <Avatar className="md:h-8 md:w-8 h-6 w-6">
                        {friend?.photo_url ? (
                          <AvatarImage
                            src={friend?.photo_url}
                            alt="User Picture"
                          />
                        ) : (
                          <Icon icon="solar:user-circle-outline" width={35} />
                        )}
                      </Avatar>
                      <Link href={`/friend/${friend.id}`}>
                        <span className="cursor-pointer ">
                          {friend.username}
                        </span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {pending.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Friend Requests</h2>
                <ul className="space-y-2">
                  {pending.map((req) => (
                    <li
                      key={req.id}
                      className="flex justify-between items-center p-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="md:h-8 md:w-8 h-6 w-6">
                          {req.sender?.photo_url ? (
                            <AvatarImage
                              src={req.sender?.photo_url}
                              alt="User Picture"
                            />
                          ) : (
                            <Icon icon="solar:user-circle-outline" width={35} />
                          )}
                        </Avatar>
                        <span>{req.sender?.username}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500/20 text-green-500 px-3 font-bold py-1 rounded"
                          onClick={() =>
                            dispatch(
                              respondToRequest({
                                requestId: req.id,
                                action: 'accepted',
                              })
                            )
                          }
                          disabled={resIds.includes(req.id)}
                        >
                          {resIds.includes(req.id) ? (
                            <Icon
                              icon="eos-icons:loading"
                              className="animate-spin"
                              width={20}
                            />
                          ) : (
                            'Accept'
                          )}
                        </button>
                        <button
                          className="bg-red-500/20 text-red-500 px-3 font-bold py-1 rounded"
                          onClick={() =>
                            dispatch(
                              respondToRequest({
                                requestId: req.id,
                                action: 'rejected',
                              })
                            )
                          }
                          disabled={resIds.includes(req.id)}
                        >
                          {resIds.includes(req.id) ? (
                            <Icon
                              icon="eos-icons:loading"
                              className="animate-spin"
                              width={20}
                            />
                          ) : (
                            'Reject'
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FriendList;
