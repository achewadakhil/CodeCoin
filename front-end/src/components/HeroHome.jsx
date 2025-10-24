

export default function HeroHome(){
    return <div className="relative w-full min-h-screen overflow-hidden">
        <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
        >
            <source src="/videos/hero-video-3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
         {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black opacity-30 pointer-events-none"></div> */}
       <div className="absolute inset-0 flex justify-center items-start pt-40 text-center z-10 cursor-default">
            <div className="flex items-center justify-center flex-col">
                <h1 className="text-white text-5xl font-bold">
                    Welcome to CodeCoin
                </h1>
                <p className="text-white text-2xl md:text-3xl font-medium">
                    Learn · Code · Grow
                </p>
                <div className="flex space-x-6 mt-6">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                        Learn
                    </button>
                    <button className="bg-white text-blue-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                        Start
                    </button>
                </div>
            </div>
      </div>

    </div>
}