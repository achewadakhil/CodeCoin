export default function Footer() {
  const cards = [
    {
      title: "LinkedIn",
      link: "https://www.linkedin.com/in/akhil-achewad-0a4832291/",
      desc: "Connect with me professionally and explore my experiences.",
    },
    {
      title: "GitHub",
      link: "https://github.com/achewadakhil",
      desc: "Check out my open-source work and personal projects.",
    },
    {
      title: "Personal Web3 wallet",
      link: "https://github.com/achewadakhil/personalWallet",
      desc: "A secure and intuitive Web3 wallet that lets you manage crypto assets effortlessly. Supports multiple blockchains and provides easy access to send, receive, and store tokens safely.",
    },
    {
      title: "DevSync",
      link: "https://github.com/achewadakhil/codingAssistant",
      desc: "A collaborative platform that streamlines development workflows. Sync code, track tasks, and share updates with your team efficiently in real-time.",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-700 pt-10 pb-8 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-8 tracking-wide">
          CodeCoin
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, idx) => (
            <a
              key={idx}
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 
                         hover:bg-white hover:text-gray-900 shadow-sm 
                         hover:shadow-md hover:-translate-y-1 
                         transition-all duration-200 text-left"
            >
              <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
              <p className="text-sm">{card.desc}</p>
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-10">
          © {new Date().getFullYear()} CodeCoin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
