import React from "react";
import { Clock } from "lucide-react";

const HistoryItem = ({ title, thumbnail, watchedAt }) => (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
        <img
            src={thumbnail}
            alt={title}
            className="w-32 h-20 object-cover rounded-lg"
        />
        <div className="flex flex-col">
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-gray-400 text-sm">Watched: {watchedAt}</p>
        </div>
    </div>
);

const History = () => {
    const historyData = [
        {
            title: "React Tutorial for Beginners",
            thumbnail: "https://via.placeholder.com/300x200",
            watchedAt: "2 hours ago",
        },
        {
            title: "How Roblox Works Internally",
            thumbnail: "https://via.placeholder.com/300x200",
            watchedAt: "Yesterday",
        },
        {
            title: "Top 10 Programming Languages 2025",
            thumbnail: "https://via.placeholder.com/300x200",
            watchedAt: "2 days ago",
        },
    ];

    return (
        <div className="p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
                <Clock size={28} />
                <h1 className="text-2xl font-bold">History</h1>
            </div>

            <div className="flex flex-col gap-4">
                {historyData.map((item, index) => (
                    <HistoryItem
                        key={index}
                        title={item.title}
                        thumbnail={item.thumbnail}
                        watchedAt={item.watchedAt}
                    />
                ))}
            </div>
        </div>
    );
};

export default History;
