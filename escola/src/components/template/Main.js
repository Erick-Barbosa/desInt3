import React from 'react';
import './Main.css';
import Header from './Header';

export default function Main(props) {
    return (
        <div className="content">
            <Header {...props}/>
            <main>
                <div>
                    {props.children}
                </div>
            </main>
        </div>
    )
}