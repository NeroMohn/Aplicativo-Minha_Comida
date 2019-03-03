import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import ImageCache from '../components/ImageCache';
import { Icon } from 'expo';



const width = Layout.window.width - 20;
const height = width * 0.5625;
const boxHeight = 70;

export default class VoittoCast extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.store = this.props.screenProps.s;
    this.state = {
      isLoading: false,
      page: 0,
      limit: 10,
      casts: [],
      backup: [],
      search: ""
    };
  }

  checkIfExists(id){
    for (const art of this.state.casts) {
      if(art.id===id) return true;
    }
    return false;
  }

  loadCasts(){
    this.setState({isLoading:true});
    this.store.request(`https://api.voitto.com.br/blog/todos_voittocasts`, 'voittocasts').then((s)=>{
      if(!s.status){
          let curCast = this.state.backup;
          for (const art of s) {
            if(!this.checkIfExists(art.id)) curCast.push(art);
          }
          this.setState({
            casts: curCast,
            backup: curCast,
            isLoading:false
          });
      }
    }).catch(e=>{
      this.setState({
        isLoading:false
      });
    });
  }

  search(text = ''){
    this.setState({search: text});
    let curCast = this.state.backup;
    /*
      FAZER REQUISICÁO DE BUSCA E COLOCAR RESULTADO EM curCast
    */
    this.setState({casts: curCast});
  }

  componentDidMount(){
    this.loadCasts();
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={[styles.container,{}]}>
        <Image source={{uri:'https://www.voitto.com.br/images/icones/vcastIcon.png'}} style={{width:'65%', height:50, alignSelf:'center', resizeMode:'contain', marginTop:20, marginBottom:10}}/>
         
          {this.state.isLoading===true? <View><ActivityIndicator color={Colors.text} /></View>: <View></View>}
          {this.state.casts.map((art, i)=>(
              <View key={i} style={styles.art}>
                <View style={styles.artCont}>
                  <TouchableOpacity style={[styles.artCont, {flex: 1}]} onPress={()=>{this.props.screenProps.pocast(art);}}>
                    <View >
                      <Text numberOfLines={1} style={styles.artTitle}><Text style={[styles.artTitle, {fontSize: 18, color:'#E26A2B', fontWeight: 'bold'}]}>#{art.codigo}</Text> {art.titulo}</Text>
                      <Text numberOfLines={1}  style={styles.artSubtitle}>{art.subtitulo}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  art: {
    margin: 10,
    backgroundColor: '#333',
    padding: 30,
    marginVertical: 10,
    width: width,
    height: boxHeight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 1,
          height: 1
        },
        shadowOpacity: 0.1
      }, 
      android: {
        elevation: 1
      }
    })
  },
  artImage: {
    position: 'absolute',
    width: width,
    height: height,
    flex: 1
  },
  artCont: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: width,
    height: boxHeight,
    
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:20,
    flex: 1
  },
  artTitle: {
    fontSize: 16,
    color: Colors.text,
    
  },
  artSubtitle: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.9,

  },
});
