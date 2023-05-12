import { Field } from "formik";
import React from "react";

import { ReactComponent as Close } from "assets/icons/close.svg";

interface IPropertyTextField {
  typeName: string;
  valueName: string;
  remove?: <T>() => T;
}

const PropertyTextField: React.FC<IPropertyTextField> = ({
  typeName,
  valueName,
  remove,
}) => {
  return (
    <div className="property_textfield">
      <div>
        <p>Type</p>
        <Field name={typeName} placeholder="Character" />
      </div>
      <div>
        <p>Name</p>
        <Field name={valueName} placeholder="Male" />
      </div>
      <div className="close">
        <div onClick={remove ? () => remove() : undefined}>
          <Close />
        </div>
      </div>
    </div>
  );
};

export default PropertyTextField;
