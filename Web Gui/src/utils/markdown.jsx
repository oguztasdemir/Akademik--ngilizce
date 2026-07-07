import React from 'react';

export const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  const tokens = [];
  let match;
  let lastIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(text.substring(lastIdx, match.index));
    }

    if (match[1]) { // bold
      tokens.push(<strong key={match.index} className="font-extrabold text-white">{match[2]}</strong>);
    } else if (match[3]) { // italic
      tokens.push(<em key={match.index} className="italic text-slate-200">{match[4]}</em>);
    } else if (match[5]) { // inline code
      tokens.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 text-xs font-mono font-bold">{match[6]}</code>);
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    tokens.push(text.substring(lastIdx));
  }

  return tokens.length > 0 ? tokens : text;
};

export const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];

  let inTable = false;
  let tableRows = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Parse table row
    if (trimmedLine.startsWith('|')) {
      inTable = true;
      const cells = trimmedLine.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);

      // Skip separator row (e.g. |---|---|)
      if (cells.every(c => c.match(/^:+|-+:*$/) || c === '')) {
        return;
      }

      tableRows.push(cells);
      return;
    }

    // If table ends, flush it
    if (inTable && !trimmedLine.startsWith('|')) {
      inTable = false;
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${index}`} className="overflow-x-auto my-4 rounded-xl border border-white/5 bg-white/1">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-indigo-500/10">
                <tr>
                  {tableRows[0].map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                      {parseInlineMarkdown(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {tableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-white/2 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-xs text-slate-300">
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    }

    if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl font-extrabold text-slate-100 mt-6 mb-3 border-b border-white/10 pb-2">
          {parseInlineMarkdown(trimmedLine.substring(2))}
        </h1>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-indigo-400 mt-5 mb-2">
          {parseInlineMarkdown(trimmedLine.substring(3))}
        </h2>
      );
    } else if (trimmedLine.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold text-emerald-400 mt-4 mb-2">
          {parseInlineMarkdown(trimmedLine.substring(4))}
        </h3>
      );
    } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const isSub = line.startsWith('    ') || line.startsWith('\t');
      elements.push(
        <div key={index} className={`flex items-start gap-2 text-slate-300 text-sm leading-relaxed ${isSub ? 'pl-8' : 'pl-4'} mb-1`}>
          <span className="text-indigo-400 mt-1.5 flex-shrink-0 text-[10px]">•</span>
          <div>{parseInlineMarkdown(trimmedLine.substring(2))}</div>
        </div>
      );
    } else if (!trimmedLine) {
      // Empty line spacer
    } else {
      elements.push(
        <p key={index} className="text-slate-300 text-sm leading-relaxed mb-3">
          {parseInlineMarkdown(trimmedLine)}
        </p>
      );
    }
  });

  // Final flush in case document ends with a table
  if (inTable && tableRows.length > 0) {
    elements.push(
      <div key={`table-final`} className="overflow-x-auto my-4 rounded-xl border border-white/5 bg-white/1">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-indigo-500/10">
            <tr>
              {tableRows[0].map((cell, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {parseInlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {tableRows.slice(1).map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/2 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3 text-xs text-slate-300">
                    {parseInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return elements;
};
