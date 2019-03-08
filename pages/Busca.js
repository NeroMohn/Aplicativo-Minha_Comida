import React from 'react';
import {
  Text,
  ListView,
  TouchableOpacity,
  Modal,StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  TextInput
} from 'react-native';

import axios from 'axios';
import Server from '../constants/Server';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { Icon } from 'expo';
import ImageCache from '../components/ImageCache';
import Loading from '../components/Loading';
import Input from '../components/Input';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Busca extends React.Component {
  static navigationOptions = {
    header: null,

  };
  
  constructor(props){
        super(props);
        this.store = this.props.screenProps.s;
        this.init = this._init.bind(this);
        this.state = {
            visible:false,
            searchString:'',
            loading:true,
        }
    }

    _init(dado){
        this.setState({
            visible:true,
            searchString:dado,
        })
    }

    _changed(dado){
        this.setState({searchString:dado});
    }

    buscar(){
        this.setState({
            loading:false,
            list_load:false,
            data_lista:ds.cloneWithRows([]),
        })
        axios.post(Server.host + `/search`,{idApp:Server.idApp, search:this.state.searchString})
        .then(res=>{
            if(res.data.data === undefined){
                this.setState({nada_encontrado:true, loading:true});
                return;
            }
            this.setState({
                loading:true,
                data_lista: ds.cloneWithRows(res.data.data),
                list_load:true,
                nada_encontrado:false,
            })
            if(res.data.data.lenght <= 0 ){
                this.setState({nada_encontrado:true});
            }
        });
    }

    pedir = (id)=>{
        this.props.screenProps.pocurso(id)
    }

    render_lsita(){
        if(this.state.list_load){
            return(
                <ListView
                dataSource={this.state.data_lista}
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
                }
            />)  
        }else{
            return(null)
        }
        
    }
    render(){
        if(this.state.visible)
        return(
            <View style={{ width:'100%', backgroundColor:'#fff', height:'100%', paddingBottom:'10%', zIndex:9999999, position:'absolute' }}  contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
                    <TouchableOpacity style={{marginLeft:'5%'}} onPress={()=>{this.setState({visible:false})}}>
                        <Icon.AntDesign name={"close"} color={Colors.buttonlogin} size={20} />
                    </TouchableOpacity>
                    <View style={styles.searchSection}>
                        <TextInput
                            style={styles.input}
                            placeholder="Busque sua comida favorita"
                            value={this.state.searchString}
                            onSubmitEditing={()=>this.buscar()}
                            autoFocus={true}
                            onChangeText={(searchString) => {this._changed(searchString)}}
                            underlineColorAndroid="transparent"
                        />
                        <TouchableOpacity onPress={()=>this.buscar()}>
                        <Icon.Feather style={[styles.searchIcon,{}]} name="search" size={20} color={Colors.buttonlogin}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.nada_encontrado?
                    <Text style={{alignSelf:'center', marginTop:'50%'}}>Nada Encontrado</Text>:null
                }

                {!this.state.loading?
                    <Loading/>:
                    <View style={{marginTop:10}}>
                        {this.render_lsita()}
                    </View>
                }
            </View>
        )
        else
            return(
                <View></View>
            )
    }

}



const styles = StyleSheet.create({
   
  
    searchSection: {
        paddingLeft:25,
        flexDirection: 'row',
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        backgroundColor: '#EBEBEB',
        height:50,
        width:'80%',
        marginLeft:20,
        marginRight:10
      },
      searchIcon: {
          padding: 10,
      },
      input: {
          flex: 1,
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 0,
          backgroundColor: 'transparent',
          color: 'black',
      },
});