// import * as React from 'react';

// import { cn } from '@/lib/utils';

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Input.displayName = 'Input';

// export { Input };

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  err?: any;
}

const NormalInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:border-green-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
NormalInput.displayName = 'Input';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, err, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          id={id}
          className={cn(
            'peer flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pt-6 text-sm shadow-sm  transition-colors placeholder-transparent focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          placeholder=" " // A space to trigger the placeholder effect
          ref={ref}
          {...props}
        />
        <label
          htmlFor={id}
          className={`${
            err
              ? 'text-red-500 focus:text-red-500 absolute left-3 hover:cursor-text top-[0.3em] bg-gray-100 dark:bg-gray-900 px-1 text-sm transition-all transform origin-[0] scale-90 -translate-y-[1em] peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-red-500 peer-focus:-translate-y-4 peer-focus:scale-90 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-90'
              : 'absolute left-3 top-[0.3em] bg-gray-100 dark:bg-gray-900 px-1 text-sm text-slate-900 dark:text-slate-50 transition-all transform origin-[0] scale-90 -translate-y-[1em] peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-slate-900 peer-placeholder-shown:dark:text-slate-50 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:text-green-500 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-90'
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, NormalInput };
