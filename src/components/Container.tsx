export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-px bg-neutral-800 rounded overflow-hidden shadow-md">
      {children}
    </div>
  );
}
