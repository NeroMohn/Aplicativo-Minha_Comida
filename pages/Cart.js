import React from 'react';
import {
  Text,
  ListView,
  StatusBar,
  Image,
  View,
  Dimensions
} from 'react-native';


import Input from '../components/Input';
import Colors from '../constants/Colors';
import ImageCache from '../components/ImageCache';
import { Icon, AppLoading } from 'expo';
import Carrosel from '../components/Carrosel';
import SearchInput from '../components/SearchInput';
import axios from 'axios';
import Server from '../constants/Server';
import Loading from '../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Cart extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
        super(props);
        this.store = this.props.screenProps.s;
        this.state = {
          isLoading: false,
          empty:true,
          lista:ds.cloneWithRows([]),
        };

        this.subs = [
          this.props.navigation.addListener('willFocus', () => {this.init()}),
        ]
    }

    componentDidMount(){
      this.init()
    }
    init(){
      this.store.watch('usuario', (response)=>{
        axios.post(Server.host + `/cart/meuspedidos`,{idApp:Server.idApp, id_usuario:response.data[0]._id})
        .then(res=>{
          res = res.data;
          var pedidos = []
          if(res.dados !== undefined)
          {
            res.dados.forEach(element => {
              pedidos.push({
                id:element._id,
                status: element.status
              })
  
            });
          }
         
          if(pedidos.length <=0 || pedidos.length === undefined){
            this.setState({
              isLoading:true,
              empty:true,
            })
          }else{
            pedidos = pedidos.slice(0).reverse()
            this.setState({
              empty:false,
              isLoading:true,
              lista:ds.cloneWithRows(pedidos),
            })
          }
        })
      })
    }

    sort_data(a,b){
      return b.data - a.data;
    }
    status(id){
      switch (id) {
        case 1:
          return("Aguardando")
        case 2:
          return("Confirmado")
        case 3:
          return("Entregue")
      }
    }

    render_epmty(){
        return(
            <View style={{alignContent:'center',alignItems:'center'}}> 
                <View style={{marginTop:'50%', alignItems:'center'}}>
                    <Text style={{color:'black', fontSize:17, fontWeight:'500'}}>Nenhum pedido no histórico.</Text>
                    <Text style={{color:Colors.inputPlaceholder, fontSize:15, fontWeight:'400', marginTop:10}}>Que tal fazer seu primeiro</Text>
                    <Text style={{color:Colors.inputPlaceholder, fontSize:15, fontWeight:'400'}}>pedido agora ?</Text>
                </View>               
            </View>
        )
    }
  render(){
    
        
    if(this.state.isLoading)
        return(
            <View>
                <Text style={{color:'black', fontSize:17, fontWeight:'600', alignSelf:'center', marginTop:10}}>PEDIDOS</Text>
                {this.state.empty?this.render_epmty():<View></View>}
                <View style={{marginTop:20,height:'100%'}}>
                  <ListView
                    dataSource={this.state.lista}
                    renderRow={(rowData,sectionID, rowID, ) => 
                      <View style={{ alignItems:'center',marginLeft:20, marginBottom:10,alignItems:'flex-start', width:'100%'}}>
                      <View style={{height:0.5, width:'90%', backgroundColor:Colors.inputPlaceholder, marginBottom:10, marginRight:20}}></View>
                      <View style={{ flexDirection:'row',width:'100%', alignItems:'center'}}>
                        <Icon.FontAwesome  name="shopping-cart" size={30} color={Colors.buttonlogin}/>
                        <View style={{marginLeft:20, alignItems:'flex-start', }}>
                          <Text style={{color:Colors.inputPlaceholder, fontSize:16,  color:'black'}}>#Pedido: {this.status(rowData.status)}</Text>
                          <Text lineBreakMode={1} style={{color:Colors.inputPlaceholder, fontSize:14,marginTop:5, color:Colors.inputPlaceholder}}>Código: #{rowData.id}</Text>
                        </View>
                      </View>
                    </View>
                  }/>
                </View>
            </View>
        )
    else
      return(
        <Loading/>
        );
  }


}