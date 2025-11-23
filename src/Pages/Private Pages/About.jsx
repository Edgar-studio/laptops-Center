import React from "react";
import { Info, Users, Code } from "lucide-react";

const About = () => {
    return (
        <div className="p-6 text-white">

            <div className="flex items-center gap-3 mb-6">
                <Info size={28} />
                <h1 className="text-2xl font-bold">About</h1>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mb-10">
                Welcome to the Admin Dashboard!
                This dashboard helps you manage pages, track activity,
                and navigate easily using the sidebar.
                Built using <span className="text-white font-semibold">React</span> and
                <span className="text-white font-semibold"> Tailwind CSS</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-gray-800 p-5 rounded-xl shadow hover:bg-gray-700 transition">
                    <div className="flex items-center gap-3 mb-3">
                        <Users size={24} />
                        <h2 className="text-xl font-semibold">Our Team</h2>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Managed and developed with efficiency and clean UI design in mind.
                    </p>
                </div>

                <div className="bg-gray-800 p-5 rounded-xl shadow hover:bg-gray-700 transition">
                    <div className="flex items-center gap-3 mb-3">
                        <Code size={24} />
                        <h2 className="text-xl font-semibold">Technology</h2>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Built using React, Tailwind CSS, Redux, and modern web tools.
                    </p>
                </div>

                <div className="bg-gray-800 p-5 rounded-xl shadow hover:bg-gray-700 transition">
                    <div className="flex items-center gap-3 mb-3">
                        <Info size={24} />
                        <h2 className="text-xl font-semibold">Purpose</h2>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Designed to help administrators manage content and settings with ease.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
