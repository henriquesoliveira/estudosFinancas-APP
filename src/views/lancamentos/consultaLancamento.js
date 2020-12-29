import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'

import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'

import { mensagemErro, mensagemSucesso } from '../../components/toastr'

class ConsultaLancamento extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipoLancamento: '',
        lancamentos: [],
        descricao: ''
    }

    constructor() {
        super();
        this.service = new LancamentoService();

    }

    buscar = () => {

        if (!this.state.ano) {
            mensagemErro('O campo Ano é obrigatório!')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipoLancamento: this.state.tipoLancamento,
            usuario: usuarioLogado.id,
            descricao: this.state.descricao
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(response => {
                this.setState({ lancamentos: response.data })
            }).catch(err => {
                mensagemErro(err.response)
            })
    }

    editar = (id) => {
        console.log('editando', id);
    }

    deletar = (lancamento) => {
        this.service
        .deletar(lancamento.id)
        .then(response =>{
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(lancamento);
            lancamentos.splice(index, 1);
            
            this.setState(lancamentos)
            
            mensagemSucesso('Lançamento excluido com sucesso')
        }).catch(err =>{
            mensagemErro('Ocorreu um erro ao tentar excluir registro:' + err.response)
        })
    }

    render() {
        const listaMes = this.service.obterListaMeses();

        const listaTipoLancamento = this.service.obterListaTiposLancamentos();


        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup label="Ano: *" htmlFor="inputAno">
                                <input type="text"
                                    className="form-control"
                                    value={this.state.ano}
                                    onChange={e => this.setState({ ano: e.target.value })}
                                    id="inputAno"
                                    placeholder="Digite o Ano" />
                            </FormGroup>

                            <FormGroup label="Mês: *" htmlFor="inputMes">
                                <SelectMenu id="inputMes"
                                    className="form-control"
                                    lista={listaMes} value={this.state.mes}
                                    onChange={e => this.setState({ mes: e.target.value })} />
                            </FormGroup>

                            <FormGroup label="Descrição: " htmlFor="inputDescricao">
                                <input type="text"
                                    className="form-control"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                    id="inputDescricao"
                                    placeholder="Digite a Descrição" />
                            </FormGroup>

                            <FormGroup label="Tipo Lançamento: " htmlFor="inputTipoLancamento">
                                <SelectMenu id="inputTipoLancamento"
                                    className="form-control"
                                    lista={listaTipoLancamento}
                                    value={this.state.tipoLancamento}
                                    onChange={e => this.setState({ tipoLancamento: e.target.value })} />
                            </FormGroup>

                            <button onClick={this.buscar} type="button" className="btn btn-success">Buscar</button>
                            <button type="button" className="btn btn-danger">Cadastrar</button>

                        </div>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos}
                                deleteAction={this.deletar}
                                editAction={this.editar} />
                        </div>
                    </div>
                </div>
            </Card>
        )
    }


}

export default withRouter(ConsultaLancamento);