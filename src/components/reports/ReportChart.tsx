
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { HeatmapChart } from '../HeatmapChart';
import { ChartDataItem, PerformaCSItem } from './types';
import { COLORS, downloadChartAsPNG } from './utils';

interface ReportChartProps {
  activeTab: string;
  data: ChartDataItem[] | PerformaCSItem[];
  heatmapData?: { day: string; hour: number; value: number; leads: number }[];
  title: string;
}

export function ReportChart({ activeTab, data, heatmapData, title }: ReportChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const renderChart = () => {
    if (activeTab === 'sumber-leads') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {(data as ChartDataItem[]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === 'heatmap' && heatmapData) {
      return <HeatmapChart data={heatmapData} />;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="prospek" fill="#2563eb" name="Prospek" />
          <Bar dataKey="leads" fill="#16a34a" name="Leads" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={() => downloadChartAsPNG(chartRef, activeTab)}>
          <Download className="h-4 w-4 mr-2" />
          PNG
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}
