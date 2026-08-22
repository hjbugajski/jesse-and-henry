'use client';

interface Props {
  error: Error & { digest?: string };
  retry: () => void;
}

/**
 * Catches errors thrown by a root layout, which the route-level boundaries cannot see. It renders
 * without the layout, so it ships its own document and inline styles.
 */
export default function GlobalError({ error, retry }: Props) {
  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: '#fcfcfc',
          color: '#3a3a3a',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Something Went Wrong</h1>
          <p>An unexpected error occurred. Try again, or reload the page.</p>
          {error.digest ? (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Reference: {error.digest}</p>
          ) : null}
        </div>
        <button type="button" onClick={retry}>
          Try Again
        </button>
      </body>
    </html>
  );
}
