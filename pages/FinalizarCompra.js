import React from 'react';
import {
  Text,
  ListView,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  Dimensions
} from 'react-native';

import axios from 'axios';
import Server from '../constants/Server';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { Icon } from 'expo';
import ImageCache from '../components/ImageCache';
import Loading from '../components/Loading';
import Input from '../components/Input';

const screenHeight = Dimensions.get('window').height
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class FinalizarCompra extends React.Component {
  static navigationOptions = {
    header: null,

  };
  
  constructor(props){
        super(props);
        this.store = this.props.screenProps.s;
        this.init = this._init.bind(this);
        this.state = {
          ocultar:false,
          pedido:{},
          taxaEntrega: 0,
          entregaIni:0,
          entregaFin:0,
          enderco_array: [],
          endereco:'',
          cep_endereco:''
        };
    }
    

    _init(final){
      let uid = this.store.get_offline('usuario');
      let enderco = uid.data[0].enderco;
      axios.post(Server.host + `/estabelecimento`,{idApp:Server.idApp})
      .then(res=>{
        let data = res.data; 
        data = data.data[0];
        this.setState({
          entregaIni:data.previsao_ini,
          entregaFin: data.previsao_fin,
          taxaEntrega:data.taxa_entrega,
          enderco_array: enderco,
          pedido:final,
          endereco:enderco[0] + "," + enderco[2],
          total:final[0].total,
          loading_activy:true,
          modal_endereco:false,
          outro_modal:false,
          ocultar:true,
        })
      })
    }

    componentDidMount(){
      
    }

    buscar_cep(){
      fetch("https://viacep.com.br/ws/"+this.state.cep+"/json/")
      .then(res=>{
        res = JSON.parse(res['_bodyText']);
        console.log(res)
        let array = [
          res.logradouro,
          res.bairro,
          0,
          0,
          res.localidade
        ];

        this.setState({
          loading:false,
          cep_endereco:res.logradouro,
          cep_bairro: res.bairro,
          cep_cidade:res.localidade,
          enderco_array:array,
        })
      })  
    }

    finalizarPedido(){
      if(this.state.payment == undefined || this.state.payment === ''){
        alert("Selecione a forma de pagamento"); return;
      }
      if(this.state.enderco_array[2] == 0){
        this.state.enderco_array[2]  = this.state.numero_casa;
        this.state.enderco_array[3] = this.state.complemento_casa;
      }
      
      let order = JSON.stringify({
        pedido: this.state.pedido,
        enderco: this.state.enderco_array,
        tipo: this.state.payment,
        taxa_entrega: this.state.taxaEntrega
      })
    
      axios.post(Server.host + `/cart/efetuarPedido`,{idApp:Server.idApp , json:order})
      .then(res=>{

      })
    }

    selectPayment(type = ''){
      if(type === '' || type === undefined) return;
      if(type === "Dinheiro"){
        
      }
      this.setState({
        payment:type
      })
      
    }

    format_dinheiro (numero){
      var numero = numero.toFixed(2).split('.');
      numero[0] = "R$ " + numero[0].split(/(?=(s?:...)*$)/).join('.');
      return numero.join(',');
    }

   
    setar_endereco(){
      if(this.state.numero_casa === '' || this.state.numero_casa === undefined){
        alert("Campo numero esta vazio !"); 
        return;
      }
      this.setState({
        endereco: this.state.cep_endereco+","+ this.state.numero_casa,
        outro_modal:false,
        modal_endereco:false,
      })
    }


    render_modal_endereco(){
      return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modal_endereco}
        onRequestClose={() => {}}>
          <View style={{backgroundColor:'black',opacity:0.6, height:'100%'}}>
          </View>
          {!this.state.outro_modal?
          <View style={{width:'100%', backgroundColor:'#fff', position:'absolute', bottom:0, borderTopLeftRadius:20, borderTopRightRadius:20, shadowOffset:{  width: 1,  height: 1,  },shadowColor: Colors.inputPlaceholder,shadowOpacity: 1.0,}}>
              <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:30, marginTop:-13, zIndex:99}} onPress={()=>{this.setState({modal_endereco: false})}}>
                  <Icon.AntDesign name={"down"} color={{}} color={Colors.buttonlogin} size={20} />
                </TouchableOpacity>
                <View style={{ alignContent:'center'}}>
                  <Text style={{color:'black', fontWeight:'500', alignSelf:'center', marginTop:20}}>ENDEREÇO</Text>
                </View>
              <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:25,marginBottom:10, alignSelf:'center', width:'95%',}}></View>
              <TouchableOpacity style={{ marginBottom:5, marginTop:5,justifyContent:'center'}} onPress={()=>{this._init(this.state.pedido)}}>
                <Text style={{marginLeft:20}}>Minha casa </Text>
                <View style={{ position:'absolute', right:20}} >
                  <Icon.FontAwesome name={"home"} color={Colors.buttonlogin} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:10, alignSelf:'center', width:'95%'}}></View>
              <TouchableOpacity style={{ marginBottom:5, marginTop:5,justifyContent:'center'}} onPress={()=>this.setState({outro_modal:!this.state.outro_modal})}>
                <Text style={{marginLeft:20}}>Outra localidade</Text>
                <View style={{ position:'absolute', right:20}} >
                  <Icon.Feather name={"map-pin"} color={Colors.buttonlogin} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:'15%', alignSelf:'center', width:'95%'}}></View>

          </View>:
           <View style={{width:'100%', backgroundColor:'#fff', height:'80%', position:'absolute', bottom:0, borderTopLeftRadius:20, borderTopRightRadius:20, shadowOffset:{  width: 1,  height: 1,  },shadowColor: Colors.inputPlaceholder,shadowOpacity: 1.0,}}>
                <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:30, marginTop:-13, zIndex:99}} onPress={()=>{this.setState({outro_modal: false})}}>
                  <Icon.AntDesign name={"close"} color={{}} color={Colors.buttonlogin} size={20} />
                </TouchableOpacity>
                <View style={{ alignContent:'center'}}>
                  <Text style={{color:'black', fontWeight:'500', alignSelf:'center', marginTop:20}}>Insira seu CEP</Text>
                </View>
              <View style={{height:200, width:'90%', marginTop:20,alignSelf:'center'}}>
                <Input placeholder={"CEP"}  style={{marginTop:20}} type={"emailAddress"} loading={this.state.loading} value={this.state.cep} onChangeText={(cep)=>{this.setState({cep}) }} />
                <Button onPress={()=>{this.buscar_cep()}} loading={this.state.loading} color={Colors.buttonlogin}><Text style={{color:Colors.text, fontWeight:'bold',  }}>Buscar</Text></Button>
              </View>
              {this.state.cep_endereco != '' ?
              <View style={{marginLeft:'10%', marginTop:'-10%'}}> 
                <Text>Logradouro: {this.state.cep_endereco}</Text>
                <Text>Bairro: {this.state.cep_bairro}</Text>
                <Text>Cidade: {this.state.cep_cidade}</Text>
              </View>:null}
              <View style={{width:'90%', alignSelf:'center'}}>
                {this.state.cep_endereco != ''? <View>
                  <Input placeholder={"Nº"}  type={""} loading={this.state.loading} value={this.state.numero_casa} onChangeText={(numero_casa)=>{this.setState({numero_casa}) }} />
                  <Input placeholder={"Complemento"}   type={"emailAddress"} loading={this.state.loading} value={this.state.complemento_casa} onChangeText={(complemento_casa)=>{this.setState({complemento_casa}) }} />
                  <View style={{ marginTop:'20%'}} >
                  <Button onPress={()=>{this.setar_endereco()}} loading={this.state.loading} color={Colors.buttonlogin}><Text style={{color:Colors.text, fontWeight:'bold',  }}>Selecionar</Text></Button>
                </View>
                </View>:null}
              </View>
           
          </View>}
      </Modal>
      )
    }

    render(){
      if(this.state.ocultar){
        if(!this.state.loading_activy)
          return(
            <ScrollView style={{ width:'100%', backgroundColor:'#fff', height:'100%', paddingBottom:'10%' }}  contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{width:'100%', backgroundColor:Colors.buttonlogin, height:'15%', flexDirection:'column', alignItems:'flex-start', justifyContent:'center'}}>
              <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:'25%', marginTop:-13}} onPress={()=>this.setState({ocultar: false})}>
                  <Icon.AntDesign name={"down"} color={Colors.orage} size={20} />
              </TouchableOpacity>
            </View>
              <Loading/>
            </ScrollView>
          )
        else
        return(
          <ScrollView style={{ width:'100%', backgroundColor:'#fff', height:'100%', paddingBottom:'10%' }}  contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{width:'100%', backgroundColor:Colors.buttonlogin, height:'15%', flexDirection:'column', alignItems:'flex-start', justifyContent:'center'}}>
              <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:'25%', marginTop:-13}} onPress={()=>this.setState({ocultar: false})}>
                  <Icon.AntDesign name={"down"} color={Colors.orage} size={20} />
              </TouchableOpacity>
              <View style={{marginLeft:20, marginTop:'5%'}}>
                <Text style={{color:Colors.orage}}>ENTREGAR EM</Text>
                <TouchableOpacity onPress={()=>{this.setState({modal_endereco:!this.state.modal_endereco})}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>{this.state.endereco} <Icon.AntDesign name={"down"} color={"#fff"} size={10} /></Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{width:'100%', height:250, backgroundColor:'#fff', marginTop:-10, borderTopLeftRadius:10, borderTopRightRadius:10}}>
              <View style={{marginLeft:20}}>
                <Text style={{fontSize:23, fontWeight:'500', marginTop:10}}>{Server.nome}</Text>
                <Text style={{fontSize:14,marginTop:5, color:Colors.inputPlaceholder}}>Previsão de entrega: {this.state.entregaIni} - {this.state.entregaFin} min</Text>
                <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:10, width:'95%'}}></View>
              </View>
              {this.render_modal_endereco()}
              <ListView
                dataSource={ds.cloneWithRows(this.state.pedido[0].pedido)}
                renderRow={(rowData) =>
                  <View style={{marginLeft:20}}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:15, fontWeight:'500'}}>{rowData.quantdade}x {rowData.nome}</Text>
                        <Text style={{position:'absolute', right:20,fontSize:15, fontWeight:'500'}}>{this.format_dinheiro(rowData.valor)}</Text>
                      </View>
                  </View>
                }/>
                <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:10, alignSelf:'center', width:'95%'}}></View>
                <View style={{marginLeft:20}}>
                    <View style={{ flexDirection:'row', alignItems:'center'}}>
                      <Text style={{color:Colors.inputPlaceholder}}>Subtotal</Text>
                      <Text style={{position:'absolute', right:20,color:Colors.inputPlaceholder}}>{this.format_dinheiro(this.state.total)}</Text>
                    </View>
                    <View style={{ flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:Colors.inputPlaceholder}}>Taxa de entrega</Text>
                      <Text style={{position:'absolute', right:20,color:Colors.inputPlaceholder}}>{this.format_dinheiro(this.state.taxaEntrega)}</Text>
                    </View>
                    <View style={{ flexDirection:'row', marginTop:15, marginBottom:10,alignItems:'center'}}>
                      <Text style={{fontSize:20, fontWeight:'bold'}}>Total</Text>
                      <Text style={{position:'absolute', right:20,fontWeight:'bold'}}>{this.format_dinheiro(this.state.taxaEntrega + this.state.total)}</Text>
                    </View>
                </View>
            </View>
          
            <View style={{height:10, width:'100%', backgroundColor:'#F5F5EF'}}></View>
            <View style={{width:'100%', backgroundColor:'#fff', marginTop:10, borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
              <Text style={{marginTop:20,marginLeft:20, fontSize:16, fontWeight:'700', marginBottom:20}}>Pagamento</Text>
              <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:10, alignSelf:'center', width:'95%',}}></View>
              <TouchableOpacity style={{ marginBottom:5, marginTop:5,justifyContent:'center',}} onPress={()=>{this.selectPayment("Dinheiro")}}>
                <Text style={{marginLeft:20}}>Dinheiro</Text>
                <View style={{ position:'absolute', right:20,flexDirection:'row'}} >
                  {this.state.payment === "Dinheiro" ?    <Icon.FontAwesome name={"check"} color={"green"} size={20} style={{marginRight:10}} /> : null}
                  <Icon.FontAwesome name={"money"} color={"black"} size={20} />
                </View>
              </TouchableOpacity>
              <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:10, alignSelf:'center', width:'95%'}}></View>
              <TouchableOpacity style={{ marginBottom:5, marginTop:5,justifyContent:'center',}} onPress={()=>{this.selectPayment("Card")}}>
                <Text style={{marginLeft:20}}>Cartão de Crédito </Text>
                <View style={{ position:'absolute', right:20, flexDirection:'row'}} >
                {this.state.payment === "Card" ?    <Icon.FontAwesome name={"check"} color={"green"} size={20} style={{marginRight:10}} /> : null}
                  <Icon.AntDesign name={"creditcard"} color={"black"} size={20} />
                </View>
              </TouchableOpacity>
                <View style={{height:1, backgroundColor:"#F0F0F0",marginTop:10,marginBottom:10, alignSelf:'center', width:'95%'}}></View>
              <View style={{width:'90%', backgroundColor:Colors.inputPlaceholder,borderRadius:5, padding:10,opacity:0.5,alignSelf:'center', marginBottom:10}}>
                <Text style={{textAlign:"center",}}>Os pagamento será realizado somente no momento da entrega.</Text>
              </View> 
   
            </View>
            <Button onPress={()=>{this.finalizarPedido() }} loading={this.state.loading} color={Colors.buttonlogin}><Text style={{color:Colors.text, fontWeight:'bold', }}>Finalizar Pedido</Text></Button>
          
          </ScrollView>
        )
      }else{
        return(null)
      }
       
    }
}   