import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-grazgas-dark text-white pt-10 pb-12 px-4 flex flex-col items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="GrazGas Logo" width={24} height={24} className="mb-2 invert" />
          <span className="font-bold text-base md:text-xl mb-2">GrazGas</span>
        </div>

          <span className="text-xs text-grazgas-blue font-bold">Contact Us:</span>
          <a href="mailto:hello@grazgas.com" className="text-sm mb-4 hover:underline">hello@grazgas.com</a> 
      </div>
      <div className="flex flex-wrap justify-center gap-8 mb-6 mt-2 text-xs">
        <Link href="/" className="hover:underline">Gas Network</Link>
        <Link href="https://github.com/oladetoungee/grazgas" target="_blank" rel="noopener noreferrer" className="hover:underline">
        GitHub Repo</Link>
        <Link href="https://www.infura.io/" target="_blank" rel="noopener noreferrer" className="hover:underline">API Sources</Link>
        <Link href="/telegram-bot" className="hover:underline">Telegram Bot</Link>
        <Link href="https://discord.gg/Urj6n7Aj" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</Link>
      </div>
      <hr className="w-full max-w-2xl border-t border-gray-700 mb-4" />
      <div className="text-xs text-gray-400 text-center w-full">© 2025 GrazGas. All rights reserved.</div>
    </footer>
  );
}

export default Footer; 