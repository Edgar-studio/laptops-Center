import React, { useState } from "react";
import { Info, Users, Code, Mail, CheckCircle, AlertCircle, Sparkles, Target, Zap } from "lucide-react";
import emailjs from "@emailjs/browser";

const About = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.message.trim()) newErrors.message = "Message is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSending(true);
        setStatus({ type: "", message: "" });

        try {
            await emailjs.send(
                "service_sg5aq58",
                "template_4egenw5",
                formData,
                "RhbadcT3Vuv-us1Oj"
            );
            setStatus({ type: "success", message: "Message sent successfully! We'll get back to you soon." });
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Email sending error:", error);
            setStatus({ type: "error", message: "Failed to send message. Please try again." });
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    const features = [
        {
            icon: <Target size={24} />,
            title: "Our Mission",
            description: "Empowering administrators with intuitive tools for seamless content and user management.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Code size={24} />,
            title: "Technology Stack",
            description: "Built with React, Tailwind CSS, Redux, and modern web development best practices.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <Zap size={24} />,
            title: "Performance",
            description: "Optimized for speed and efficiency with lightning-fast load times and smooth interactions.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: <Users size={24} />,
            title: "User-Centric",
            description: "Designed with administrators in mind, focusing on usability and productivity.",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: <Sparkles size={24} />,
            title: "Modern Design",
            description: "Clean, responsive interface that adapts beautifully to any screen size.",
            gradient: "from-yellow-500 to-amber-500"
        },
        {
            icon: <Info size={24} />,
            title: "Comprehensive",
            description: "All the tools you need in one place for complete administrative control.",
            gradient: "from-indigo-500 to-blue-500"
        }
    ];

    return (
        <div className="min-h-screen p-6 text-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-4 animate-fade-in">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Info size={28} />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        About Us
                    </h1>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-3xl">
                    Welcome to the Admin Dashboard—your central hub for managing content, tracking activity,
                    and streamlining administrative workflows. Built with cutting-edge technologies and
                    designed for efficiency, our platform empowers you to work smarter, not harder.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-500 transition-all">
                                {feature.title}
                            </h2>
                            <p className="text-yellow-200 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 max-w-2xl mx-auto shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                            <Mail size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Get In Touch</h2>
                    </div>

                    <p className="text-gray-400 mb-6">
                        Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>

                    <div className="flex flex-col gap-5">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Your Name"
                                className={`w-full p-4 rounded-xl border ${
                                    errors.name ? "border-red-500" : "border-gray-600"
                                } bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Your Email"
                                className={`w-full p-4 rounded-xl border ${
                                    errors.email ? "border-red-500" : "border-gray-600"
                                } bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Your Message"
                                className={`w-full p-4 rounded-xl border ${
                                    errors.message ? "border-red-500" : "border-gray-600"
                                } bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                rows={5}
                            />
                            {errors.message && (
                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.message}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={sending}
                            className={`py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                                sending
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
                            }`}
                        >
                            {sending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                "Send Message"
                            )}
                        </button>

                        {status.message && (
                            <div
                                className={`p-4 rounded-xl flex items-start gap-3 ${
                                    status.type === "success"
                                        ? "bg-green-500/10 border border-green-500/30"
                                        : "bg-red-500/10 border border-red-500/30"
                                }`}
                            >
                                {status.type === "success" ? (
                                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                                )}
                                <p className={status.type === "success" ? "text-green-400" : "text-red-400"}>
                                    {status.message}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-500 text-xs mt-4 text-center">
                        Tip: Press Ctrl+Enter to send
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default About;