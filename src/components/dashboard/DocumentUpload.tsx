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
import { useFirebase, addDocumentNonBlocking } from "@/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, serverTimestamp } from "firebase/firestore";

export function DocumentUpload({ children }: { children: ReactNode }) {
  const { user, firestore } = useFirebase();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const resetState = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setOpen(false);
  };

  const handleUpload = async () => {
    if (!file || !user) {
      toast({
        title: "Error",
        description: !file ? "No file selected." : "You must be logged in to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storage = getStorage();
    const storagePath = `users/${user.uid}/documents/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload Error:", error);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your file. Please try again.",
          variant: "destructive",
        });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const docData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || 'unknown',
            downloadURL: downloadURL,
            storagePath: storagePath,
            uploadDate: serverTimestamp(),
            userId: user.uid,
          };
          
          const docsCollectionRef = collection(firestore, "users", user.uid, "documents");
          await addDocumentNonBlocking(docsCollectionRef, docData);

          toast({
            title: "Upload Successful",
            description: `"${file.name}" has been uploaded.`,
          });

          setTimeout(() => {
            resetState();
          }, 500);

        } catch (error) {
            console.error("Error saving document metadata:", error);
             toast({
                title: "Error",
                description: "File uploaded, but failed to save document details.",
                variant: "destructive",
            });
            setIsUploading(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isUploading) setOpen(o); if (!o) resetState(); }}>
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
          <Button variant="outline" onClick={resetState} disabled={isUploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
