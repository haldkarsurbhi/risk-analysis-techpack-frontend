import { useFactory } from "../context/FactoryContext";

export default function FactorySelector() {
  const { factory, setFactory } = useFactory();

  return (
    <select
      className="w-full border p-2 rounded"
      value={factory}
      onChange={(e) => setFactory(e.target.value)}
    >
      <option value="">Select Factory</option>
      <option value="Factory A">Factory A</option>
      <option value="Factory B">Factory B</option>
    </select>
  );
}
