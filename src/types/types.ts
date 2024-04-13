import { Card } from '@/components/ui/card';

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ParamsType = Record<string, string>;
export type KeyValueMethod = {
  key: string;
  value: string;
};
export type ResInfoType = {
  status: string;
  time: string;
  size: string;
};
export type CardProps = React.ComponentProps<typeof Card>;
