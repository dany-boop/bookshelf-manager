export  const bookVariant = {
    hidden: { opacity: 0, x: -50 }, // Start each book off-screen to the left
    show: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 200, damping: 25 },
    },
  };
  