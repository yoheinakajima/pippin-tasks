import { Task } from "@db/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface StatusChartProps {
  tasks: Task[];
}

const COLORS = {
  pending: "#EAB308",
  "in-progress": "#3B82F6",
  completed: "#22C55E",
  cancelled: "#EF4444",
};

export function StatusChart({ tasks }: StatusChartProps) {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  className="fill-current text-sm"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                >
                  {`${value}`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
