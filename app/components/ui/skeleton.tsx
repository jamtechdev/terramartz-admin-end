import { HTMLAttributes } from 'react';

const Skeleton = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
};

export { Skeleton };