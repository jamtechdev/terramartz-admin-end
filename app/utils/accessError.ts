export function getReadableAccessError(
  errorOrMessage: unknown,
  fallback: string,
): string {
  const raw =
    typeof errorOrMessage === "string"
      ? errorOrMessage
      : (errorOrMessage as any)?.response?.data?.message ||
        (errorOrMessage as any)?.message ||
        "";

  const message = String(raw || "").trim();
  if (!message) return fallback;

  if (
    /do not have .* access/i.test(message) ||
    /not authorized/i.test(message) ||
    /forbidden/i.test(message) ||
    /permission/i.test(message)
  ) {
    const fullMatch = message.match(/(Full|View)\s+access\s+to\s+the\s+(.+?)\s+module/i);
    if (fullMatch) {
      const level = fullMatch[1];
      const moduleName = fullMatch[2];
      return `Access denied: you need ${level} ${moduleName} permission to perform this action.`;
    }
    return "Access denied: you do not have permission to perform this action.";
  }

  return message;
}
