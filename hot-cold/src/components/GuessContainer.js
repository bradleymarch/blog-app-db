import React from 'react';

import Guess from './Guess';
import './GuessContainer.css'
//import './guess-section.css';

export default function GuessContainer(props) {
    return (
        <section>
            <h2 id="feedback">{props.feedback}</h2>
            <Guess onGuess={props.onGuess} />
        </section>
    );
}