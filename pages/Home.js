import React from 'react';
import {
  Text,
  ListView,
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity
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

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.store = this.props.screenProps.s;
    this.modalAlternado = this.props.screenProps.modalAlternado;


    this.state = {
      isLoading: false,
      carrosel:{},
      categorias:{},
    };
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {this.load_carrousel()}),
    ]
  }
  
  componentDidMount(){
    this.load_carrousel();
  }

  orgazinar(a, b) {
    return a.ordem - b.ordem;
  }

  orgazinar_2(a, b) {
    return   b.score-a.score;
  }
  load_carrousel(){
    let carrosel = {};
    let categorias = {};

    axios.post(Server.host + `/carrousel`,{idApp:Server.idApp})
    .then(res=>{
      res.data.data.sort(this.orgazinar); 
      carrosel = ds.cloneWithRows(res.data.data)
      axios.post(Server.host + `/categorias`,{idApp:Server.idApp})
      .then(res=>{
        res.data.data.sort(this.orgazinar); 
        categorias=ds.cloneWithRows(res.data.data)
        axios.post(Server.host + `/cardapio`,{idApp:Server.idApp})
        .then(res=>{
          var card= [];
          (res.data.data).forEach(element => {
            if(element.destaque == 1){
              card.push(element)
            }
          }); 
          card.sort(this.orgazinar_2);
          var cardapio =ds.cloneWithRows(card)
          this.setState({
            carrosel,
            categorias,
            cardapio,
          })
        })
      })
    })
   
    setTimeout(() => {
      this.setState({
        isLoading:true,
      })
    }, 1000);

  }

  
  pedir = (id)=>{
    this.props.screenProps.pocurso(id)
  }
  render() {
    if(this.state.isLoading)
      return (
        <View style={styles.container}>
          <View style={styles.busca}>
          <View style={[styles.searchSection,{marginTop:10}]}>
                    <Icon.Feather style={styles.searchIcon} name="search" size={20} color={Colors.buttonlogin}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Busque sua comida favorita"
                        value={this.state.searchString}
                        onChangeText={(searchString) => {this.props.screenProps.search(searchString); this.setState({searchString:''})}}
                        underlineColorAndroid="transparent"
                    />
                </View>
          </View>
          <ScrollView>
            <View style={{width:'100%', height:1}}></View>
            <View horizontal style={{ backgroundColor:'#fff', height:210}}>
              <ListView
                dataSource={this.state.carrosel}
                horizontal={true}
                renderRow={(rowData) => 
                  <TouchableOpacity style={{marginLeft:20,width:250,height:110}} onPress={()=>{this.modalAlternado(rowData.type )}}>
                    <ImageCache source={rowData.img} style={{width:250,height:125,marginTop:10, borderRadius:5,}}/>
                    <View style={{marginTop:20}}>
                      <Text style={{color:'black', fontSize:17}}>{rowData.titulo}</Text>
                      <Text style={{color: Colors.inputPlaceholder, fontSize:16}}>{rowData.descricao}</Text>
                    </View>
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={{height:150, backgroundColor:'#fff', marginTop:8}}>
              <View style={{}}>
                <Text style={{marginTop:20,marginLeft:20, fontSize:16, fontWeight:'700'}}>Categorias</Text>
                <ListView
                  dataSource={this.state.categorias}
                  horizontal={true}
                  renderRow={(rowData) => 
                    <TouchableOpacity style={{height:170, marginRight:8,marginLeft:20,marginRight:-10} }onPress={()=>{this.modalAlternado("Categoria",rowData.type)}} >
                      <ImageCache source={rowData.img} style={{width:70,height:60,marginTop:10, borderRadius:5,}}/>
                      <View style={{marginTop:10}}>
                        <Text style={{color:Colors.inputPlaceholder, fontSize:13, alignSelf:"center", marginTop:5}}>{rowData.categoria}</Text>
                      </View>
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>
            <View style={{marginTop:10,width:'100%', backgroundColor:'#fff',}}>
            <Text style={{marginTop:20,marginLeft:20, fontSize:16, fontWeight:'700', marginBottom:20}}>Principais</Text>
              <ListView
                dataSource={this.state.cardapio}
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
              />
            </View>
          </ScrollView>
        </View>
      );

    else
      return(<Loading/>)
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
   
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:5,
    backgroundColor: '#EBEBEB',
    height:50,
    width:'90%',
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
  filtros:{
    
  }
});
