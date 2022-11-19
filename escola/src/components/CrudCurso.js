import './CrudCurso.css';
import React, { Component } from 'react';
import Main from './template/Main';
import axios from 'axios'

const title = "Cadastro de Cursos";

const urlApi = "http://localhost:5041/api/curso";
const initialState = {
    curso: {id: 0, codCurso: '', nomeCurso: '', periodo: '', 
        toString() {
            return this.codCurso + " / " + this.nomeCurso
    }},
    lista: []
}

export default class CrudAluno extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(urlApi+"/CursoTodos").then(resp => {
            this.setState({ lista: resp.data })
        })
    }

    limpar() {
        this.setState({ curso: initialState.curso });
    }

    async salvar() {
        const curso = this.state.curso;
        curso.codCurso = Number(curso.codCurso);
        const metodo = curso.id ? 'put' : 'post';
        const url = curso.id ? `${urlApi}/Put/${curso.id}` : `${urlApi}/Post/`; 
        
        try{
            if(this.state.cursoAtual === ''){
                window.confirm(`Selecione um curso !`)
                return;
            }
            if(this.state.periodoAtual === ''){
                window.confirm(`Selecione um Período !`)
                return;
            }

            await axios[metodo](url, curso)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ curso: initialState.curso, lista})
            })
        } catch {
            window.confirm(`Curso inválido ! Verifique se esse curso existe nesse período`)
        }
    }

    getListaAtualizada(curso, add = true) {
        const lista = this.state.lista.filter(c => c.id !== curso.id);
        if(add) lista.unshift(curso);
        return lista;
    }

    atualizaCampo(event) {
        // clonar usuário a partir do state, para não alterar o state diretamente
        const curso = { ...this.state.curso };
        // usar o atributo NAME do input identificar o campo a ser atualizado
        curso[event.target.name] = event.target.value;
        // atualizar o state
        this.setState({ curso })
    }

    carregar(curso) {
        this.setState({ curso })
    }

    remover(curso) {
        const url = urlApi + "/Delete/" + curso.id
        if (window.confirm(`Confirma remoção do Curso: ${curso.nomeCurso} - ${curso.id} `)) {
            console.log("entrou no confirm " + url);

            axios['delete'](url, curso)
                .then(resp => {
                    const lista = this.getListaAtualizada(curso, false);
                    this.setState({ curso: initialState.curso, lista})
            })
        }
    }

    renderForm() {
        return (
            <div className="inclui-container">
                <label> Código: </label>
                <input
                    type="number"
                    id="codCurso"
                    placeholder="Código do curso"
                    className="form-input"
                    name="codCurso"
                    
                    value={this.state.curso.codCurso}
                    
                    onChange={ e => this.atualizaCampo(e)}
                />
                <label> Nome: </label>
                <input
                    type="text"
                    id="nomeCurso"
                    placeholder="Nome do Curso"
                    className="form-input"
                    name="nomeCurso"
                    
                    value={this.state.curso.nomeCurso}
                    
                    onChange={ e => this.atualizaCampo(e)}
                />
                <label> Período: </label>
                <input
                    type="text"
                    id="periodo"
                    placeholder="M/V/N"
                    className="form-input"
                    name="periodo"
                    
                    value={this.state.curso.periodo}
                    onChange={ e => this.atualizaCampo(e)}
                />
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
                            <th className="tabTituloRa">Código</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloCurso">Período</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lista.map(
                            (curso) =>
                            <tr key={curso.id}>
                                <td>{curso.codCurso}</td>

                                <td>{curso.nomeCurso}</td>

                                <td>{curso.periodo}</td>
                                <td>
                                    <button onClick={() => this.carregar(curso)}>
                                        Altera
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => this.remover(curso)}>
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