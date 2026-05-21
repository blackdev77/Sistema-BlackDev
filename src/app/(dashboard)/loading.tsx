import { Card, CardContent } from "@/components/ui/Card"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-surface rounded-md"></div>
          <div className="h-4 w-64 bg-surface/50 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-surface rounded-md"></div>
          <div className="h-9 w-32 bg-primary/20 rounded-md"></div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="h-4 w-24 bg-surface rounded"></div>
                <div className="h-9 w-9 rounded-full bg-surface"></div>
              </div>
              <div className="h-8 w-32 bg-surface rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <CardContent className="p-6">
           <div className="h-[300px] w-full bg-surface/50 rounded-md"></div>
        </CardContent>
      </Card>
    </div>
  )
}
