import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Metric } from "@db/schema";

async function fetchMetrics(): Promise<Metric[]> {
  const response = await fetch("/api/metrics");
  return response.json();
}

function calculateMetrics(metrics: Metric[]) {
  const endpointStats = metrics.reduce((acc, metric) => {
    const key = `${metric.method} ${metric.endpoint}`;
    if (!acc[key]) {
      acc[key] = {
        totalTime: 0,
        count: 0,
        errors: 0,
        times: [],
      };
    }
    acc[key].totalTime += metric.responseTime;
    acc[key].count += 1;
    if (metric.responseStatus >= 400) {
      acc[key].errors += 1;
    }
    acc[key].times.push({
      time: new Date(metric.timestamp).getTime(),
      responseTime: metric.responseTime,
    });
    return acc;
  }, {} as Record<string, { totalTime: number; count: number; errors: number; times: Array<{ time: number; responseTime: number }> }>);

  return Object.entries(endpointStats).map(([endpoint, stats]) => ({
    endpoint,
    averageResponseTime: stats.totalTime / stats.count,
    errorRate: (stats.errors / stats.count) * 100,
    requestCount: stats.count,
    responseTimes: stats.times.sort((a, b) => a.time - b.time),
  }));
}

export default function MetricsDashboard() {
  const { data: metrics = [] } = useQuery({
    queryKey: ["/api/metrics"],
    queryFn: fetchMetrics,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const processedMetrics = calculateMetrics(metrics);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BarChart2 className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold">API Metrics</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/">
                <Button variant="outline">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Task Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Average Response Times</h2>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <BarChart data={processedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="endpoint"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    label={{
                      value: "Response Time (ms)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="averageResponseTime"
                    fill="hsl(var(--primary))"
                    name="Avg Response Time (ms)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Error Rates</h2>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <BarChart data={processedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="endpoint"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    label={{
                      value: "Error Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="errorRate"
                    fill="hsl(var(--destructive))"
                    name="Error Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Response Time Trends</h2>
            <div className="h-[400px]">
              <ResponsiveContainer>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(time) => format(time, "HH:mm:ss")}
                  />
                  <YAxis
                    label={{
                      value: "Response Time (ms)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(time) => format(time, "HH:mm:ss")}
                  />
                  <Legend />
                  {processedMetrics.map((metric, index) => (
                    <Line
                      key={metric.endpoint}
                      data={metric.responseTimes}
                      dataKey="responseTime"
                      name={metric.endpoint}
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
