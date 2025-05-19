'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ContainerLanding = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/auth/login'); // Redirect to login page
  };

  const handleRegisterClick = () => {
    router.push('/auth/register'); // Redirect to register page
  };
  return (
    <>
      <motion.div
        className="text-center max-w-3xl px-6 py-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
          Welcome to Bookshelf Manager
        </h1>
        <p className="text-lg text-white mb-8">
          Manage your bookshelf effortlessly. Organize, track, and explore your
          books with ease.
        </p>
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="md:p-8 p-5 bg-white/50 backdrop-blur-sm backdrop-filter shadow-md rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Login</h3>
            <p className="text-gray-800 mb-6">
              Already have an account? Log in to manage your bookshelf.
            </p>
            <Button
              onClick={handleLoginClick}
              className="w-full bg-green-500 text-white"
            >
              Go to Login
            </Button>
          </div>
          <div className="md:p-8 p-5 bg-white/50 backdrop-blur-sm backdrop-filter shadow-md rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Register</h3>
            <p className="text-gray-800 mb-6">
              Don't have an account? Sign up and start managing your books.
            </p>
            <Button
              onClick={handleRegisterClick}
              className="w-full bg-green-500 text-white"
            >
              Go to Register
            </Button>
          </div>
        </motion.div>{' '}
      </motion.div>
    </>
  );
};

export default ContainerLanding;
