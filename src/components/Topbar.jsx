
import { Button } from "@/components/ui/button";

export default function Topbar({ toggleSidebar }) {
  return (
    <div className="h-14 bg-white shadow-sm flex items-center px-4 justify-between">
      <Button variant="outline" onClick={toggleSidebar}>
        ☰
      </Button>

      <span className="font-semibold">Style Risk Analyser</span>
      <span>User</span>
    </div>
  );
}
