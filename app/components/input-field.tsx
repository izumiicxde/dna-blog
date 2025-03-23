import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

type InputFieldProps = {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
};

const InputField = ({
  control,
  name,
  label,
  placeholder,
  type,
}: InputFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          {fieldState.error && (
            <p className="text-xs text-red-500">{fieldState.error.message}</p>
          )}
        </FormItem>
      )}
    />
  );
};

export default InputField;
