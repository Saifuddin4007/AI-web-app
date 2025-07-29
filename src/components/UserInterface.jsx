import React, { useState } from 'react';
import { MdOutlineArrowUpward } from "react-icons/md";
import { url } from '../config/apiConfigure';
import ShowResponse from './ShowResponse';

const UserInterface = () => {
    const [qsnAsk, setQsnAsk] = useState("");
    const [getRes, setGetRes] = useState([]);
    const [loading, setLoading] = useState(false);

    const askQuestions = async () => {
        if (!qsnAsk.trim()) return;

        try {
            setLoading(true);
            const payLoad = {
                contents: [
                    {
                        parts: [
                            {
                                text: qsnAsk
                            }
                        ]
                    }
                ]
            };

            const res = await fetch(`${url}${import.meta.env.VITE_GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payLoad)
            });

            const response = await res.json();

            const strRes = response?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!strRes) {
                console.error("Invalid response:", response);
                setGetRes(["⚠️ Something went wrong. Please try again later."]);
                return;
            }

            const finalStrRes = strRes.split("* ").map(item => item.trim()).filter(Boolean);
            setGetRes(finalStrRes);
            console.log(finalStrRes)
            setQsnAsk("");
        } catch (err) {
            console.error("Failed to fetch:", err);
            setGetRes(["❌ Network or API Error. Try again."]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex overflow-hidden">

            {/* LEFT: Main area */}
            <div className="flex flex-col flex-1 relative bg-gray-50">

                {/* Response Scrollable Section */}
                <div className="flex-1 overflow-y-auto px-4 pb-32 ">
                    {getRes.length > 0 ? (
                        <ul className="space-y-2 pl-6">
                            {getRes.map((itm, ind) => (
                                <li key={ind} className='list-none'>
                                    <ShowResponse
                                        itm={itm}
                                        ind={ind}
                                        lengthCheck={typeof itm === 'string' ? itm.length : (itm?.content?.length || 0)}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className='text-gray-500 text-center'>Ask something to see results</div>
                    )}
                </div>

                {/* FIXED Input & Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center items-center gap-2 z-10">
                    <input
                        type="text"
                        value={qsnAsk}
                        placeholder='Ask me...'
                        className='w-[550px] bg-gray-100 rounded-2xl p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500'
                        onChange={(e) => setQsnAsk(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && askQuestions()}
                    />
                    <button
                        className='bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition'
                        onClick={askQuestions}
                        disabled={loading}
                    >
                        <MdOutlineArrowUpward size={24} />
                    </button>
                </div>
            </div>

            {/* RIGHT SIDEBAR - Fixed & No Scroll */}
            <div className="w-[300px] bg-zinc-800 text-white p-4 border-l border-gray-700 flex flex-col">
                <h2 className="text-lg font-bold mb-4">History</h2>
                <div className="text-sm text-gray-300">
                    No history yet
                </div>
            </div>
        </div>
    );
};

export default UserInterface;
