import ContainerLanding from '@/components/container/landing-page';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <main className="min-h-full flex flex-col justify-center items-center ">
      <Image
        src="/assets/login-background.jpg"
        alt="background"
        fill
        className="object-cover absolute"
      />
      <ContainerLanding />
    </main>
  );
};

export default LandingPage;
