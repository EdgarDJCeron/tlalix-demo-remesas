import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

export function QRCode({ value, size = 200, level = 'M', className = '' }: QRCodeProps) {
  return (
    <div className={`inline-block bg-white p-4 rounded-lg ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={false}
        fgColor="#000000"
        bgColor="#ffffff"
      />
    </div>
  );
}
