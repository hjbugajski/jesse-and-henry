'use client';

import { useEffect } from 'react';

/**
 * The page content streams in after the static shell, so the browser's native anchor scroll fires
 * before the target element exists. Re-run the scroll once the streamed content has mounted.
 */
export function ScrollToHash() {
  useEffect(() => {
    const { hash } = window.location;

    if (!hash) {
      return;
    }

    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, []);

  return null;
}
