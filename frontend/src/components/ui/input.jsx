import React from 'react'

export function Input({ className, label, id, ...props }) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-indigo-900"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`flex h-10 w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm 
          ring-offset-background 
          placeholder:text-gray-400
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50 
          transition-colors
          ${className || ""}`}
        {...props}
      />
    </div>
  )
}

