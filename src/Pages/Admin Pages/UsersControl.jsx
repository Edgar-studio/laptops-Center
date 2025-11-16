import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { blockUser, deleteUser, fetchUsers, returnUser } from "../../Toolkit/Slices/AuthSlice.js";
import { FaTrash, FaUndo } from "react-icons/fa";
import { notify } from "../../Components/UI/notify.jsx";

const UsersControl = () => {
    const dispatch = useDispatch();
    const { users, loading, error, deletedUsers } = useSelector((s) => s.auth);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = async (id, username) => {
        if (username === "Admin") {
            notify("You cannot delete yourself!", "red");
            return;
        }
        await dispatch(deleteUser(id));
        notify("User deleted successfully", "red");
    };

    const handleBlock = async (user) => {
        await dispatch(blockUser({ id: user.id, blocked: user.blocked }));
        notify(user.blocked ? "User unblocked" : "User blocked", "blue");
    };

    const handleReturn = async (id) => {
        await dispatch(returnUser(id));
        notify("User returned successfully", "green");
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                Users Dashboard
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            )}

            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Registered Users ({users.length})
                </h2>

                {users.length === 0 && !loading ? (
                    <p className="text-gray-500 italic">No users registered yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {users.map((user) => (
                            <div key={user.id || user.username} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex gap-3">
                                        <h3 className="font-medium text-gray-800">{user.username}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="bg-red-500 hover:bg-red-900 disabled:bg-red-300 flex items-center gap-2 px-3 py-1 rounded"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                        <button
                                            onClick={() => handleBlock(user)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                        >
                                            {user.blocked ? "Unblock" : "Block"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {deletedUsers && deletedUsers.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Deleted Users</h2>
                        {deletedUsers.map((user) => (
                            <div key={user.id || user.username} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex gap-3">
                                        <h3 className="font-medium text-gray-800">{user.username}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <button
                                            onClick={() => handleReturn(user.id)}
                                            className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-2"
                                        >
                                            <FaUndo /> Return
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default UsersControl;
