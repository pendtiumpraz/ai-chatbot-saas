import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Dobeon Logo SVG */}
      <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <Image
          src="/logo/dobeon 1.svg"
          alt="Dobeon Logo"
          width={200}
          height={46}
          className="w-auto h-auto"
          priority
        />
      </div>
    </Link>
  );
}
