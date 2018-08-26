export const classNames = (...classNames: (string | false | null)[]) => ({
  className: classNames.filter(c => Boolean(c)).join(" ")
});
