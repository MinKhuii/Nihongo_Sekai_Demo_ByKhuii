import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-crimson">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-2xl lg:text-3xl font-bold text-nihongo-ink-900 mb-1">
          {value}
        </div>
        <div className="text-sm text-nihongo-ink-600">{label}</div>
      </CardContent>
    </Card>
  );
}
