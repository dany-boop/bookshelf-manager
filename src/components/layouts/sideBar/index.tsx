'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { menu } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  onToggleSidebar?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Use useEffect to load the state from localStorage on the client side
  useEffect(() => {
    const storedValue = localStorage.getItem('isSidebarOpen');
    if (storedValue !== null) {
      setIsOpen(JSON.parse(storedValue));
    }
  }, []);

  const handleToggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    localStorage.setItem('isSidebarOpen', JSON.stringify(newIsOpen));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('sidebarToggle'));

    // Call the parent component's toggle handler if needed
    if (onToggleSidebar) onToggleSidebar(newIsOpen);
  };

  const arrowVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <nav className="w-full overflow-hidden border border-1 ">
      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 p-4 ps-2 pb-3  transition-all duration-500  top-0  z-50">
        <div className="flex align-middle">
          <Link href={'/'}>
            <div className={`flex  justify-between gap-5 align-middle `}>
              <div className="">
                {/* <Image
                  src="/logo-removebg-preview.png"
                  alt="Login Image"
                  width={28}
                  height={28}
                  objectFit="cover"
                  loading="lazy"
                /> */}
              </div>
              {isOpen && (
                <h1 className="text-xl text-slate-900 dark:text-slate-100 mt-1 font-extrabold  transition-all duration-300">
                  Bookshelf
                </h1>
              )}
            </div>
          </Link>

          <div
            className={`fixed  z-50 transition-all duration-300 ${
              isOpen ? 'md:ml-[16.5em] ml-[14em]' : 'ml-[3em]'
            } `}
          >
            <button
              onClick={handleToggleSidebar}
              className="text-2xl rounded-full p-1 border bg-slate-100 dark:bg-slate-900"
            >
              <motion.div
                variants={arrowVariants} // Use the defined animation variants
                initial="closed"
                animate={isOpen ? 'open' : 'closed'} // Switch between open/closed animations
                transition={{ duration: 0.5, ease: 'easeInOut' }} // Controls the animation speed
              >
                <Icon
                  icon="solar:alt-arrow-right-outline"
                  width={20}
                  className=" transition-opacity duration-300 text-slate-400 "
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`h-screen  backdrop-filter backdrop-blur-md bg-gray-100 dark:bg-gray-900 py-3 pb-20 max-h-screen overflow-y-auto overflow-x-hidden scroll
           md:relative ${isOpen ? 'w-full md:min-w-48 ' : 'w-[4.4em]'}`}
      >
        <h1 className="mx-3 font-mono font-bold text-neutral-400 text-md my-2">
          Menu
        </h1>
        {menu.map((menu) => (
          <div className="mx-3 mb-5" key={menu.id}>
            <button
              className={`flex gap-3 py-2 px-2 w-full rounded-md font-medium ${
                pathname.includes(menu.url)
                  ? 'bg-green-600/10 text-green-500 font-semibold'
                  : 'text-neutral-400 hover:bg-stone-100/50 dark:hover:bg-zinc-800/50'
              }`}
              onClick={() => router.push(menu.url)}
            >
              <Icon icon={menu.icon} width={25} />
              {isOpen && <p className="flex justify-start ">{menu.name}</p>}
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
