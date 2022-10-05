import './CrudAluno.css';
import React, { Component } from 'react';
import Main from './template/Main';
import axios from 'axios'

const title = "Cadastro de Alunos";

const urlApiAluno = "http://localhost:5041/api/Aluno";
const urlApiCurso = "http://localhost:5041/api/Curso";
const initialState = {
    aluno: {id: 0, ra: '', nome: '', codCurso: '', 
        toString() {
            return this.ra + " / " + this.nome
    }},
    lista: [],
    cursoAtual: {id: 0, codCurso: '', nomeCurso: '', periodo: ''},
    cursos:[]
}

export default class CrudAluno extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(urlApiAluno).then(resp => {
            this.setState({ lista: resp.data })
        })
        axios(urlApiCurso+"/CursoTodos").then(resp => {
            this.setState({ cursos: resp.data })
        })
        if(this.state.aluno == null) {
            axios(urlApiCurso+"/"+this.state.aluno.codCurso).then(resp => {
                console.log("resp: "+resp.data)
                this.setState({ cursos: resp.data })
            })
        }
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
    }

    salvar() {
        const aluno = this.state.aluno;
        aluno.codCurso = Number(aluno.codCurso);
        const metodo = aluno.id ? 'put' : 'post';
        const url = aluno.id ? `${urlApiAluno}/${aluno.id}` : urlApiAluno;
        
        axios[metodo](url, aluno)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ aluno: initialState.aluno, lista})
            })
    }

    getListaAtualizada(aluno, add = true) {
        const lista = this.state.lista.filter(a => a.id !== aluno.id);
        if(add) lista.unshift(aluno);
        return lista;
    }

    atualizaCampo(event) {
        // clonar usuário a partir do state, para não alterar o state diretamente
        const aluno = { ...this.state.aluno };
        // usar o atributo NAME do input identificar o campo a ser atualizado
        aluno[event.target.name] = event.target.value;
        // atualizar o state
        this.setState({ aluno })
    }

    carregar(aluno) {
        this.setState({ aluno })
    }

    remover(aluno) {
        const url = urlApiAluno + "/" + aluno.id
        if (window.confirm(`Confirma remoção do aluno ${aluno.ra} `)) {

            axios['delete'](url, aluno)
                .then(resp => {
                    const lista = this.getListaAtualizada(aluno, false);
                    this.setState({ aluno: initialState.aluno, lista})
                })
        }
    }

    renderForm() {
        return (
            <div className="inclui-container">
                <label> RA: </label>
                <input
                    type="text"
                    id="ra"
                    placeholder="RA do aluno"
                    className="form-input"
                    name="ra"
                    
                    value={this.state.aluno.ra}
                    
                    onChange={ e => this.atualizaCampo(e)}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do aluno"
                    className="form-input"
                    name="nome"
                    
                    value={this.state.aluno.nome}
                    
                    onChange={ e => this.atualizaCampo(e)}
                />
                <label for="listaCursos"> Curso: </label>
                <select className='dropdown'id='curso'>
                    {<option defaultValue={"Selecione um curso"} className='optionValue'>Selecione um curso</option>} +
                    {this.state.cursos.map( (curso) => 
                        <option key={curso.id} value={curso.nomeCurso} className='optionValue'>{curso.nomeCurso + " - " + curso.periodo}</option>
                    )}
                </select>
                <button className="btnSalvar"
                    onClick={e => this.salvar(e)} >
                        Salvar
                </button>
                <button className="btnCancelar"
                    onClick={e => this.limpar(e)} >
                        Cancelar
                </button>
            </div>
        )
    }

    renderTable() {
        return (
            <div className="listagem">
                <table className="listaAlunos" id="tblListaAlunos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloRa">Ra</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloCurso">Curso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lista.map(
                            (aluno) =>
                            <tr key={aluno.id}>
                                <td>{aluno.ra}</td>

                                <td>{aluno.nome}</td>

                                <td>{aluno.codCurso}</td>
                                <td>
                                    <button onClick={() => this.carregar(aluno)}>
                                        Altera
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => this.remover(aluno)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        return (
            <Main title={title}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}