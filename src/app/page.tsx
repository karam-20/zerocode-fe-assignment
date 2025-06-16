import React from 'react'
import Chat from './components/Chat';


const Home = () => {



    return (
        <div>
            <main className="flex-1 p-4">
                <h2 className="text-xl font-bold mb-4">Welcome to the Chatbot App 🎉</h2>
                <p>This is your homepage content.</p>
            </main>

            <div className="fixed bottom-4 right-4 w-[95%] max-w-sm z-50">
                <Chat />
            </div>
        </div>
    )
}

export default Home
