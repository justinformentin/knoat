import Link from 'next/link';

export default function Footer() {
  return (
    <div className="absolute bottom-0 w-full">
      <div className="flex justify-between text-xs w-full px-8 mb-2">
        <div>&copy; Knoat</div>
        <div className="flex space-x-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </div>
  );
}
