export default function RootLoading() {
  return (
    <div className="flex w-full items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dark-4 border-t-primary-500" />
        <p className="text-small-regular text-light-3">Loading...</p>
      </div>
    </div>
  );
}