import React, { ReactElement } from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { v4 as getUuid } from 'uuid';
import '../../../scss/anchors-input.scoped.scss';

type InputType = 'text'|'number'|'date'|'password'|'email'|'radio'|'check'|'checkbox'|'select'|'selectbox'|'combobox'|'textarea';

function FormElement({id, type, formHandle, regOption, data, rows, placeholder, onChange, readOnly = false, disabled = false, error}: any) {
  const uuid = getUuid();
  const { control, register } = formHandle;

  const _onChange = (e: any, fieldOnChange?: any) => {
    const value = e.target.value;
    !!onChange && onChange(value);
    !!fieldOnChange && fieldOnChange(value);
  };

  const _onChangeCheck = (e: any, field: any) => {
    const value = e.target.value;
    const checked = !!field.value && Array.isArray(field.value) && field.value.includes(value);
    const nextValue = checked !== true ? [...(field.value || []), value] : [...(field.value || []).filter((v: any) => v !== value)];
    !!onChange && onChange(nextValue);
    field.onChange(nextValue);
  };

  let el: ReactElement;
  switch(type) {
    case 'radio':
      el = <Controller name={id} control={control} render={({field}) => <>
        {data?.map((row: any) => {
          return (
            <Form.Check inline key={`rad_${uuid}_${id}_${row.value}`} label={row.label} name={field.name} type="radio" value={row.value} checked={field.value === row.value} onChange={e => _onChange(e, field.onChange)} disabled={disabled}/>
          )})}
      </>} />;
      break;

    case 'check':
    case 'checkbox':
      el = <Controller name={id} control={control} render={({field}) => <>
        {data?.map((row: any) => {
          return (
            <Form.Check inline key={`chk_${uuid}_${id}_${row.value}`} label={row.label} name={field.name} type="checkbox" value={row.value} checked={Array.isArray(field.value) && field.value?.includes(row.value) === true} onChange={e => _onChangeCheck(e, field)} disabled={disabled}/>
          )})}
      </>} />;
      break;

    case 'select':
    case 'selectbox':
    case 'combobox':
      el = <Controller name={id} control={control} render={({field}) =>
        <Form.Select disabled={disabled} onChange={e => _onChange(e, field.onChange)} value={field.value} >
          {data?.map((row: any) => <option key={`sel_${uuid}_${id}_${row.value}`} value={row.value}>{row.label ?? row.value}</option>)}
        </Form.Select>} />;
      break;

    case 'textarea':
      // eslint-disable-next-line react/jsx-props-no-spreading
      el = <Form.Control as="textarea" rows={rows} {...register(id, regOption)} readOnly={readOnly} onChange={e => _onChange(e)} />;
      break;

    default:
      // eslint-disable-next-line react/jsx-props-no-spreading
      el = <Form.Control type={type} placeholder={placeholder} autoComplete="off" {...register(id, regOption)}
                         readOnly={readOnly} onChange={e => _onChange(e)} isInvalid={!!error} />;
      break;

  }

  return el;
};

interface AnchorsInputProps {
  id: string;
  type: InputType;
  data?: { label: string, value: number|string }[];
  rows?: number;
  formHandle: { register: any, control: any, errors: any };
  options?: any;
  onChange?: any;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  errorMessages?: {[key:string]: string}};

function AnchorsInput({ id, type = 'text', data = [], rows = 4, placeholder, label, className,
                        formHandle, options, onChange, errorMessages,
                        required = false, readOnly = false, disabled = false }: AnchorsInputProps) {
  const regOptions = {...(options || {}), required: required ?? false};
  const [ formId ] = React.useState(id || getUuid());
  const ph = placeholder || label || '';
  const error = formHandle?.errors[formId];

  return (
    <Form.Group className={`anchors-form ${className}`}>
      {!!label && <Form.Label className="form-label">{label}</Form.Label>}
      <FormElement id={formId} type={type} data={data} rows={rows}
                   label={label} placeholder={ph} className={className}
                   formHandle={formHandle} regOption={regOptions} onChange={onChange}
                   readOnly={readOnly} disabled={disabled} error={error} />
      <Form.Control.Feedback type="invalid" className="error-message">{errorMessages ? errorMessages[error?.type] : ''}</Form.Control.Feedback>
    </Form.Group>
  );
};

AnchorsInput.defaultProps = {
  data: [],
  rows: 0,
  options: {},
  onChange: null,
  label: '',
  placeholder: '',
  className: '',
  required: false,
  readOnly: false,
  disabled: false,
  errorMessages: {},
};

export default AnchorsInput;
