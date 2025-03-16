'use client'

import React, { useLayoutEffect, useState } from 'react';

declare global {
  interface VirtualKeyboardGeometryChangeEvent {
    target: {
      boundingRect: {
        x: number,
        y: number,
        width: number,
        height: number,
      }
    }
  }

  interface Navigator {
    virtualKeyboard: {
      overlaysContent: boolean
      addEventListener: (eventType: string, fn: (event: VirtualKeyboardGeometryChangeEvent) => void) => void
      removeEventListener: (eventType: string, fn: (event: VirtualKeyboardGeometryChangeEvent) => void) => void
    }
  }
}

const contentArray = Array.from(Array(50).keys());

const useVirtualKeyboardBounds = () => {
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    if ('virtualKeyboard' in navigator) {
      console.log('useVirtualKeyboardBounds: has VirtualKeyboard API');

      navigator.virtualKeyboard.overlaysContent = true;

      const getGeometryChange = (event: VirtualKeyboardGeometryChangeEvent) => {
        const { x, y, width, height } = event.target.boundingRect;
        setBounds({ x, y, width, height});
      }
      
      navigator.virtualKeyboard.addEventListener("geometrychange", getGeometryChange);

      return () => {
        console.log('useVirtualKeyboardBounds: cleanup');
        navigator.virtualKeyboard.overlaysContent = false;
        navigator.virtualKeyboard.removeEventListener("geometrychange", getGeometryChange);
      };
    }
    console.log('useVirtualKeyboardBounds: no VirtualKeyboard API');
  }, []);

  return bounds;
};

export default function Home() {
  const bounds = useVirtualKeyboardBounds();

  console.log('Home - keyboardBounds:', { bounds })

  return (
    /* Page container 100 dvh (100% of the dynamic view height) */
    <div className="h-dvh flex flex-col text-neutral-900 text-lg">
      {/* Header */}
      <div className="bg-red-200 h-16 p-2 shrink-0">
        Header (should always be visible)
      </div>

      {/* Scrollable content (takes available height) */}
      <div className="overflow-y-auto bg-blue-100 p-2 flex-grow">
        {contentArray.map((item) => (
          <p className="py-2" key={item}>
            Scrollable content {item}
          </p>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-green-100 p-2 shrink-0">
        <div>Footer (should always be visible)</div>
        <textarea className="border bg-white border-neutral-800 w-full px-2 py-1" />
      </div>

      {/* Keyboard placeholder, it will grow to take virtual keyboard space when it appears */}
      <div className="bg-purple-500 shrink-0" style={{ height: `${bounds.height}px` }} />
    </div>
  );
}
