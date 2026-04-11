import { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Returns an object containing the fields that have been modified (dirty) in the form
 *
 * @param form - React Hook Form useForm instance
 * @param data - form data
 * @returns an object with only the dirty fields-values
 */
export function getDirtyFields<T extends FieldValues>(
  form: UseFormReturn<T>,
  data: T,
): Partial<T> {
  const { dirtyFields } = form.formState;

  return Object.fromEntries(
    (Object.keys(data) as (keyof T)[])
      .filter((key) => dirtyFields[key as keyof typeof dirtyFields])
      .map((key) => [key, data[key]]),
  ) as Partial<T>;
}

/**
 * Handles onChange for number inputs, converting the value to number and defaulting to 0 if NaN
 *
 * @param onChange - The field onChange function from React Hook Form
 * @returns onChange handler ready to be used in type="number" inputs
 */
export function handleNumberInputChange(onChange: (value: number) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.valueAsNumber;
    onChange(isNaN(num) ? 0 : num);
  };
}
