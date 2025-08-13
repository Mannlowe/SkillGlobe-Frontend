'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibilityContext } from './AccessibilityProvider';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Check, X, AlertCircle, Info } from 'lucide-react';

// Enhanced Input with live validation
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
  showValidation?: boolean;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function AccessibleInput({
  label,
  error,
  helpText,
  required,
  validation,
  showValidation = false,
  icon,
  suffix,
  id,
  className,
  onChange,
  ...props
}: AccessibleInputProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { announcePolite } = useAccessibilityContext();
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = (error || internalError) ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(e);

    if (validation && showValidation) {
      const validationError = validation(value);
      setInternalError(validationError);
      setIsValid(validationError === null);
      
      if (isTouched && validationError) {
        announcePolite(`Validation error: ${validationError}`);
      }
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    if (validation && !isTouched) {
      const value = (document.getElementById(inputId) as HTMLInputElement)?.value || '';
      const validationError = validation(value);
      setInternalError(validationError);
      setIsValid(validationError === null);
    }
  };

  const displayError = error || internalError;
  const showValidationIcon = showValidation && isTouched && isValid !== null;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm',
            'focus:border-orange-500 focus:ring-orange-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            displayError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            isValid && showValidation && 'border-green-300 focus:border-green-500 focus:ring-green-500',
            icon && 'pl-10',
            (suffix || showValidationIcon) && 'pr-10',
            className
          )}
          aria-invalid={displayError ? 'true' : 'false'}
          aria-describedby={describedBy}
          required={required}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        
        {(suffix || showValidationIcon) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showValidationIcon ? (
              isValid ? (
                <Check className="w-5 h-5 text-green-500" aria-hidden="true" />
              ) : (
                <X className="w-5 h-5 text-red-500" aria-hidden="true" />
              )
            ) : (
              suffix
            )}
          </div>
        )}
      </div>
      
      {helpText && (
        <p id={helpId} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {displayError && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          <AlertCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
          {displayError}
        </p>
      )}
    </div>
  );
}

// Password Input with strength indicator
interface AccessiblePasswordInputProps extends Omit<AccessibleInputProps, 'type'> {
  showStrength?: boolean;
  strengthRules?: Array<{
    test: (password: string) => boolean;
    message: string;
  }>;
}

