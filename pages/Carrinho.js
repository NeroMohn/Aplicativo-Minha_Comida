import React from 'react';
import {
  Text,
  ListView,
  TouchableOpacity,
  Modal,
  View,
  Dimensions
} from 'react-native';

import axios from 'axios';
import Server from '../constants/Server';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { Icon } from 'expo';
import ImageCache from '../components/ImageCache';
import Loading from '../components/Loading';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Carrinho extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor(props){
        super(props);
        this.init = this._init.bind(this);
        this.clean_carrinho = this._clean_carrinho.bind(this);
        this.state = {
          isLoading: false,
          empty:true,
          lista:[],
          quantdades_complementos:[],
          total:0,
          quantdades:[],
          modal_complemento:false,
        };
    }
    
    _init = (dados)=>{
        let array = this.state.lista;
        let total = this.state.total + dados.valor;
        let array2 = this.state.quantdades;
        array.push(dados)
        array2.push(1);
        this.setState({
            show: true,
            total:total,
            lista:array,
            quantdades:array2,
  
        });
    }

    
    componentDidMount(){
        axios.post(Server.host + `/complemento`,{idApp:Server.idApp})
        .then(res=>{
            this.setState({
                lista_complementos:res.data.data,
                complementos_load:true,
            })
        })
    }

    format_dinheiro (numero){
        var numero = numero.toFixed(2).split('.');
        numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    finalizar_compra(){
        let pedido = [];
        let complementos = [];
        let final = [];

        // Fazendo lista de pedidos
        let lista = (this.state.lista);
        let quantdades = (this.state.quantdades);
        for(var i=0;i<lista.length;i++){
            if(quantdades[i] > 0 ){
                pedido.push({
                    id: lista[i]._id,
                    quantdade: quantdades[i],
                    nome: lista[i].nome,
                    valor: (lista[i].valor * quantdades[i])
                })
            }
        }

        // Fazendo pedido dos complementos 
        let complementos_quan = (this.state.quantdades_complementos);
        let complementos_list = (this.state.lista_complementos);
        for(var i=0;i<complementos_quan.length;i++){
            if(complementos_quan[i] > 0){
                complementos.push({
                    id: complementos_list[i]._id,
                    quantidade : complementos_quan[i],
                    nome: complementos_list[i].nome,
                    valor: (complementos_list[i].valor * complementos_quan[i])
                })
            }
        }
        
        final.push({
            pedido: pedido,
            complementos: complementos,
            total: this.state.total,
        })


 
        this.setState({
            modal_complemento:false
        })

        this.props.screenProps.checkuoutopen(final)

    }

    delete = (id, index)=>{
        let array = this.state.lista;
        let array2 = this.state.quantdades;
        var a = 0;
        for(var i=0;i<array.length;i++){
            if(array[i]['_id'] !== undefined){
                if(array[i]['_id'] == id){
                    a = i;
                    break;
                }
            }
        }

        delete array[a];
        delete array2[index];
        this.setState({
            quantdades:array2,
            lista:array,
        })


    }
    
    _clean_carrinho(){
        console.log("clean")
        this.setState({
            isLoading: false,
          empty:true,
          lista:[],
          quantdades_complementos:[],
          total:0,
          quantdades:[],
          modal_complemento:false,
          show: false,
          modal_complemento:false,
        })
    }
   render_modal_complemento(){
       
        return(
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modal_complemento}
                onRequestClose={() => {}}>
                <View style={{width:'100%', height:'100%', backgroundColor:'#fff'}}>
                    <View style={{width:'100%', backgroundColor:'#fff', height:'7%', flexDirection:'row', alignItems:'center', marginTop:15,justifyContent:'center'}}>
                        <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:'50%', marginTop:-13}} onPress={()=>this.setState({modal_complemento: false})}>
                            <Icon.AntDesign name={"down"} color={Colors.buttonlogin} size={20} />
                        </TouchableOpacity>
                        <Text style={{color:'black', fontSize:17, fontWeight:'600',  }}>Adicionais</Text>
                    </View>
                    <View style={{height:2, backgroundColor:'#F5F5EF', width:'100%'}}></View>
                    
                    <View style={{marginTop:5, backgroundColor:'#fff', width:'100%', height:'73%'}}>
                    {this.state.complementos_load?<ListView
                        dataSource={ds.cloneWithRows(this.state.lista_complementos)}
                        renderRow={(rowData,rowA,rowIndex) => 
                            <View style={{ alignItems:'center',marginLeft:20, marginBottom:10,alignItems:'flex-start', width:'100%', marginTop:10}}>
                                <View style={{ flexDirection:'row',width:'100%', alignItems:'center'}}>
                                    <ImageCache source={rowData.img} style={{width:50,height:50, borderRadius:25,}}/>
                                    <View style={{marginLeft:10, alignItems:'flex-start', }}>
                                        <Text style={{color:Colors.inputPlaceholder, fontSize:15,  color:'black'}}>{rowData.nome}</Text>
                                        <Text style={{color:Colors.inputPlaceholder, fontSize:13, color:Colors.inputPlaceholder}}>Valor: {this.format_dinheiro(rowData.valor )}</Text>
                                    </View>
                                    <View style={{position:'absolute', right:'10%',  backgroundColor:'#fff', flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=>{this.set_quantidade_complemento(rowIndex, "plus", rowData.valor)}}>
                                            <Icon.AntDesign name={"pluscircleo"} color={Colors.buttonlogin} size={20} />
                                        </TouchableOpacity>
                                        <Text style={{marginRight:10, marginLeft:10}}>{this.state.quantdades_complementos[rowIndex] === undefined ?0: this.state.quantdades_complementos[rowIndex]}</Text>
                                        <TouchableOpacity onPress={()=>{this.set_quantidade_complemento(rowIndex, "minus",rowData.valor)}}>
                                            <Icon.AntDesign name={"minuscircleo"} color={Colors.buttonlogin} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }/>:<Loading/>}
                    </View>
                    <View style={{height:5, backgroundColor:'#F5F5EF', width:'100%'}}></View>
                    <View style={{ position:'absolute', width:'100%', bottom:0, backgroundColor:'#fff',  height:'16%',alignItems:'center', justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignSelf:'flex-end'}}>
                            <Text style={{ marginRight:5, fontSize:17, color:Colors.inputPlaceholder}}>Total:</Text>
                            <Text style={{ marginRight:20, fontSize:16}}>{this.format_dinheiro(this.state.total)}</Text>
                        </View>
                        <Button onPress={()=>{  this.setState({modal_complemento:true});this.finalizar_compra() }} loading={this.state.loading} color={Colors.buttonlogin}><Text style={{color:Colors.text, fontWeight:'bold', }}>Finalizar Compra</Text></Button>
                    </View>

                </View>
            </Modal>
        )
    }

   set_quantidade(index, type,valor){
       if(type === "plus"){
            let array = this.state.quantdades;
            array[index] = array[index]+1;
            this.setState({
                quantdades:array,
                total: this.state.total+valor
            })
       }else{
        let array = this.state.quantdades;
        if(array[index] >= 1){
            array[index] = array[index]-1;
            this.setState({
                quantdades:array,
                total: this.state.total-valor
            })
        }
       }
      
   }


   set_quantidade_complemento(index, type,valor){
        if(type === "plus"){
            let array_complementos = this.state.quantdades_complementos;
            if( array_complementos[index] === undefined)  array_complementos[index] =0;
            array_complementos[index] = array_complementos[index]+1;
            this.setState({
                quantdades_complementos:array_complementos,
                total: this.state.total+valor
            })
        }else{
        let array_complementos = this.state.quantdades_complementos;
        if(array_complementos[index] >= 1){
            array_complementos[index] = array_complementos[index]-1;
            this.setState({
                quantdades_complementos:array_complementos,
                total: this.state.total-valor
            })
            }
        }
    }

    render(){
        if(this.state.show){
            return(
                <View style={{position:'absolute', backgroundColor:"#F5F5EF", width:'100%', height:'100%',zIndex:99999999}}>
                    <View style={{width:'100%', backgroundColor:'#fff', height:'7%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:'50%', marginTop:-13}} onPress={()=>this.setState({show: false})}>
                            <Icon.AntDesign name={"down"} color={Colors.buttonlogin} size={20} />
                        </TouchableOpacity>
                        <Text style={{color:'black', fontSize:17, fontWeight:'600',  }}>Carrinho</Text>
                    </View>

                    <View style={{ backgroundColor:'#fff', marginTop:5, height:'75.5%'}}>
                        <ListView
                        dataSource={ds.cloneWithRows(this.state.lista)}
                        renderRow={(rowData,rowA,rowIndex) => 
                            <View style={{ alignItems:'center',marginLeft:20, marginBottom:10,alignItems:'flex-start', width:'100%', marginTop:10}}>
                                <View style={{ flexDirection:'row',width:'100%', alignItems:'center'}}>
                                    <ImageCache source={rowData.img} style={{width:50,height:50, borderRadius:25,}}/>
                                    <View style={{marginLeft:10, alignItems:'flex-start', }}>
                                        <Text style={{color:Colors.inputPlaceholder, fontSize:15,  color:'black'}}>{rowData.nome}</Text>
                                        <Text style={{color:Colors.inputPlaceholder, fontSize:13, color:Colors.inputPlaceholder}}>Valor: {this.format_dinheiro(rowData.valor )}</Text>
                                    </View>
                                    <View style={{position:'absolute', right:'10%',  backgroundColor:'#fff', flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=>{this.set_quantidade(rowIndex, "plus", rowData.valor)}}>
                                            <Icon.AntDesign name={"pluscircleo"} color={Colors.buttonlogin} size={20} />
                                        </TouchableOpacity>
                                        <Text style={{marginRight:10, marginLeft:10}}>{this.state.quantdades[rowIndex]}</Text>
                                        <TouchableOpacity onPress={()=>{this.set_quantidade(rowIndex, "minus",rowData.valor)}}>
                                            <Icon.AntDesign name={"minuscircleo"} color={Colors.buttonlogin} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }/>
                    </View>
                    <View style={{ position:'absolute', width:'100%', bottom:0, backgroundColor:'#fff',  height:'16%',alignItems:'center', justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignSelf:'flex-end'}}>
                            <Text style={{ marginRight:5, fontSize:17, color:Colors.inputPlaceholder}}>Total:</Text>
                            <Text style={{ marginRight:20, fontSize:16}}>{this.format_dinheiro(this.state.total)}</Text>
                        </View>
                        <Button onPress={()=>{this.setState({modal_complemento:true})}} loading={this.state.loading} color={Colors.buttonlogin}><Text style={{color:Colors.text, fontWeight:'bold', }}>Continuar</Text></Button>
                    </View>
                    {this.render_modal_complemento()}
                </View>
                
            )
        }else if(this.state.total > 0 && !this.state.show){
            return(
            <TouchableOpacity onPress={()=>{this.setState({show:true})}} style={{ width:'100%', height:50, backgroundColor:'red', alignContent:'center', flexDirection:'row', justifyContent:'center'}}>
              <Text style={{fontSize:16, fontWeight:'bold', alignSelf:'center', color:'#fff'}}>Ver sacola</Text>
              <Text style={{fontSize:16, fontWeight:'bold', alignSelf:'center', color:'#fff', position:'absolute', right:20}}>{this.format_dinheiro(this.state.total)}</Text>
            </TouchableOpacity>
            )
        }else{
            return(<View></View>)
        }
      
  
    }
}