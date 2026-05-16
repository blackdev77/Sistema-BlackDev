'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface FinanceChartProps {
  data: { month: string; revenue: number; expenses: number }[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            tickFormatter={(value) => `R$${value/1000}k`}
          />
          <Tooltip 
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '4px' }}
            itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
            labelStyle={{ color: '#fff', marginBottom: '8px' }}
            formatter={(value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
          />
          <Bar dataKey="revenue" name="Receitas" fill="#ffffff" radius={[2, 2, 0, 0]} />
          <Bar dataKey="expenses" name="Despesas" fill="#444444" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
