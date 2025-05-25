export const bookVariant = {
  hidden: { opacity: 0, x: -50 }, // Start each book off-screen to the left
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
};

export const filterVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};
