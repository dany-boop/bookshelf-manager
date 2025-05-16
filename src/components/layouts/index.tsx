'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import TopBar from './top-bar';
import Sidebar from './side-bar';

type Props = {
  children: React.ReactNode;
};

const MainLayout: FC<Props> = ({ children }) => {

  const mainContentRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Access localStorage in useEffect to avoid ReferenceError
  useEffect(() => {
    const storedValue = localStorage.getItem('isSidebarOpen');
    if (storedValue !== null) {
      setIsSidebarOpen(JSON.parse(storedValue));
    }
  }, []);

  const handleSidebarToggle = () => {
    const newIsOpen = !isSidebarOpen;
    setIsSidebarOpen(newIsOpen);
    localStorage.setItem('isSidebarOpen', JSON.stringify(newIsOpen));
    window.dispatchEvent(new Event('sidebarToggle'));
  };

 

  

  return (
    <>
      <div className="flex h-screen max-w-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={` text-white z-50 overflow-hidden absolute md:relative  h-full ${
            isSidebarOpen ? 'w-72' : ' md:w-[4.5em] w-0 '
          } transition-all duration-300`}
        >
          <Sidebar onToggleSidebar={handleSidebarToggle} />
        </div>

        {/* Content Area */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
            isSidebarOpen ? 'w-[calc(100%-15rem)]' : 'w-[calc(100%-4.5rem)]'
          }`}
        >
          {/* Top Bar */}
          <div className=" top-0 z-30 ">
            <TopBar isSidebarOpen={isSidebarOpen} />
          </div>

          {/* Main Content */}
          <ScrollArea
            className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 px-8 w-full"
            ref={mainContentRef}
          >
            {children}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
