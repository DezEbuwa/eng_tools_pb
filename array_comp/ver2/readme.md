let normalizeVersion = (input) => {
 input = input.toLowerCase().trim();

  // Patterns to match and convert
  const patterns = [
    { regex: /greater than\s*(\d+(\.\d+)*)/, replace: (m) => `>${m[1]}` },
    { regex: /at least\s*(\d+(\.\d+)*)/, replace: (m) => `>=${m[1]}` },
    { regex: />=\s*(\d+(\.\d+)*)/, replace: (m) => `>=${m[1]}` },
    { regex: />\s*(\d+(\.\d+)*)/, replace: (m) => `>${m[1]}` },
    { regex: /<=\s*(\d+(\.\d+)*)/, replace: (m) => `<=${m[1]}` },
    { regex: /<\s*(\d+(\.\d+)*)/, replace: (m) => `<${m[1]}` },
    { regex: /^(\d+(\.\d+)*)(\s+or\s+later)?$/, replace: (m) => `>=${m[1]}` },
    { regex: /version\s+(\d+(\.\d+)*)(\s+or\s+later)?/, replace: (m) => `>=${m[1]}` },
    { regex: /just\s+(\d+(\.\d+)*).*/, replace: (m) => `=${m[1]}` }
  ];

  for (const { regex, replace } of patterns) {
    const match = input.match(regex);
    if (match) {
      return replace(match);
    }
  }

  // Fallback: return as-is or coerce
  if (/^\d+(\.\d+)*$/.test(input)) {
    return `=${input}`;
  }

  return input;
}
