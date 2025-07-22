const integer = new Intl.NumberFormat("en-US");

export const formatCount = (n: number) => integer.format(n);
