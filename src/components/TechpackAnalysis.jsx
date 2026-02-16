const sectionData = results?.collar;

const safeData = Array.isArray(sectionData)
  ? sectionData
  : [];

return (
  safeData.length === 0
    ? <span className="muted">Not specified in tech pack</span>
    : safeData.map((item, i) => (
      <div key={i}>{JSON.stringify(item)}</div>
    ))
);
