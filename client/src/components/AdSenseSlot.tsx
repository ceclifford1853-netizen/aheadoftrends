import { useEffect } from 'react';

export function AdSenseSlot({ slotId, format = 'auto', className = '' }: {  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}) {
  useEffect(() => {
    try {
      // @ts-ignore - Adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense load error:', e);
    }
  }, []);

  return (
    <div className={`w-full my-6 ${className}`}>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
