import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Embodied AI Daily',
  description: '具身智能前沿信息追踪站点',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
