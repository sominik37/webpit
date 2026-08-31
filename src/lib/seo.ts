import { useEffect } from 'react';

export function useJsonLd(data: Record<string, unknown> | null, id: string) {
  useEffect(() => {
    if (!data) return;

    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [data, id]);
}
