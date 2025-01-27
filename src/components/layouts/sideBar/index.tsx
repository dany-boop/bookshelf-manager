'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@iconify/react';

interface SidebarProps {
  onToggleSidebar?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  //   const [menu, setMenu] = useState<MenuItem[]>([]);

  // const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableViewport = sidebarRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]'
      );

      if (scrollableViewport) {
        const currentScrollTop = (scrollableViewport as HTMLElement).scrollTop;

        if (currentScrollTop > 0) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    const scrollableViewport = sidebarRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );

    if (scrollableViewport) {
      scrollableViewport.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableViewport) {
        scrollableViewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const [isOpen, setIsOpen] = useState<boolean>(true);

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
    <nav className="w-full overflow-hidden">
      <div className="flex justify-between items-center bg-[--bg-color] text-[--text-color] p-4 ps-2 pb-3  transition-all duration-500  top-0  z-50">
        <div className="flex align-middle">
          {/* <Link href={'/'}>
            <div className={`flex  justify-between gap-5 align-middle `}>
              <div className="">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="Login Image"
                  width={28}
                  height={28}
                  objectFit="cover"
                  loading="lazy"
                />
              </div>
              {isOpen && (
                <h1 className="text-xl mt-1 font-extrabold text-[--text-color] transition-all duration-300">
                  JSy Dashboard
                </h1>
              )}
            </div>
          </Link> */}

          <div
            className={`fixed  z-50 transition-all duration-300 ${
              isOpen ? 'md:ml-[16em] ml-[14em]' : 'ml-[2.5em]'
            } `}
          >
            <button
              onClick={handleToggleSidebar}
              className="text-2xl   rounded-full bg-white backdrop-filter backdrop-blur-xl  p-1 shadow-md "
            >
              <motion.div
                variants={arrowVariants} // Use the defined animation variants
                initial="closed"
                animate={isOpen ? 'open' : 'closed'} // Switch between open/closed animations
                transition={{ duration: 0.5, ease: 'easeInOut' }} // Controls the animation speed
              >
                <Icon
                  icon="solar:round-alt-arrow-right-line-duotone"
                  width={25}
                  className=" transition-opacity duration-300 text-black"
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Gradient Overlay */}
        {isScrolled && (
          <div
            className={`absolute top-0 left-0 w-full h-20 bg-gradient-to-t from-transparent from-20% to-[--bg-color] to-90% z-10 transition-opacity duration-300`}
          ></div>
        )}
        <ScrollArea
          ref={sidebarRef}
          className={`h-screen ease-in transform duration-200 backdrop-filter w-full backdrop-blur-md bg-[--bg-color] py-3 m md:min-w-48 pb-20 max-h-screen overflow-y-auto overflow-x-hidden scroll
           md:relative transition-transform`}
        >
          {/* <Menu
            menu={menus}
            isSidebarOpen={isOpen}
            toggleSidebar={handleToggleSidebar}
          /> */}
        </ScrollArea>
      </div>
    </nav>
  );
};

export default Sidebar;
