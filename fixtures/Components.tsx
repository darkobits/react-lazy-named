import React from 'react';

export function First() {
  return (
    <div>First</div>
  );
}

First.Second = () => {
  return (
    <div>Second</div>
  );
};

export const NotAComponent = false;
