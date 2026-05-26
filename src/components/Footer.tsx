"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (

        <footer className="bg-black border-t border-gray-800 py-8 px-4 mt-auto text-white">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">

                {/* Creator Branding */}
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-semibold">
                        Creator: <span className="text-blue-400">Midhun Murali</span>
                    </p>
                    <div className="flex gap-6">
                        <Link href="https://github.com/Mi-163" target="_blank" className="text-gray-400 hover:text-white transition">
                            <FaGithub size={22} />
                        </Link>
                        <Link href="https://linkedin.com/in/midhun-p-m-96551a291" target="_blank" className="text-gray-400 hover:text-blue-400 transition">
                            <FaLinkedin size={22} />
                        </Link>
                        <Link href="https://www.instagram.com/mpm_163?igsh=MjY4cndwOGQ3eXg2" target="_blank" className="text-gray-400 hover:text-pink-400 transition">
                            <FaInstagram size={22} />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-500 mt-2">
                    &copy; {new Date().getFullYear()} FindMyRoom. All rights reserved.
                </p>
            </div>
        </footer>
    );
}