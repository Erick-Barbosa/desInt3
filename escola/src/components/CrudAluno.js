import './CrudAluno.css';
import React, { Component } from 'react';
import Main from './template/Main';
import axios from 'axios'

const title = "Cadastro de Alunos";

const urlApiAluno = "http://localhost:5041/api/Aluno";
const urlApiCurso = "http://localhost:5041/api/Curso";
const initialState = {
    aluno: {id: 0, ra: '', nome: '', codCurso: '', avatar: '',
        toString() {
            return this.ra + " / " + this.nome
    }},
    lista: [],
    cursoAtual: '',
    periodoAtual: '',
    cursoSalvo: {id: 0, codCurso: '', nomecurso: '', periodo: '',
        toString() {
            return this.codCurso + " - " + this.nomecurso + " / " + this.periodo
    }},
    cursos:[]
}

export default class CrudAluno extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(urlApiAluno+"/GetAll").then(resp => {
            this.setState({ lista: resp.data })
        })
        axios(urlApiCurso+"/CursoTodos").then(resp => {
            this.setState({ cursos: resp.data })
        })
    }

    setCursoAtual() {
        var opcaoCurso = document.getElementById('curso');
	    var cursoSelecionado = opcaoCurso.options[opcaoCurso.selectedIndex].text;
        this.setState({ cursoAtual: cursoSelecionado})
    }

    setPeriodoAtual() {
        var opcaoPeriodo = document.getElementById('periodo');
        var periodoSelecionado = opcaoPeriodo.options[opcaoPeriodo.selectedIndex].text;
        this.setState({ periodoAtual: periodoSelecionado })
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
        var opcaoPeriodo = document.getElementById('periodo');
        opcaoPeriodo.selectedIndex = 0;

        var opcaoCurso = document.getElementById('curso');
        opcaoCurso.selectedIndex = 0
    }

    async salvar() {
        const aluno = this.state.aluno;
        const metodo = aluno.id ? 'put' : 'post';
        const url = aluno.id ? `${urlApiAluno}/Put/${aluno.id}` : urlApiAluno+"/Post/";

        if(!this.alunoIsValid(aluno))
            return;

        try{
            if(this.state.cursoAtual === ''){
                window.confirm(`Selecione um curso !`)
                return;
            }
            if(this.state.periodoAtual === ''){
                window.confirm(`Selecione um Período !`)
                return;
            }
            await axios(
                urlApiCurso+
                "/CursoByNomeAndPeriodo/"
                +this.state.cursoAtual+"/"
                +this.state.periodoAtual
                ).then(resp => {
                    aluno.codCurso = resp.data[0].codCurso
            })

            await axios[metodo](url, aluno)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ aluno: initialState.aluno, lista})
            })
        } catch {
            window.confirm(`Curso inválido ! Verifique se esse curso existe nesse período`)
        }
    }

    alunoIsValid(aluno) {
        if(aluno.nome === ''){
            window.confirm(`O nome do aluno deve ser preenchido !`)
            return false;
        }
        if(aluno.ra === ''){
            window.confirm(`O RA do aluno deve ser preenchido !`)
            return false;
        }
        if(aluno.ra.length !== 5){
            window.confirm(`Insira um RA válido !`)
            return false;
        }
        return true
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
        axios(urlApiCurso+"/CursoByCod/"+aluno.codCurso).then(resp => {
            this.setState({ 
                cursoAtual: resp.data[0].nomeCurso,
                periodoAtual: resp.data[0].periodo
            })
        
            var opcaoPeriodo = document.getElementById('periodo');
            opcaoPeriodo.value = resp.data[0].periodo;

            var opcaoCurso = document.getElementById('curso');
            opcaoCurso.value = resp.data[0].nomeCurso
        })
        
        this.setState({ aluno })
    }

    remover(aluno) {
        const url = urlApiAluno + "/Delete/" + aluno.id
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
                    minLength={5}
                    maxLength={5}
                    
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
                <select className='dropdown' id='curso' onChange={teste => this.setCursoAtual(teste)}>
                    {<option 
                        defaultValue={"Selecione um Curso"} 
                        className='optionValue'
                        hidden>
                        Selecione um Curso
                    </option>} +    
                    {this.state.cursos.map( (curso) => 
                        <option key={curso.id} value={curso.nomeCurso} className='optionValue'>{curso.nomeCurso}</option>
                    )}
                </select>

                <label for="listaCursos"> Periodo: </label>
                <select className='dropdown'id='periodo' onChange={teste => this.setPeriodoAtual(teste)}>
                    <option 
                        defaultValue={"Selecione um Periodo"} 
                        className='optionValue'
                        hidden>
                        Selecione um Periodo
                    </option>
                    <option key={1} value='M' className='optionValue'>M</option>
                    <option key={2} value='V' className='optionValue'>V</option>
                    <option key={3} value='N' className='optionValue'>N</option>
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