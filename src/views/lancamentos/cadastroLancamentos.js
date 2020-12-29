import React from 'react'
import { withRouter } from 'react-router-dom'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import { mensagemErro, mensagemSucesso } from '../../components/toastr'

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        valor: '',
        tipoLancamento: '',
        usuario: null,
        status: '',
        atualizando: false
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params

        if (params.id) {
            this.service.obterLancamentoPorId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true })
                }).catch(err => {
                    mensagemErro(err.response.data)
                })
        }
    }

    submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const { descricao, ano, mes, valor, tipoLancamento } = this.state
        const lancamento = { descricao, ano, mes, valor, tipoLancamento, usuario: usuarioLogado.id };
        try {
            this.service.validar(lancamento)
        } catch (error) {
            const erros = error.mensagens;
            erros.forEach(element => {
                mensagemErro(element);
            });
            return false;
        }

        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamento')
                mensagemSucesso('Lançamento cadastrado com sucesso!');
            }).catch(err => {
                mensagemErro(err.response.data)
            })
    }

    atualizar = () => {
        const { descricao, ano, mes, valor, tipoLancamento, id, usuario, status } = this.state
        const lancamento = { descricao, ano, mes, valor, tipoLancamento, id, usuario, status };

        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamento')
                mensagemSucesso('Lançamento atualizado com sucesso!');
            }).catch(err => {
                mensagemErro(err.response.data)
            })
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    render() {

        const tipos = this.service.obterListaTiposLancamentos();
        const meses = this.service.obterListaMeses();

        return (
            <Card title={this.state.atualizando ? "Atualizando Lançamento" : "Cadastro de Lançamento"}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao" type="text" className="form-control"
                                name="descricao"
                                value={this.state.descricao}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" type="text" className="form-control"
                                name="ano"
                                value={this.state.ano}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" lista={meses} className="form-control"
                                name="mes"
                                value={this.state.mes}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" type="text" className="form-control"
                                name="valor"
                                value={this.state.valor}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo Lançamento: *">
                            <SelectMenu id="inputTipoLancamento" lista={tipos} className="form-control"
                                name="tipoLancamento"
                                value={this.state.tipoLancamento}
                                onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: ">
                            <input id="inputStatus" type="text" className="form-control"
                                name="status"
                                value={this.state.status}
                                disabled />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {this.state.atualizando ? (
                            <button className="btn btn-success" onClick={this.atualizar}>
                                <i className="pi pi-refresh"></i>Atualizar</button>
                        ) : (
                                <button className="btn btn-success" onClick={this.submit}>
                                    <i className="pi pi-save"></i>Salvar</button>
                            )
                        }
                        <button className="btn btn-danger" onClick={e => this.props.history.push('/consulta-lancamento')}>
                        <i className="pi pi-times"></i>Cancelar</button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos)