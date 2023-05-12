import { ErrorMessage, Field } from "formik";
import React, { InputHTMLAttributes, ReactNode } from "react";

import "./TextField.scss";

interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  name: string;
  as?: string;
  [key: string]: any;
}

const TextField: React.FC<ITextFieldProps> = ({ name, label, as, ...rest }) => {
  return (
    <div className="form_input">
      <label className="form_input-label" htmlFor={name}>
        {label}
      </label>
      <Field name={name} id={name} as={as} {...rest} />
      <ErrorMessage
        component={"div"}
        name={name}
        className={"form_input-error"}
      />
    </div>
  );
};

export default TextField;
