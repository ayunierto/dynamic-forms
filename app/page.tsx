import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Button variant="outline" asChild>
        <Link href="/dashboard">Entrar</Link>
      </Button>
    </div>
  );
}
