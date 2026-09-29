import type { InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; error?: string };
export function Field({ id, label, hint, error, ...props }: Props) {
  const describedBy = [props["aria-describedby"], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
    <input {...props} id={id} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy || undefined} />
    {error && <p id={`${id}-error`} className="field-error">{error}</p>}
  </div>;
}
