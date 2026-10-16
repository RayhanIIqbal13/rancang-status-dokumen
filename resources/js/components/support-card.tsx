import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SupportCard() {
    return (
        <Card size="sm" className="border-border/80 bg-muted/40 overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
            <CardHeader className="min-w-0 px-4 py-3">
                <CardTitle className="text-foreground truncate text-sm font-semibold">Have something in mind?</CardTitle>
                <CardDescription className="text-muted-foreground mt-0.5 line-clamp-3 text-xs leading-relaxed">
                    Suggest a feature or discuss custom work with me on{' '}
                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground font-medium hover:underline"
                    >
                        X
                    </a>{' '}
                    or by{' '}
                    <a
                        href="mailto:support@itk.ac.id"
                        className="text-foreground font-medium hover:underline"
                    >
                        email
                    </a>
                    .
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
