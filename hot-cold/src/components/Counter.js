import React from 'react'
import Guess from './Guess'
import './Counter.css'
//this function will increase the counter once new game is initiailatzed and after each guess is submitted

export default function Counter(props) {
    return (
        <p>
            Guess #<span id="count">{props.count}</span>!
        </p>
    );
}