import React, { useState } from "react";
import { TextInput, HelperText } from "react-native-paper";

interface DateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label = "Fecha",
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
}) => {
  const [error, setError] = useState(false);

  const validate = (text: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    setError(!(text === "" || regex.test(text)));
  };

  const formatFecha = (text: string): string => {
    const cleaned = text.replace(/\D/g, ""); // solo números

    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4)
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
      4,
      8
    )}`;
  };

  const handleChange = (text: string) => {
    const formatted = formatFecha(text);
    validate(formatted);
    onChange(formatted);
  };

  return (
    <>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChange}
        error={error}
        mode="outlined"
        keyboardType="numeric"
        style={{ marginVertical: 8 }}
        maxLength={10} // Evita que escriban más de lo necesario
      />
      {error && (
        <HelperText type="error" visible={error}>
          Formato inválido. Usa DD/MM/YYYY
        </HelperText>
      )}
    </>
  );
};

export default DateInput;
