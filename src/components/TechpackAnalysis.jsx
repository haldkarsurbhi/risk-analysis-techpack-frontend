import { useState } from "react";
import api from "../components/api";

function Section({ title, items }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{ fontWeight: "bold" }}>{title}</h3>

      {safeItems.length === 0 ? (
        <p style={{ color: "#999" }}>No data</p>
      ) : (
        <ul>
          {safeItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TechpackAnalysis() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!file) {
      alert("Select TECHPACK PDF");
      return;
    }

    const formData = new FormData();
    formData.append("techpack", file);

    try {
      setLoading(true);
      const res = await api.post("/analyse-techpack", formData);
      setResult(res.data);
    } catch (err) {
      alert("Tech pack upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Tech Pack Analysis</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleAnalyse} disabled={loading}>
        Analyse Tech Pack
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <Section title="COLLAR" items={result.collar} />
          <Section title="ASSEMBLY" items={result.assembly} />
          <Section title="FRONT" items={result.front} />
          <Section title="BACK" items={result.back} />
          <Section title="YOKE" items={result.yoke} />
          <Section title="POCKET" items={result.pocket} />
        </div>
      )}
    </div>
  );
}
