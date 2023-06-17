import React, { ButtonHTMLAttributes, ReactNode } from 'react'

import './Button.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'primary-outline' | 'ternary'
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  leftIcon?: ReactNode
}

const getClassName = (variant: string) => {
  switch (variant) {
    case 'secondary':
      return 'btn_secondary'
    case 'error':
      return 'btn_error'
    case 'ternary':
      return 'btn_ternary'
    case 'primary-outline':
      return 'btn_primary-outline'
    default:
      return 'btn_primary'
  }
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = undefined,
  type = 'button',
  leftIcon = null,
  ...rest
}) => {
  const classNames = className
    ? `${getClassName(variant)} ${className}`
    : `${getClassName(variant)}`

  return (
    <button className={classNames} type={type} {...rest}>
      {leftIcon && <span className="btn_left-icon">{leftIcon}</span>}
      {children}
    </button>
  )
}

export default React.memo(Button)
