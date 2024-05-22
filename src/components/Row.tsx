export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Row({ children, ...props }: RowProps) {
  return (
    <div className="grid grid-cols-4 gap-px" {...props}>
      {children}
    </div>
  );
}
