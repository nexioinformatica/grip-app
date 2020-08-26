export type Item<K, T> = {
  key: K;
  value: T;
  label: string;
};

export type ListItem<T> = {
  value: T;
  title: string;
  description?: string;
  left?: (props: {
    color: string;
    style: {
      marginLeft: number;
      marginRight: number;
      marginVertical?: number | undefined;
    };
  }) => React.ReactNode;
};
