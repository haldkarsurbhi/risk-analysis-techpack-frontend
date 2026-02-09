import { useState } from "react";
import api from "../components/api";

export default function TechpackAnalysis() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!file) {
      alert("Select a techpack PDF");
      return;
    }

    const formData = new FormData();
    formData.append("techpack", file);

    try {
      setLoading(true);
      const res = await api.post("/analyse-techpack", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Tech pack upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Tech Pack Analysis</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleAnalyse}>
        {loading ? "Analysing..." : "Analyse Tech Pack"}
      </button>

      {result && (
        <pre style={{ marginTop: 30, background: "#f5f5f5", padding: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
