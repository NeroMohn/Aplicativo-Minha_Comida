import React from 'react';
import {
  Image,
  ListView,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import axios from 'axios';
import { Icon } from 'expo';

import Server from '../constants/Server';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import Utils from '../constants/Utils';
import Loading from '../components/Loading';
import ImageCache from '../components/ImageCache';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class ModalAlternado extends React.Component {


  constructor(props){
     
      super(props);
      this.init = this._init.bind(this);
      this.state = {
          visible:false,
          type:'',
          load:false,
      }
      this.store = this.props.screenProps.s;
  }


  _init(type = '', categoria = ''){
    if(type === '')return;
    if(type === 'Cardapio'){
      this.setState({
        type,
        titulo:'Cardápio',
        visible:true,
        promo:false,
      });
      this.cardapio_load()
    }else if(type === 'Promo'){
      this.setState({
        type,
        titulo:'Promoções',
        visible:true,
        promo:true,
      });
      this.promo_load();
    }else if(type === 'Categoria'){
      this.setState({
        type: 'Cardapio',
        titulo:'Categoria',
        visible:true,
      });
      this.categoriaLoad(categoria);
    }
  }

  categoriaLoad(categoria){
    console.log(categoria)
    axios.post(Server.host + `/cardapio`,{idApp:Server.idApp})
    .then(res=>{
      var array = [];
      (res.data.data).forEach(element => {
        if(element.categoria === categoria){
          array.push(element)
        }
      });
      console.log(JSON.stringify(array))
      this.setState({
        cardapio:array,
        load:true,
      })
    });
  }

  cardapio_load(){
    axios.post(Server.host + `/cardapio`,{idApp:Server.idApp})
    .then(res=>{
      this.setState({
        cardapio:res.data.data,
        load:true,
      })
    });
  }

  promo_load(){
    axios.post(Server.host + `/cardapio`,{idApp:Server.idApp})
    .then(res=>{
      var array = [];
      (res.data.data).forEach(element => {
        if(element.promocao == 1){
          array.push(element)
        }
      });
      this.setState({
        promo:array,
        load:true,
      })
    });
  }

  pedir = (id)=>{
    this.props.screenProps.pocurso(id)
  }


  render(){
    if(this.state.visible)
      if(this.state.load)
        return(
          <View style={{ backgroundColor:'#fff',position:'absolute', height:'100%',width:'100%',width:'100%',}}>
            <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:30, marginTop:-13, zIndex:99}} onPress={()=>{this.setState({visible: false})}}>
              <Icon.AntDesign name={"down"} color={{}} color={Colors.buttonlogin} size={20} />
            </TouchableOpacity>
            <View style={{ alignContent:'center'}}>
              <Text style={{color:'black', fontWeight:'500', alignSelf:'center', marginTop:20, fontWeight:'500'}}>{this.state.titulo}</Text>
            </View>

           <View style={{marginTop:15}}>
            <ListView
              dataSource={ds.cloneWithRows(this.state.type=== "Cardapio"?this.state.cardapio:this.state.promo)}
              renderRow={(rowData) => 
                  <TouchableOpacity style={{ alignItems:'center',marginLeft:20, marginBottom:10,alignItems:'flex-start', width:'100%'}} onPress={()=>this.pedir(rowData)}>
                  <View style={{height:0.5, width:'90%', backgroundColor:Colors.inputPlaceholder, marginBottom:10, marginRight:20}}></View>
                  <View style={{ flexDirection:'row',width:'100%', alignItems:'center'}}>
                    <ImageCache source={rowData.img} style={{width:50,height:50, borderRadius:25,}}/>
                    <View style={{marginLeft:10, alignItems:'flex-start', }}>
                      <Text style={{color:Colors.inputPlaceholder, fontSize:16,  color:'black'}}>{rowData.nome}</Text>
                      <Text style={{color:Colors.inputPlaceholder, fontSize:14, color:Colors.inputPlaceholder}}>{rowData.descricao}</Text>
                    </View>
                    <View style={{alignSelf:'center',position:'absolute', right:'10%', flexDirection:'row', alignItems:'center'}}>
                      <Icon.Entypo style={styles.searchIcon} name="star" size={13} color={"#FFA629"}/>
                      <Text style={{color:'#FFA629'}}> {rowData.score}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              }/>
           </View>
          </View>
        )
        else
          return(
            <View style={{ backgroundColor:'#fff',position:'absolute', height:'100%',width:'100%',width:'100%',}}>
            <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:30, marginTop:-13, zIndex:99}} onPress={()=>{this.setState({visible: false})}}>
              <Icon.AntDesign name={"down"} color={{}} color={Colors.buttonlogin} size={20} />
            </TouchableOpacity>
            <View style={{ alignContent:'center'}}>
              <Text style={{color:'black', fontWeight:'500', alignSelf:'center', marginTop:20, fontWeight:'500'}}>{this.state.type}</Text>
            </View>
            <Loading/>
          </View>
          )
    else
        return(null)
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#F5F5EF",

    width:'100%',
    height:'100%',
    alignSelf:'center',
  }, 
  img_caroussel:{
    width:100,
    height:100
  },
  busca:{
    alignItems:'center',
    width:'100%',
    alignSelf:'center',
    backgroundColor:'#fff',
    justifyContent:'center',
    paddingBottom:15
  },
  filtros:{
    
  }
});
