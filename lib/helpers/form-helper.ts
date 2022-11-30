import { useForm } from 'react-hook-form';

const useHookForm = (defaultValues: any = {}) => {
  const form = useForm({defaultValues});
  const formHandle = { register: form.register, control: form.control, errors: form.formState.errors };
  const handles = { handleSubmit: form.handleSubmit, reset: form.reset, getValues: form.getValues, setValue: form.setValue, formState: form.formState };
  return {...handles, formHandle};
};

export default useHookForm;