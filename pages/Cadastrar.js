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
import Input from '../components/Input';

export default class Cadastrar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          visible:true,
        };
    }

    render(){
        if(this.state.visible){
            return(
                <View style={{position:'absolute', backgroundColor:"#F5F5EF", width:'100%', height:'100%',zIndex:99999999,paddingTop:12}}>
                    <View style={{width:'100%', backgroundColor:'#fff', height:'7%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:'50%', marginTop:-13}} onPress={()=>this.setState({visible: false})}>
                            <Icon.AntDesign name={"close"} color={Colors.buttonlogin} size={20} />
                        </TouchableOpacity>
                        <Text style={{color:'black', fontSize:17, fontWeight:'600'  }}>Cadastrar</Text>
                    </View>

                    <View style={{backgroundColor:'#fff', width:'100%',  marginTop:5}}> 
                        <Text style={{marginTop:20,marginLeft:20, fontSize:16, fontWeight:'700'}}>Dados pessoais</Text>
                        <Input placeholder={"Nome"}  style={{marginTop:20, width:'90%', alignSelf:'center'}}type={"emailAddress"} loading={this.state.loading} value={this.state.nome} onChangeText={(nome)=>{this.setState({nome})}} />
                        <Input placeholder={"E-mail"}  style={{marginTop:20, width:'90%', alignSelf:'center'}}type={"emailAddress"} loading={this.state.loading} value={this.state.email} onChangeText={(email)=>{this.setState({email})}} />
                        <Text style={{marginTop:20,marginLeft:20, fontSize:16, fontWeight:'700'}}>Endereço:</Text>
                        <Input placeholder={"CEP"}  style={{marginTop:20, width:'90%', alignSelf:'center'}}type={"emailAddress"} loading={this.state.loading} value={this.state.cep} onChangeText={(cep)=>{this.setState({cep})}} />
                    </View>
                </View>
            )
        }else{
            return null;
        }
    }


}