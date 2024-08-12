export function formatCurrency(code, number) {
  const currency_format = new Intl.NumberFormat(undefined, {
    currency: code ? code : "NGN",
    style: "currency",
  });
  return currency_format.format(number);
}

export function formatDate(date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const formatEditDate = (date) => {
  if (date) {
    const formattedDate = new Date(date);
    if (!isNaN(formattedDate)) {
      return formattedDate.toISOString().split("T")[0];
    }
  }
  return null;
};
