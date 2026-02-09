export default function ComparisonTable({ tp1 }) {
  if (!tp1) return null;

  // ---------- helpers ----------
  const isTypeLine = (line) =>
    /^[A-Z\s]+$/.test(line) && !/\d/.test(line);

  const extractValue = (line) => {
    const match = line.match(/(\d+(\.\d+)?\s?(mm|MM|cm|inch|\"|”))/);
    return match ? match[0] : "—";
  };

  const normalizeLabel = (line) =>
    line
      .replace(/(\d+(\.\d+)?\s?(mm|MM|cm|inch|\"|”))/g, "")
      .replace(/SPI|SNLS|DNCS|FOA/gi, "")
      .replace(/[-:]/g, "")
      .trim();

  const splitComponentData = (lines = []) => {
    const result = {
      type: null,
      specs: [],
      stitching: [],
      parts: [],
      instructions: [],
      missing: []
    };

    lines.forEach((line) => {
      const upper = line.toUpperCase();

      // TYPE
      if (!result.type && isTypeLine(upper)) {
        result.type = line;
        return;
      }

      // INSTRUCTIONS
      if (upper.startsWith("BEFORE") || upper.startsWith("AFTER")) {
        result.instructions.push(line);
        return;
      }

      // STITCHING / GAUGE
      if (upper.includes("SPI") || upper.includes("SNLS") || upper.includes("DNCS") || upper.includes("FOA")) {
        result.stitching.push({
          label: normalizeLabel(line),
          value: extractValue(line)
        });
        return;
      }

      // SPECIFICATIONS (measurements)
      if (/\d/.test(line)) {
        result.specs.push({
          label: normalizeLabel(line),
          value: extractValue(line)
        });
        return;
      }

      // PARTS / MATERIAL
      if (line.includes("-") || upper.includes("BONE") || upper.includes("PATCH")) {
        result.parts.push(line);
        return;
      }

      // UNCLEAR
      result.missing.push(line);
    });

    return result;
  };

  // ---------- UI ----------
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8 space-y-10">
      <h2 className="text-xl font-bold">Tech Pack Analysis</h2>

      {/* META */}
      <section>
        <h3 className="font-semibold mb-2">Meta Information</h3>
        <table className="w-full border">
          <tbody>
            {["buyer", "styleRef", "season"].map((key) => (
              <tr key={key}>
                <td className="border p-2 font-medium capitalize">{key}</td>
                <td className="border p-2">{tp1.meta?.[key] || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* COMPONENTS */}
      <section>
        <h3 className="font-semibold mb-4">Components</h3>

        {Object.entries(tp1.components || {}).map(([comp, lines]) => {
          if (!lines.length) return null;

          const data = splitComponentData(lines);

          return (
            <details key={comp} className="border rounded mb-4">
              <summary className="cursor-pointer px-4 py-2 font-semibold bg-gray-100 capitalize">
                {comp}
              </summary>

              <div className="p-4 space-y-4">
                {/* TYPE */}
                {data.type && (
                  <div>
                    <h4 className="font-medium">Type</h4>
                    <p>{data.type}</p>
                  </div>
                )}

                {/* SPECIFICATIONS */}
                {data.specs.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Specifications</h4>
                    <table className="w-full border">
                      <tbody>
                        {data.specs.map((s, i) => (
                          <tr key={i}>
                            <td className="border p-2">{s.label}</td>
                            <td className="border p-2">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* STITCHING */}
                {data.stitching.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Stitching & Gauge</h4>
                    <table className="w-full border">
                      <tbody>
                        {data.stitching.map((s, i) => (
                          <tr key={i}>
                            <td className="border p-2">{s.label}</td>
                            <td className="border p-2">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PARTS */}
                {data.parts.length > 0 && (
                  <div>
                    <h4 className="font-medium">Parts / Materials</h4>
                    <ul className="list-disc pl-5">
                      {data.parts.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* INSTRUCTIONS */}
                {data.instructions.length > 0 && (
                  <div>
                    <h4 className="font-medium">Process Instructions</h4>
                    <ul className="list-disc pl-5">
                      {data.instructions.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* MISSING */}
                {data.missing.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded">
                    <h4 className="font-medium">Missing / Unclear</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {data.missing.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
