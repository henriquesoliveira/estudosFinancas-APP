import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'

import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'

import { mensagemAlerta, mensagemErro, mensagemSucesso } from '../../components/toastr'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class ConsultaLancamento extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipoLancamento: '',
        lancamentos: [],
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar:{}
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
                const lista = response.data;
                
                if(lista.length < 1){
                    mensagemAlerta('Nenhum resultado encontrado!')
                }

                this.setState({ lancamentos: lista })
            }).catch(err => {
                mensagemErro(err.response)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamento/${id}`)
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);

                this.setState({ lancamentos:lancamentos, showConfirmDialog:false })

                mensagemSucesso('Lançamento excluido com sucesso')
            }).catch(err => {
                mensagemErro('Ocorreu um erro ao tentar excluir registro:' + err.response)
            })
    }

    alterarStatus = (lancamento, status) =>{
        this.service.alterarStatus(lancamento.id, status)
        .then(response =>{
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(lancamento);

            if(index !== -1){
                lancamento['status'] = status;
                lancamentos[index] = lancamento;
                this.setState({lancamento})
            }

            mensagemSucesso('Status atualizado com Sucesso')
        }).catch(err =>{
            mensagemErro(err.response.data)
        })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamento')
    }

    abrirConfirmacao = (lancamento) =>{
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento })
    }

    cancelarExclusao = () =>{
        this.setState({showConfirmDialog: false, lancamentoDeletar: {}})
    }

    render() {
        const listaMes = this.service.obterListaMeses();

        const listaTipoLancamento = this.service.obterListaTiposLancamentos();

        const confirmDialogfooter = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Não" icon="pi pi-times" className="p-button-warning" onClick={this.cancelarExclusao} />
            </div>
        );


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

                            <button onClick={this.buscar} type="button" className="btn btn-success"><i className="pi pi-search"></i> Buscar</button>
                            <button onClick={this.preparaFormularioCadastro} type="button" className="btn btn-danger"><i className="pi pi-plus"></i> Cadastrar</button>

                        </div>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos}
                                deleteAction={this.abrirConfirmacao}
                                editAction={this.editar} 
                                alterarStatus={this.alterarStatus}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmar Exclusão" 
                    visible={this.state.showConfirmDialog} 
                    footer={confirmDialogfooter}
                    style={{ width: '50vw' }} 
                                        onHide={() => this.setState({showConfirmDialog: false})}>
                        <p>Confirma a exclusão deste Lançamento?</p>
                    </Dialog>
                </div>
            </Card>
        )
    }


}

export default withRouter(ConsultaLancamento);