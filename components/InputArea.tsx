interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputArea({ value, onChange }: InputAreaProps) {
  return (
    // MODIFIED: Make the container a full-height flex column
    <div className="flex flex-col h-full">
      <label htmlFor="input-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Your Messy Code
      </label>
      <textarea
        id="input-code"
        name="input-code"
        // MODIFIED: Removed "rows" and added "flex-grow" to fill vertical space
        // Also changed background to white for better contrast
        className="flex-grow w-full p-4 font-mono text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-slate-300 transition-colors resize-none"
        placeholder="Paste your code here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}