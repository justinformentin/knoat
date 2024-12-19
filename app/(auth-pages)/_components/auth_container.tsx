export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full relative items-center justify-center bg-background px-4">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#a9c8f5,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#002357,transparent)]"></div>
      <div className="mx-auto z-10 text-gray-700 w-full max-w-[500px]">
        {children}
      </div>
    </div>
  );
}
