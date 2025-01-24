import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiTest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function RequestBuilder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      endpoint: "/api/tasks",
      method: "GET",
      requestBody: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: {
      endpoint: string;
      method: string;
      requestBody: string;
    }) => {
      try {
        const response = await fetch(values.endpoint, {
          method: values.method,
          headers: {
            "Content-Type": "application/json",
          },
          body:
            values.method !== "GET" && values.requestBody
              ? values.requestBody
              : undefined,
        });

        const responseBody = await response.text();
        const test = {
          endpoint: values.endpoint,
          method: values.method,
          requestBody: values.requestBody,
          responseStatus: response.status,
          responseBody: responseBody,
        };

        return createApiTest(test);
      } catch (error) {
        throw new Error("Failed to execute API test");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tests"] });
      toast({
        title: "API Test Executed",
        description: "The API test has been successfully recorded.",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint</FormLabel>
              <FormControl>
                <Input {...field} placeholder="/api/tasks" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requestBody"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Body (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='{
  "title": "Example Task",
  "status": "pending"
}'
                  className="font-mono"
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Executing..." : "Execute Request"}
        </Button>
      </form>
    </Form>
  );
}
