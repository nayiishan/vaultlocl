import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockDocuments = [
  { id: 1, name: "Project-Proposal.pdf", type: "PDF", size: "2.5 MB", uploaded: "2 days ago", tag: "Work" },
  { id: 2, name: "Quarterly-Report.docx", type: "DOCX", size: "1.2 MB", uploaded: "5 days ago", tag: "Reports" },
  { id: 3, name: "New-Brand-Assets.zip", type: "ZIP", size: "5.8 MB", uploaded: "1 week ago", tag: "Design" },
  { id: 4, name: "Invoice-2023-04.pdf", type: "PDF", size: "300 KB", uploaded: "2 weeks ago", tag: "Finance" },
  { id: 5, name: "Team-Photo-2024.jpg", type: "JPG", size: "4.1 MB", uploaded: "1 month ago", tag: "Personal" },
  { id: 6, name: "Service-Contract.pdf", type: "PDF", size: "1.8 MB", uploaded: "1 month ago", tag: "Legal" },
];

export function DocumentList() {
    if (mockDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
        <div className="mb-4 rounded-full border border-dashed p-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">No Documents Yet</h3>
        <p className="text-muted-foreground">Upload your first document to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockDocuments.map((doc) => (
        <Card key={doc.id} className="flex flex-col transition-all hover:shadow-lg">
          <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
            <div className="flex items-start gap-4 overflow-hidden">
                <FileText className="h-8 w-8 flex-shrink-0 text-primary" />
                <div className="overflow-hidden">
                    <CardTitle className="truncate text-base font-semibold leading-tight">{doc.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{doc.size}</p>
                </div>
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-my-2 -mr-2 h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardFooter className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-accent/50 text-accent-foreground">{doc.tag}</Badge>
            <span>{doc.uploaded}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
