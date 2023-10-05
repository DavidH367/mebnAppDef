import { Checkbox, Input } from "@nextui-org/react";
import {MailIcon} from '../Icons/MailIcon';
import {UserIcon} from '../Icons/UserIcon';
import { SearchIcon } from "../Icons/SearchIcon";

export const TextInput = ({
  label,
  type,
  value,
  setValue,
  isDisabled,
  errorMessage,
  isRequired,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        type={type}
        value={value}
        onValueChange={setValue}
        disabled={isDisabled}
        variant="bordered"
        className="form-inputs"
        size="lg"
        isRequired={isRequired !== null ? isRequired : false}
        validationState={errorMessage ? "invalid" : "valid"}
        errorMessage={errorMessage}
        label={label}
      />
    </div>
  );
};
export const AgeInput = ({
  label,
  errorMessage,
  type,
  value,
  setValue,
  isDisabled,
  isRequired,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        label={label}
        type={type}
        value={value}
        onValueChange={setValue}
        disabled={isDisabled}
        variant="bordered"
        size="lg"
        className="form-inputs"
        validationState={errorMessage ? "invalid" : "valid"}
        isRequired={isRequired !== null ? isRequired : false}
        errorMessage={errorMessage}
      />
      <span className="form-errors"></span>
    </div>
  );
};
export const TelephoneInput = ({
  label,
  errorMessage,
  value,
  setValue,
  isDisabled,
  isRequired,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        label={label}
        type="tel"
        disabled={isDisabled}
        value={value
          .replace(/[^0-9]/g, "")
          .replace(/(\d{4})(\d{4})/, "$1-$2")
          .slice(0, 9)}
        onValueChange={setValue}
        variant="bordered"
        size="lg"
        errorMessage={errorMessage}
        validationState={errorMessage ? "invalid" : "valid"}
        isRequired={isRequired !== null ? isRequired : false}
        className="form-inputs"
      />
    </div>
  );
};

export const IDNumberInput = ({
  label,
  isDisabled,
  errorMessage,
  value,
  setValue,
  isRequired,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        label={label}
        type="text"
        value={value
          .replace(/[^0-9]/g, "") // Remove all non-numeric characters
          .replace(/(\d{4})(\d{4})(\d{5})/, "$1-$2-$3")
          .slice(0, 15)}
        onValueChange={setValue}
        variant="bordered"
        size="lg"
        disabled={isDisabled}
        errorMessage={errorMessage}
        validationState={errorMessage ? "invalid" : "valid"}
        isRequired={isRequired !== null ? isRequired : false}
        className="form-inputs"
      />
    </div>
  );
};

export const SearchTextInput = ({
  type,
  value,
  setValue,
  isDisabled,
  label,
  errorMessage,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        type={type}
        label={label}
        initialValue={value}
        onValueChange={setValue}
        disabled={isDisabled}
        validationState={errorMessage ? "invalid" : "valid"}
        errorMessage={errorMessage}
        variant="bordered"
        className="form-inputs"
        size="lg"
        startContent={
          <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />
    </div>
  );
};

export const EmailInput = ({
  label,
  type,
  value,
  setValue,
  isDisabled,
  errorMessage,
  isRequired,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        type={type}
        value={value}
        onValueChange={setValue}
        disabled={isDisabled}
        variant="bordered"
        className="form-inputs"
        size="lg"
        isRequired={isRequired !== null ? isRequired : false}
        validationState={errorMessage ? "invalid" : "valid"}
        errorMessage={errorMessage}
        label={label}
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
        }
      />
    </div>
  );
};

import { useState } from "react";
export const PasswordInput = ({
  label,
  errorMessage,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        value={value}
        onValueChange={setValue}
        disabled={isDisabled}
        variant="bordered"
        className="form-inputs"
        size="lg"
        errorMessage={errorMessage}
        validationState={errorMessage ? "invalid" : "valid"}
        type={showPassword ? "text" : "password"}
        label={label}
        startContent={
          <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
        }
      />
      <Checkbox
        aria-label="Text input"
        type="checkbox"
        size="xs"
        onClick={toggleShowPassword}
      >
        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      </Checkbox>
    </div>
  );
};