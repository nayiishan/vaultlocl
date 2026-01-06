import { DocumentList } from "@/components/dashboard/DocumentList";
import { DocumentUpload } from "@/components/dashboard/DocumentUpload";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">View and manage your uploaded files.</p>
        </div>
        <DocumentUpload>
          <Button>
            <FileUp className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </DocumentUpload>
      </div>
      <DocumentList />
    </div>
  );
}
