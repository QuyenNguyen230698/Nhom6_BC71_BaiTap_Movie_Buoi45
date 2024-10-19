import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Layout({ content }) {
  return (
    <div>
      <Header />
      {content}
      <Footer/>
    </div>
  );
}
