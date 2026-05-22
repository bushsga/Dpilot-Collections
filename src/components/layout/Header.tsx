'use client';

import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'white',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <button
        onClick={() => {
          alert('BUTTON WORKS');
          setOpen(!open);
        }}
        style={{
          padding: '20px',
          background: 'red',
          color: 'white',
          fontSize: '18px',
        }}
      >
        MENU
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: 0,
            width: '250px',
            height: '300px',
            background: 'black',
            color: 'white',
            zIndex: 999999,
          }}
        >
          MENU OPEN
        </div>
      )}
    </div>
  );
}