export function AccessiblePasswordInput({
  showStrength = false,
  strengthRules = [
    { test: (p) => p.length >= 8, message: 'At least 8 characters' },
    { test: (p) => /[A-Z]/.test(p), message: 'One uppercase letter' },
    { test: (p) => /[a-z]/.test(p), message: 'One lowercase letter' },
    { test: (p) => /[0-9]/.test(p), message: 'One number' },
    { test: (p) => /[^A-Za-z0-9]/.test(p), message: 'One special character' }
  ],
  ...props
}: AccessiblePasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const { announcePolite } = useAccessibilityContext();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (showStrength) {
      const passedRules = strengthRules.filter(rule => rule.test(value)).length;
      const newStrength = (passedRules / strengthRules.length) * 100;
      setStrength(newStrength);
      
      if (value.length > 0) {
        const strengthLabel = newStrength < 40 ? 'weak' : newStrength < 80 ? 'medium' : 'strong';
        announcePolite(`Password strength: ${strengthLabel}`);
      }
    }
    
    props.onChange?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    announcePolite(`Password ${showPassword ? 'hidden' : 'visible'}`);
  };

  return (
    <div className="space-y-1">
      <AccessibleInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        onChange={handlePasswordChange}
        suffix={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        }
      />
      
      {showStrength && password.length > 0 && (
        <div className="space-y-2">
          {/* Strength Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                strength < 40 ? 'bg-red-500' :
                strength < 80 ? 'bg-yellow-500' : 'bg-green-500'
              )}
              style={{ width: `${strength}%` }}
              role="progressbar"
              aria-valuenow={strength}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Password strength"
            />
          </div>
          
          {/* Strength Requirements */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
            <ul className="space-y-1" role="list">
              {strengthRules.map((rule, index) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={index}
                    className={cn(
                      'text-xs flex items-center space-x-2',
                      passed ? 'text-green-600' : 'text-gray-500'
                    )}
                    aria-label={`${rule.message}: ${passed ? 'satisfied' : 'not satisfied'}`}
                  >
                    {passed ? (
                      <Check className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <X className="w-3 h-3" aria-hidden="true" />
                    )}
                    <span>{rule.message}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Textarea
interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  minLength?: number;
}

export function AccessibleTextarea({
  label,
  error,
  helpText,
  required,
  showCharCount = false,
  maxLength,
  minLength,
  id,
  className,
  onChange,
  ...props
}: AccessibleTextareaProps) {
  const [charCount, setCharCount] = useState(0);
  const { announcePolite } = useAccessibilityContext();
  
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helpId = helpText ? `${textareaId}-help` : undefined;
  const countId = showCharCount ? `${textareaId}-count` : undefined;
  const describedBy = [errorId, helpId, countId].filter(Boolean).join(' ') || undefined;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharCount(value.length);
    
    if (maxLength && value.length > maxLength * 0.9) {
      const remaining = maxLength - value.length;
      announcePolite(`${remaining} characters remaining`);
    }
    
    onChange?.(e);
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <textarea
        id={textareaId}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-orange-500 focus:ring-orange-500',
          'disabled:bg-gray-50 disabled:text-gray-500',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        onChange={handleChange}
        {...props}
      />
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          {helpText && (
            <p id={helpId} className="text-sm text-gray-600">
              {helpText}
            </p>
          )}
          
          {error && (
            <p id={errorId} className="text-sm text-red-600" role="alert">
              <AlertCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
              {error}
            </p>
          )}
        </div>
        
        {showCharCount && (
          <p id={countId} className="text-sm text-gray-500" aria-live="polite">
            {charCount}{maxLength && `/${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
}

// Accessible Radio Group
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface AccessibleRadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function AccessibleRadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required,
  orientation = 'vertical',
  className
}: AccessibleRadioGroupProps) {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${groupId}-error` : undefined;
  const { announcePolite } = useAccessibilityContext();

  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
    const option = options.find(opt => opt.value === optionValue);
    announcePolite(`Selected: ${option?.label}`);
  };

  return (
    <fieldset className={cn('space-y-3', className)}>
      <legend className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </legend>
      
      <div
        className={cn(
          'space-y-3',
          orientation === 'horizontal' && 'flex space-x-6 space-y-0'
        )}
        role="radiogroup"
        aria-labelledby={groupId}
        aria-describedby={errorId}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
      >
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          
          return (
            <div key={option.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleChange(option.value)}
                  disabled={option.disabled}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  aria-describedby={option.description ? `${optionId}-desc` : undefined}
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={optionId}
                  className={cn(
                    'text-sm font-medium cursor-pointer',
                    option.disabled ? 'text-gray-400' : 'text-gray-700'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p id={`${optionId}-desc`} className="text-sm text-gray-500">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          <AlertCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

// Form Section with Progress
interface AccessibleFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  isCompleted?: boolean;
  className?: string;
}

export function AccessibleFormSection({
  title,
  description,
  children,
  step,
  totalSteps,
  isCompleted,
  className
}: AccessibleFormSectionProps) {
  const sectionId = `form-section-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <section
      className={cn('space-y-6', className)}
      aria-labelledby={`${sectionId}-title`}
      aria-describedby={description ? `${sectionId}-desc` : undefined}
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <h2 id={`${sectionId}-title`} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          
          {step && totalSteps && (
            <span className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </span>
          )}
          
          {isCompleted && (
            <div className="flex items-center space-x-1 text-green-600">
              <Check className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">Completed</span>
            </div>
          )}
        </div>
        
        {description && (
          <p id={`${sectionId}-desc`} className="text-sm text-gray-600">
            {description}
          </p>
        )}
        
        {step && totalSteps && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Form progress: step ${step} of ${totalSteps}`}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}