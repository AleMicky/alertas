'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  form: {
    handleSubmit: () => void;
  };
  className?: string;
}

export function TanStackForm({
  children,
  form,
  className = 'space-y-4',
}: Props) {
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {children}
    </form>
  );
}