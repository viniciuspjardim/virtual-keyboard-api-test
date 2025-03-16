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

const contentArray = Array.from(Array(0).keys());

const useVirtualKeybaordBounds = () => {
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    if ('virtualKeyboard' in navigator) {
      console.log('useVirtualKeybaord: has VirtualKeyboard API');

      navigator.virtualKeyboard.overlaysContent = true;

      const getGeometryChange = (event: VirtualKeyboardGeometryChangeEvent) => {
        const { x, y, width, height } = event.target.boundingRect;
        setBounds({ x, y, width, height});
      }
      
      navigator.virtualKeyboard.addEventListener("geometrychange", getGeometryChange);

      return () => {
        console.log('useVirtualKeybaord: cleanup');
        navigator.virtualKeyboard.overlaysContent = false;
        navigator.virtualKeyboard.removeEventListener("geometrychange", getGeometryChange);
      };
    }
    console.log('useVirtualKeybaord: no VirtualKeyboard API');
  }, []);

  return bounds;
};

export default function Home() {
  const keyboardBounds = useVirtualKeybaordBounds();

  console.log('keyboardBounds 1:', { keyboardBounds })

  return (
    /* Page container 100 dvh (100% of the dynamic view height) */
    <div className="h-dvh flex flex-col text-neutral-900">
      {/* Header */}
      <div className="bg-red-200 h-20 p-2 shrink-0">
        Header (should always be visible)
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto bg-blue-100 p-2 flex-grow">
        {contentArray.map((item) => (
          <p className="py-4" key={item}>
            Scrollable content {item}
          </p>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-green-100 p-2 shrink-0">
        <div>Footer (should always be visible)</div>
        <textarea className="border border-neutral-800 w-full" />
      </div>

      {/* Keyboard placeholder, it will grow to take virtual keyboard space when it appears */}
      <div className="bg-purple-500 shrink-0" style={{ height: `${keyboardBounds.height}px` }} />
    </div>
  );
}
