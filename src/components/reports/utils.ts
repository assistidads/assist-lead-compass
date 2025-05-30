
import { ChartDataItem, PerformaCSItem, DayActivityItem } from './types';

export const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#7c3aed'];

export const getCTRColor = (ctr: number) => {
  if (ctr >= 30) return 'bg-green-100 text-green-800';
  if (ctr >= 20) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const downloadChartAsPNG = (chartRef: React.RefObject<HTMLDivElement>, activeTab: string) => {
  if (chartRef.current) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svg = chartRef.current.querySelector('svg');
    
    if (svg && ctx) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `chart-${activeTab}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  }
};
