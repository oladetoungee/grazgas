"use client";

import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/toogle";
import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 border-b-1.5 z-50 shadow bg-background">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon.svg" alt="GrazGas Logo" width={20} height={20} className="dark:invert"/>
        <span className="font-bold text-base text-grazgas-blue dark:text-white">GrazGas</span>
      </Link>
      <div className="hidden sm:flex items-center gap-16 flex-wrap">
        <nav className="flex items-center gap-6 text-xs md:text-sm">
          <Link href="/" className={`${pathname === '/' ? 'text-grazgas-blue' : 'text-foreground'} hover:underline`}>Dashboard</Link>
          <Link href="/about" className={`${pathname === '/about' ? 'text-grazgas-blue' : 'text-foreground'} hover:underline`}>About</Link>
          <Link href="/learning" className={`${pathname === '/learning' ? 'text-grazgas-blue' : 'text-foreground'} hover:underline`}>Learning</Link>
        </nav>
        <div className="flex-shrink-0">
          <ModeToggle />
        </div>
      </div>
      <button
        className="sm:hidden p-2 rounded"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4 text-blue dark:text-white" />
      </button>
      {menuOpen && (
        <div className="absolute top-16 right-4 z-50 bg-white dark:bg-grazgas-dark rounded shadow-lg flex flex-col items-start p-4 gap-4 sm:hidden min-w-[160px] text-xs md:text-sm">
          <Link href="/" className={`${pathname === '/' ? 'text-grazgas-blue' : 'text-foreground'} hover:underline w-full`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link href="/about" className={`${pathname === '/about' ? 'text-grazgas-blue' : 'text-foreground'} hover:underline w-full`} onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/learning" className={`${pathname === '/learning' ? 'text-grazgas-blue' : 'text-foreground'} hover:underline w-full`} onClick={() => setMenuOpen(false)}>Learning</Link>
          <div className="mt-2">
            <ModeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
