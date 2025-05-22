export function formatMessageTime(date) {
  return new Date(date).toLocaleString("eu-ro", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}