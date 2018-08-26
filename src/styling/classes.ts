export const classNames = (...classNames: (string | false)[]) => ({
  className: classNames.filter(c => Boolean(c)).join(" ")
});
