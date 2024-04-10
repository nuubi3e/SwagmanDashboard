'use client';
import React, { FC, HTMLInputTypeAttribute } from 'react';
import { FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface FormInputProps {
  register: UseFormRegister<any>;
  id: string;
  required?: boolean;
  title: string;
  errors: FieldErrors;
  validations?: RegisterOptions;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  maxLength?: number;
}

const FormInput: FC<FormInputProps> = ({
  errors,
  id,
  register,
  title,
  required,
  validations,
  type,
  placeholder,
  maxLength,
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='font-medium self-start'>
        {title} {required && <strong className='text-red-500'>*</strong>}
      </label>
      <input
        autoComplete='off'
        type={type}
        id={id}
        maxLength={maxLength}
        {...register(id, {
          required: {
            value: required ? true : false,
            message: `${title} is required.`,
          },
          ...validations,
        })}
        className='w-full py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
        placeholder={placeholder || ''}
      />
      {errors?.[id] && (
        <span className='text-sm text-red-500 font-medium'>
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
