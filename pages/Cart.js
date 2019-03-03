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
        this.state = {
        isLoading: true,
        
        };
    }

    componentDidMount(){
        axios.post(Server.host + `/categorias`,{idApp:Server.idApp})
        .then(res=>{

        })
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
                {this.render_epmty()}
            </View>
        )
    else
      return(
        <Loading/>
        );
  }


}