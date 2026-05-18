"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ProfitChart({ revenue, expenses }: { revenue: number, expenses: number }) {
  const data = [
    { name: 'Receita', value: revenue },
    { name: 'Despesas', value: expenses },
  ];
  
  const COLORS = ['#10b981', '#ef4444']; // emerald-500, red-500

  // If no data, show empty state
  if (revenue === 0 && expenses === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm font-mono">
        Sem dados no período
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend 
             verticalAlign="bottom" 
             height={36} 
             iconType="circle"
             wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
