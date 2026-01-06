import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DocumentListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
            <div className="flex items-start gap-4 overflow-hidden">
                <Skeleton className="h-8 w-8 flex-shrink-0" />
                <div className="w-full space-y-2 overflow-hidden">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
          </CardHeader>
          <CardFooter className="mt-auto flex items-center justify-between pt-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
