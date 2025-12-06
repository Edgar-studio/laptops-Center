import React from "react";
import { Clock, Trash2, Search } from "lucide-react";

const HistoryItem = ({ title, thumbnail, watchedAt, onRemove }) => (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-800/50 hover:from-gray-700 hover:to-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:shadow-lg">
        <div className="relative flex-shrink-0">
            <img
                src={thumbnail}
                alt={title}
                className="w-40 h-24 object-cover rounded-lg shadow-md"
            />
        </div>
        <div className="flex-1 flex flex-col gap-1">
            <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-gray-400 text-sm flex items-center gap-2">
                <Clock size={14} />
                {watchedAt}
            </p>
        </div>
        <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400"
            title="Remove from history"
        >
            <Trash2 size={20} />
        </button>
    </div>
);

const History = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [historyData, setHistoryData] = React.useState([
        {
            id: 1,
            title: "React Tutorial for Beginners",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            watchedAt: "2 hours ago"
        },
        {
            id: 2,
            title: "How Roblox Works Internally",
            thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=250&fit=crop",
            watchedAt: "Yesterday"
        },
        {
            id: 3,
            title: "Top 10 Programming Languages 2025",
            thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop",
            watchedAt: "2 days ago"
        },
        {
            id: 4,
            title: "Web Development Complete Course",
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
            watchedAt: "3 days ago"
        },
        {
            id: 5,
            title: "Understanding JavaScript Closures",
            thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop",
            watchedAt: "1 week ago"
        },
        {
            id: 6,
            title: "CSS Grid vs Flexbox - Complete Guide",
            thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop",
            watchedAt: "1 week ago"
        }
    ]);

    const handleRemove = (id) => {
        setHistoryData(historyData.filter(item => item.id !== id));
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all history?")) {
            setHistoryData([]);
        }
    };

    const filteredHistory = historyData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 text-white">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                            <Clock size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                History
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {historyData.length} items viewed
                            </p>
                        </div>
                    </div>
                </div>

                {historyData.length > 0 && (
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => (
                            <HistoryItem
                                key={item.id}
                                title={item.title}
                                thumbnail={item.thumbnail}
                                watchedAt={item.watchedAt}
                            />
                        ))
                    ) : historyData.length > 0 ? (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg">Your watch history is empty</p>
                            <p className="text-gray-500 text-sm mt-2">Items you view will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;