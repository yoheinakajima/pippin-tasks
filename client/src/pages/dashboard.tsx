import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";
import { StatusChart } from "@/components/tasks/status-chart";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BeakerIcon, LayoutDashboard, BarChart2 } from "lucide-react";

export default function Dashboard() {
  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: fetchTasks,
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <LayoutDashboard className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold">Task Manager</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/metrics">
                <Button variant="outline">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  API Metrics
                </Button>
              </Link>
              <Link href="/test">
                <Button variant="outline">
                  <BeakerIcon className="mr-2 h-4 w-4" />
                  API Test Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Tasks</h2>
              <TaskList tasks={tasks} />
            </Card>
          </div>
          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Add Task</h2>
              <TaskForm />
            </Card>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Status Distribution</h2>
              <StatusChart tasks={tasks} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}