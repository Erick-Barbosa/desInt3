import React, { Component } from 'react';
import axios from 'axios'
import Card from './template/Card'
import './Carometro.css'
import Main from './template/Main';

const title = "Carômetro";

const urlApiAluno = "http://localhost:5041/api/Aluno";
const urlApiCurso = "http://localhost:5041/api/Curso";
const initialState = {
    aluno: {id: 0, ra: '', nome: '', codCurso: '', avatar: '',
        toString() {
            return this.ra + " / " + this.nome
    }},
    lista: [],
    cursos: [],
    cursoAtual: '',
    avatar: ''
}

export default class Carometro extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(urlApiCurso+"/CursoTodos").then(resp => {
            this.setState({ cursos: resp.data })
        })
    }

    async setCursoAtual() {
        var opcaoCurso = document.getElementById('curso');
	    var cursoSelecionado = opcaoCurso.options[opcaoCurso.selectedIndex].value;
        await this.setState({ cursoAtual: cursoSelecionado})

        axios(urlApiAluno+"/GetByCodCurso/" + this.state.cursoAtual).then(resp => {
            this.setState({ lista: resp.data })
        })
    }

    renderSelect() {
        return (
            <>
                <label for="listaCursos"> Selecione o curso: </label>
                <select className='dropdown' id='curso' onChange={curso => this.setCursoAtual(curso)}>
                    {<option 
                        defaultValue={"Selecione um Curso"} 
                        className='optionValue'
                        hidden>
                        Cursos 
                    </option>}
                    {this.state.cursos.map((curso) => 
                        <option value={curso.codCurso}>{curso.nomeCurso} - {curso.codCurso}</option>
                    )} 
                </select>
            </>
        )
    }

    renderListaCards() {
        return (
            <div>
            {this.state.lista.map(
                (aluno) => <Card {...aluno}/>
            )}
            </div>
        )
    }

    render() {
        return (
        <Main title={title}>
            {this.renderSelect()}
            {this.renderListaCards()}
        </Main>
        )
    }
}