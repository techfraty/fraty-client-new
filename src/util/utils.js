export function formToCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function incrementTimeBy2Hours(time) {
  const [hour, minutes] = time.split(":");
  const newHour = parseInt(hour) + 2;
  return `${newHour}:${minutes}`;
}

export function isValidLink(link) {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  return regex.test(link);
}
