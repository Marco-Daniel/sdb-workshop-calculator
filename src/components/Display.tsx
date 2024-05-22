export default function Display({ value }: { value: number }) {
  return (
    <div className="flex flex-col p-2 h-24 justify-between">
      <div className="flex flex-row w-full space-x-1">
        <div className="size-3 rounded-md bg-red-400" />
        <div className="size-3 rounded-md bg-orange-400" />
        <div className="size-3 rounded-md bg-green-400" />
      </div>
      <span className="self-end text-white text-4xl">{value}</span>
    </div>
  );
}
