import { Button } from "@/components/ui/button";

export default function RiskUpload({ onAnalyse }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold text-lg mb-6">Upload Inputs</h3>

      {/* SIDE BY SIDE UPLOADS */}
      <div className="grid grid-cols-2 gap-8">
        
        {/* TECH PACK */}
        <div className="space-y-2">
          <label className="block font-medium text-sm">
            Tech Pack (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full border rounded p-2"
          />
        </div>

        {/* BDE / SMV */}
        <div className="space-y-2">
          <label className="block font-medium text-sm">
            BDE / SMV Sheet
          </label>
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            className="w-full border rounded p-2"
          />
        </div>

      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-end mt-6">
        <Button onClick={onAnalyse}>
          Analyse Risk
        </Button>
      </div>
    </div>
  );
}
