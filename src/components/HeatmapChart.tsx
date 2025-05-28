
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
  subtitle?: string;
}

export function HeatmapChart({ data, title = "Heatmap Aktivitas Prospek Masuk", subtitle = "Intensitas berdasarkan hari dan jam prospek masuk" }: HeatmapChartProps) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  // Get max value for color scaling
  const maxValue = Math.max(...data.map(d => d.value), 1);

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      const key = `${item.day}-${item.hour}`;
      map.set(key, item.value);
    });
    return map;
  }, [data]);

  const getIntensity = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    const value = dataMap.get(key) || 0;
    return value / maxValue;
  };

  const getColorClass = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity <= 0.25) return 'bg-red-200';
    if (intensity <= 0.5) return 'bg-red-400';
    if (intensity <= 0.75) return 'bg-red-600';
    return 'bg-red-800';
  };

  const getValueDisplay = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    return dataMap.get(key) || 0;
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header with hours */}
          <div className="grid grid-cols-25 gap-1 text-xs">
            <div className="font-medium text-gray-700 text-right pr-2">Hari/Jam</div>
            {hours.map(hour => (
              <div key={hour} className="text-center font-medium text-gray-700">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {days.map(day => (
            <div key={day} className="grid grid-cols-25 gap-1">
              <div className="font-medium text-gray-700 text-right pr-2 py-2">
                {day}
              </div>
              {hours.map((hour, hourIndex) => {
                const intensity = getIntensity(day, hourIndex);
                const value = getValueDisplay(day, hourIndex);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded ${getColorClass(intensity)} ${
                      intensity > 0.5 ? 'text-white' : 'text-gray-800'
                    } transition-all hover:scale-110 cursor-pointer`}
                    title={`${day} ${hour}:00 - ${value} prospek`}
                  >
                    {value > 0 ? value : ''}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Intensitas:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">0</span>
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-xs text-gray-600">Rendah</span>
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-xs text-gray-600">Sedang</span>
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-xs text-gray-600">Tinggi</span>
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-xs text-gray-600">Sangat Tinggi</span>
              <div className="w-4 h-4 bg-red-800 rounded"></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .grid-cols-25 {
            grid-template-columns: 80px repeat(24, 1fr);
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
