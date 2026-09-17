import { Eye, EyeOff } from "lucide-react";

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  showPassword,
  onTogglePassword,
  autoComplete,
  inputMode,
  maxLength,
}) {
  const isPassword = type === "password" || type === "text-password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="auth-input-group">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      <div className={`auth-input-wrap${error ? " has-error" : ""}`}>
        <Icon className="auth-input-icon" aria-hidden="true" />
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-password-toggle"
            onClick={onTogglePassword}
            aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && (
        <p className="auth-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
