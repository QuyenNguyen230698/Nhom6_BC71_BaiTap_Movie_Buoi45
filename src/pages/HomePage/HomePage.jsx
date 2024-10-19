import React from 'react'
import ListMoviePage from './ListMoviePage'
import TabMoviePage from './TabMoviePage'
import CarouselPage from './CarouselPage'
import SearchPage from '../SearchPage/SearchPage'
import Footer from '../../components/Footer';


export default function HomePage() {
  return (
    <div>
          <CarouselPage />
          <SearchPage />
          <ListMoviePage />
          <TabMoviePage />
          <Footer/>
    </div>
  )
}
