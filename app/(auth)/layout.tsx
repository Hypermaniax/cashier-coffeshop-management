export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center flex-col justify-center">
      <div className="flex flex-col items-center mb-6 ">
        <h1 className="text-3xl font-bold">Kopi Nusantara</h1>
        <p className="text-xl text-gray-500">
          A simple coffee shop management system
        </p>
      </div>
      <div className="items-center gap-5 flex-col flex">{children}</div>
    </div>
  );
}
