import './Card.css'
import React from 'react';

export default function Card(props) {

  return (
        <div className="container">
          <div className="imagem">
            <div>
              <div>
                <img src={props.avatar} alt='Avatar'/>
              </div>
            </div>
          </div>
    <div className="container-texto">
      <h3>{props.nome}</h3>
      <div>
        RA: {props.ra}
      </div>
      <div>
        Curso: {props.codCurso}
      </div>
    </div>
  </div>
  );
}