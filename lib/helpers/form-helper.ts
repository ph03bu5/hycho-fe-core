import { useForm } from 'react-hook-form';

const useHookForm = () => {
  const form = useForm();
  const formHandle = { register: form.register, control: form.control, errors: form.formState.errors };
  return {...form, formHandle};
};

export default useHookForm;