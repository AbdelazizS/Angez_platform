import React, { useState } from 'react';

export default function TagInput({ value, onChange, placeholder = '' }) {
  const tags = Array.isArray(value) ? value : [];
  const [input, setInput] = useState('');

  const add = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInput('');
    }
  };

  const remove = (t) => onChange(tags.filter(x => x !== t));

  return (
    <div className="flex flex-wrap gap-2 border p-2 rounded">
      {tags.map(t => (
        <span key={t} className="bg-gray-200 px-2 py-1 rounded flex items-center">
          {t} <button type="button" className="ml-1 text-red-500" onClick={() => remove(t)}>×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); }}}
        placeholder={placeholder}
        className="flex-1 min-w-[100px] border-none outline-none"
      />
      <button type="button" className="text-blue-600 ml-2" onClick={add}>Add</button>
    </div>
  );
}
