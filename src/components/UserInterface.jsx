import React, { useState } from 'react';
import { MdOutlineArrowUpward } from "react-icons/md";
import { url } from '../config/apiConfigure';

const UserInterface = () => {
    const [qsnAsk, setQsnAsk] = useState();
    const [getRes, setGetRes]= useState();

    const askQuestions = async () => {
        try {
            let payLoad = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": qsnAsk
                            }
                        ]
                    }
                ]
            }
            let res = await fetch(url + import.meta.env.VITE_GEMINI_API_KEY, {
                method: "POST",
                body: JSON.stringify(payLoad)
            })
            let response= await res.json();
            console.log(response.candidates[0].content.parts[0].text)
            setGetRes(response.candidates[0].content.parts[0].text);
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className='grid grid-cols-5 h-screen'>
            <div className='col-span-4'>
                <div className='min-h-9/12'>
                    {getRes}
                </div>
                <div className='h-3/12 flex flex-row justify-center items-center w-full rounded-3xl '>
                    <input type="text" value={qsnAsk} placeholder='Ask Me' className='w-[550px] bg-gray-400 rounded-2xl p-3 border-none outline-none' onChange={(e) => setQsnAsk(e.target.value)} />
                    <button className=' bg-gray-700 p-3 rounded-full cursor-pointer' onClick={askQuestions} ><MdOutlineArrowUpward /></button>
                </div>
            </div>

            <div className='bg-zinc-500 text-center h-screen'>
                History
            </div>
        </div>
    )
}

export default UserInterface