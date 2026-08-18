'use client';

import { useEffect } from 'react';
import { reportError } from '@/telemetry';

/**
 * Last-resort boundary for errors thrown in the root layout. Replaces the whole document, so it
 * cannot use the theme — it still reports through the scrubbing boundary.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    reportError(error, { digest: error.digest, boundary: 'global' });
  }, [error]);

  return (
    <html lang="id">
      <body>
        <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
          <h1>Terjadi Kesalahan</h1>
          <p>Maaf, terjadi kesalahan. Silakan muat ulang halaman.</p>
        </main>
      </body>
    </html>
  );
}
