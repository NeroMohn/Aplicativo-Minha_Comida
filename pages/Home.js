import React from 'react';
import {
  Text,
  ListView,
  StyleSheet,
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

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.store = this.props.screenProps.s;
    this.state = {
      isLoading: false,
      carrosel:{},
      
    };
  }
  
  componentDidMount(){
    this.load_carrousel();
  }

  load_carrousel(){
    axios.post(Server.host + `/carrousel`,{idApp:Server.idApp})
      .then(res=>{
        this.setState({
          isLoading:true,
          carrosel:ds.cloneWithRows(res.data.data),
        })
      })
  }

  
  render() {

    if(this.state.isLoading)
      return (
        <View style={styles.container}>
          <View style={styles.busca}>
            <SearchInput  />
          </View>
          <ScrollView>
            <View style={{width:'100%', height:1}}></View>
            <View horizontal style={{ backgroundColor:'#fff', height:210}}>
              <ListView
                dataSource={this.state.carrosel}
                horizontal={true}
                renderRow={(rowData) => 
                  <View style={{marginLeft:20,width:250,height:110}}>
                    <ImageCache source={rowData.img} style={{width:250,height:125,marginTop:10, borderRadius:5,}}/>
                    <View style={{marginTop:20}}>
                      <Text style={{color:'black', fontSize:17}}>{rowData.titulo}</Text>
                      <Text style={{color: Colors.inputPlaceholder, fontSize:16}}>{rowData.descricao}</Text>
                    </View>
                  </View>
                }
              />
            </View>
            <View style={{height:150, backgroundColor:'#fff', marginTop:8}}>
              <View style={{}}>
                <Text style={{marginTop:20,marginLeft:20, fontSize:16, fontWeight:'700'}}>Categorias</Text>
                <ListView
                  dataSource={this.state.carrosel}
        
                  horizontal={true}
                  renderRow={(rowData) => 
                    <View style={{height:170, marginRight:8,marginLeft:20,marginRight:-10}}>
                      <ImageCache source={rowData.img} style={{width:70,height:60,marginTop:10, borderRadius:5,}}/>
                      <View style={{marginTop:10}}>
                        <Text style={{color:Colors.inputPlaceholder, fontSize:13, alignSelf:"center", marginTop:5}}>Pizza</Text>
                      </View>
                    </View>
                  }
                />
              </View>
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
  filtros:{
    
  }
});
