export interface PresenterProps {
  input: any;
  output: (value: any) => void;
}

export interface LabelValue {
  value: string;
  label: string;
}

export interface StringMap {
  [key: string]: any;
}
