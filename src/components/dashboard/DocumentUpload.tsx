"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DocumentUpload({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return prev;
            }
            return prev + 5;
        });
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(progressInterval);
    setUploadProgress(100);

    toast({
      title: "Upload Successful",
      description: `"${file.name}" has been uploaded.`,
    });
    
    setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        setOpen(false);
        setUploadProgress(0);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isUploading) setOpen(o); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Select a file from your computer to upload to your secure vault.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">Max file size 10MB</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                </label>
            </div> 
            {file && !isUploading && <p className="text-sm text-muted-foreground">Selected file: <span className="font-medium text-foreground">{file.name}</span></p>}
            {isUploading && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground truncate">Uploading {file?.name}...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); setFile(null); }} disabled={isUploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
