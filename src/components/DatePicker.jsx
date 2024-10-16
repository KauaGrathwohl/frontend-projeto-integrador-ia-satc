import { DatePicker as DatePickerAntd } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';

export const DateFnsPicker = DatePickerAntd.generatePicker(dateFnsGenerateConfig);

export default function DatePicker(props) {
  const nProps = {
    format: 'dd/MM/yyyy',
    locale: 'pt-BR',
    style: { width: '100%' },
    ...props,
  };

  if (typeof props.value === 'string') {
    nProps.value = new Date(props.value);
  }

  return (
    <DateFnsPicker {...nProps} />
  );
}