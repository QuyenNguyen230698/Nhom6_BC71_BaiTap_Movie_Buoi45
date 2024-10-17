import React,{useEffect, useState} from 'react'
import { http } from '../../services/config';
import { movieService } from '../../services/movieService';
import {useParams} from 'react-router-dom';

export default function BookingPage() {
    let [chair, setchair] = useState({});
    let params = useParams();
    let { id } = params;
    useEffect(() => {
        movieService.getBookTicket(id)
        .then((result) => {
            setchair(result.data.content)
        }).catch((err) => {
            
        });
    }, []);
    let renderBookChair = () => {
        console.log('chair', chair);
    }
  return (
    <div className='pt-20'>
    BookingPage
    {renderBookChair()}
    </div>
  )
}
