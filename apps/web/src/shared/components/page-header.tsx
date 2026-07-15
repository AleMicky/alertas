import { ReactNode } from 'react';

interface Props {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageHeader({ title, description, action }: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    {title}
                </h1>

                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
