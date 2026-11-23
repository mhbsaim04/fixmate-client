import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center" aria-busy="true" aria-label="Loading">
      <span className="grid size-14 animate-spin place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Wrench className="size-7" />
      </span>
    </div>
  );
}
