'use client';

const contentArray = Array.from(Array(50).keys());

export default function Home() {
  console.log('Home');

  return (
    /* Page container 100dvh (100% of the dynamic viewport height) */
    <div className="flex h-dvh flex-col text-lg text-neutral-900">
      {/* Header */}
      <div className="h-16 shrink-0 bg-red-100 p-2">
        Header (should always be visible)
      </div>

      {/* Scrollable content (takes available height) */}
      <div className="flex-grow overflow-y-auto bg-blue-100 p-2">
        {contentArray.map((item) => (
          <p className="py-2" key={item}>
            Scrollable content {item}
          </p>
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0 bg-green-100 p-2">
        <div>Footer (should always be visible)</div>
        <textarea className="w-full border border-neutral-800 bg-white px-2 py-1" />
      </div>
    </div>
  );
}
