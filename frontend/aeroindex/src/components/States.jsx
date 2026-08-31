import { Inbox, AlertTriangle } from "lucide-react";

export function FlightCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-3.5 w-32 mb-2" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-8 w-full" />
    </div>
  );
}

export function TileSkeleton() {
  return (
    <div className="card p-4">
      <div className="skeleton h-3 w-20 mb-3" />
      <div className="skeleton h-7 w-24" />
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon = Inbox }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center gap-2">
      <Icon size={22} className="text-ink-mute dark:text-ink-darkMute mb-1" strokeWidth={1.5} />
      <div className="font-medium text-sm">{title}</div>
      <p className="text-xs text-ink-mute dark:text-ink-darkMute max-w-xs">{description}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description = "Try again in a moment." }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center gap-2 border-bad/30">
      <AlertTriangle size={22} className="text-bad mb-1" strokeWidth={1.5} />
      <div className="font-medium text-sm">{title}</div>
      <p className="text-xs text-ink-mute dark:text-ink-darkMute max-w-xs">{description}</p>
    </div>
  );
}
