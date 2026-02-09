export default function RiskDashboard({ risks }) {
  if (!risks) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="font-bold text-lg mb-4">Risk Analysis Dashboard</h3>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Operation</th>
            <th className="border p-2">Risk Type</th>
            <th className="border p-2">Severity</th>
            <th className="border p-2">Reason</th>
          </tr>
        </thead>

        <tbody>
          {risks.map((r, i) => (
            <tr key={i}>
              <td className="border p-2">{r.operation}</td>
              <td className="border p-2">{r.type}</td>
              <td className="border p-2 font-semibold">{r.severity}</td>
              <td className="border p-2">{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
