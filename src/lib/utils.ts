export function cn(...inputs: any[]): string {
  const classes: string[] = [];

  const push = (val: any) => {
    if (!val) return;
    if (typeof val === "string" || typeof val === "number") {
      classes.push(String(val));
      return;
    }
    if (Array.isArray(val)) {
      val.forEach(push);
      return;
    }
    if (typeof val === "object") {
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key) && val[key]) {
          classes.push(key);
        }
      }
    }
  };

  inputs.forEach(push);
  return classes.join(" ");
}
