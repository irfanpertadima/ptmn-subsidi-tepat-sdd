import { Suspense } from 'react';
import { ConsentGate } from '@/consent/ConsentGate';

export default function PersetujuanPage() {
  return (
    <Suspense>
      <ConsentGate />
    </Suspense>
  );
}
