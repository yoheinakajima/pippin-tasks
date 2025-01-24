import { useQuery } from "@tanstack/react-query";
import { fetchApiTests } from "@/lib/api";
import { RequestBuilder } from "@/components/api-test/request-builder";
import { ResponseViewer } from "@/components/api-test/response-viewer";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Beaker } from "lucide-react";

export default function TestDashboard() {
  const { data: tests = [] } = useQuery({
    queryKey: ["/api/tests"],
    queryFn: fetchApiTests,
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Beaker className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold">API Test Dashboard</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Request Builder</h2>
            <RequestBuilder />
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Response Viewer</h2>
            <ResponseViewer tests={tests} />
          </Card>
        </div>
      </main>
    </div>
  );
}
