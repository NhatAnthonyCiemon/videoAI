export default function FormatVideo() {
    return (
      <div className="w-[360px] space-y-4 text-xl pt-4 border-l-1 border-gray-700 bg-white h-full overflow-y-auto p-4">
        <h2 className="font-bold">Subtitle Settings</h2>
        <div className="flex justify-between">
          <span>Text Alignment</span>
          <div className="flex gap-2">
            <button>⬅️</button>
            <button>⬆️</button>
            <button>➡️</button>
          </div>
        </div>
        <div>
          <label className="block font-medium">Font</label>
          <select className="border p-1 rounded w-full">
            <option>Arial</option>
            <option>Roboto</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="font-bold">B</button>
          <button className="italic">I</button>
          <button className="underline">U</button>
        </div>
      </div>
    );
  }