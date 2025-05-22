export const getStatusClass = (status: string) => {
  switch (status) {
    case 'finished':
      return 'bg-green-500/30 text-green-500';
    case 'unread':
      return 'bg-yellow-500/30 text-yellow-500';
    case 'reading':
      return 'bg-blue-500/30 text-blue-500';
    default:
      return 'bg-gray-500/30 text-yellow-500';
  }
};
