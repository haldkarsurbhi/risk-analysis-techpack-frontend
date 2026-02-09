import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-500 mb-8">
        Select a module to begin analysis
      </p>

      <div className="grid grid-cols-3 gap-6 max-w-4xl">
        <Link to="/techpack">
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-6 text-center font-medium">
              Tech Pack Analysis
            </CardContent>
          </Card>
        </Link>

        <Link to="/risk">
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-6 text-center font-medium">
              Risk Analysis
            </CardContent>
          </Card>
        </Link>

        <Link to="/criticality">
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-6 text-center font-medium">
              Criticality
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
