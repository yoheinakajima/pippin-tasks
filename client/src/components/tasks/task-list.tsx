import { Task } from "@db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";

interface TaskListProps {
  tasks: Task[];
}

const statusColors = {
  pending: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
};

export function TaskList({ tasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: number; task: Partial<Task> }) =>
      updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              <Badge
                className={`${
                  statusColors[task.status as keyof typeof statusColors]
                } text-white`}
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={`${
                  priorityColors[task.priority as keyof typeof priorityColors]
                } text-white`}
              >
                {task.priority}
              </Badge>
            </TableCell>
            <TableCell>{task.assignedTo || "Unassigned"}</TableCell>
            <TableCell className="text-right space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm initialData={task} />
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteMutation.mutate(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
