export default function RiskSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="font-bold text-lg mb-4">Risk Summary</h3>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm">Related Styles</p>
          <p className="text-xl font-bold">{summary.relatedStyles}</p>
        </div>

        <div className="p-4 bg-red-50 rounded">
          <p className="text-sm">High Risk</p>
          <p className="text-xl font-bold text-red-600">{summary.high}</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded">
          <p className="text-sm">Medium Risk</p>
          <p className="text-xl font-bold text-yellow-600">{summary.medium}</p>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <p className="text-sm">Low Risk</p>
          <p className="text-xl font-bold text-green-600">{summary.low}</p>
        </div>
      </div>
    </div>
  );
}
