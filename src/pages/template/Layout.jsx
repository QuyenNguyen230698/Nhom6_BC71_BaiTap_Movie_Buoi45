import React from 'react';
import Header from '../../components/Header';

export default function Layout({ content }) {
  return (
    <div className='bg-layout h-full'>
      <Header />
      {content}
    </div>
  );
}
