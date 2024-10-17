import React from 'react'
import Header from '../../components/Header'

export default function Layout({content}) {
  return (
    <div>
        <Header/>
        {content}
    </div>
  )
}
