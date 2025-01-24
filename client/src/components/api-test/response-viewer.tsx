import { ApiTest } from "@db/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface ResponseViewerProps {
  tests: ApiTest[];
}

const statusColors: Record<string, string> = {
  "2": "bg-green-500",
  "3": "bg-blue-500",
  "4": "bg-yellow-500",
  "5": "bg-red-500",
};

export function ResponseViewer({ tests }: ResponseViewerProps) {
  return (
    <ScrollArea className="h-[600px]">
      <Accordion type="single" collapsible className="w-full">
        {tests.map((test) => (
          <AccordionItem key={test.id} value={test.id.toString()}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-4">
                <Badge
                  className={`${
                    statusColors[test.responseStatus.toString()[0]]
                  } text-white`}
                >
                  {test.responseStatus}
                </Badge>
                <span className="font-mono text-sm">
                  {test.method} {test.endpoint}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(test.createdAt), "MMM d, yyyy HH:mm:ss")}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {test.requestBody && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        {JSON.stringify(JSON.parse(test.requestBody), null, 2)}
                      </code>
                    </pre>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Response Body</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {JSON.stringify(JSON.parse(test.responseBody), null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}
