"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, MoreVertical, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollection, useFirebase, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { formatDistanceToNow } from "date-fns";
import { DocumentListSkeleton } from "./DocumentListSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Document = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: {
    seconds: number;
    nanoseconds: number;
  };
  storagePath: string;
};

export function DocumentList() {
  const { firestore, user } = useFirebase();

  const documentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, "users", user.uid, "documents"),
      orderBy("uploadDate", "desc")
    );
  }, [firestore, user]);

  const { data: documents, isLoading, error } = useCollection<Document>(documentsQuery);

  const handleDelete = (docToDelete: Document) => {
    if (!user) return;
    
    // Delete Firestore document
    const docRef = doc(firestore, "users", user.uid, "documents", docToDelete.id);
    deleteDocumentNonBlocking(docRef);

    // Delete file from Storage
    const storage = getStorage();
    const fileRef = ref(storage, docToDelete.storagePath);
    deleteObject(fileRef).catch((error) => {
      console.error("Error deleting file from storage:", error);
    });
  };

  if (isLoading) {
    return <DocumentListSkeleton />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-destructive">Error Loading Documents</h3>
        <p className="text-destructive/80">There was a problem fetching your files. It might be a permission issue.</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="flex flex-col transition-all hover:shadow-lg">
          <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
            <div className="flex items-start gap-4 overflow-hidden">
                <FileText className="h-8 w-8 flex-shrink-0 text-primary" />
                <div className="overflow-hidden">
                    <CardTitle className="truncate text-base font-semibold leading-tight">{doc.fileName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{formatFileSize(doc.fileSize)}</p>
                </div>
            </div>
             <AlertDialog>
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
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete "{doc.fileName}" and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(doc)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </CardHeader>
          <CardFooter className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
            <Badge variant="secondary" className="truncate bg-accent/50 text-accent-foreground">{doc.fileType}</Badge>
            <span>{formatDistanceToNow(new Date(doc.uploadDate.seconds * 1000), { addSuffix: true })}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
