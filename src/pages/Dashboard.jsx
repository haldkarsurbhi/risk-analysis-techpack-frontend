import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold text-slate-800 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TECH PACK */}
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Tech Pack Analysing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Upload and validate tech pack completeness.
            <div className="mt-4">
              <Button className="w-full">Open</Button>
            </div>
          </CardContent>
        </Card>

        {/* RISK */}
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Risk Analysing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Predict sewing, machine & process risks.
            <div className="mt-4">
              <Button className="w-full">Open</Button>
            </div>
          </CardContent>
        </Card>

        {/* CRITICALITY */}
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Criticality</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Identify high-impact operations & defects.
            <div className="mt-4">
              <Button className="w-full">Open</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default Dashboard;
