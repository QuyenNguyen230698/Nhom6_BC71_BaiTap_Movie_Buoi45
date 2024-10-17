import React from 'react'
import Header from '../../components/Header'
import ListMoviePage from './ListMoviePage'
import TabMoviePage from './TabMoviePage'
import CarouselPage from './CarouselPage'
import SearchPage from '../SearchPage/SearchPage'

export default function HomePage() {
  return (
    <div>
        <CarouselPage/>
        <SearchPage/>
        <ListMoviePage/>
        <TabMoviePage/>
    </div>
  )
}
