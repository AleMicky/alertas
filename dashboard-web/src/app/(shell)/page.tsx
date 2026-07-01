'use client';

import { PageHeader } from '@/shared/components';

export default function HomePage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Panel de administración del sistema de notificaciones."
      />
    </main>
  );
}
