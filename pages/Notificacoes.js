import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator
} from 'react-native';
import Colors from '../constants/Colors';
import ImageCache from '../components/ImageCache';
import Layout from '../constants/Layout';
import { Icon } from 'expo';

const width = Layout.window.width;
const height = Layout.window.width * 0.5625;

const HEADER_MAX_HEIGHT = height;
const HEADER_MIN_HEIGHT = 55;



export default class Notificacoes extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.store = this.props.screenProps.s;
    this.state = {
      isLoading: true,
      uid: this.store.get_offline('usuario/id'),
      list: []
    }
  }

  loadNotifications(){
    let uid = this.store.get_offline('usuario/id');
    if(uid==null) return;
    this.setState({uid});
    this.store.request(`https://api.voitto.com.br/notificacoes/listar/${uid}/0?authorization=master`, `notificacoes/${uid}`).then(s=>{
        if(s.status=="success"){
            this.setState({list: s.notificacoes, isLoading: false});
        }
    });
  }

  componentDidMount(){
      this.loadNotifications();
  }

  icone(icon = ''){
    icon = JSON.parse(icon);
    if(icon.type==="image"){
        return <ImageCache source={icon.value} style={{width: 40, height:40, padding: 5, marginRight: 10, backgroundColor: '#ccc'}} />;
    } else {
        return null;
    }
  }

  isStatusReaded(statusReaded = ''){
    statusReaded = JSON.parse(statusReaded);
    return statusReaded.indexOf(this.state.uid) > -1;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bar}>
            <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={styles.backButtom}>
            <Icon.Ionicons name={Platform.select({ios: "ios-arrow-back", android: 'md-arrow-back'})} size={20} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Notificações</Text>
        </View>
        {this.state.isLoading===true? <View style={{alignItems:'center',justifyContent:'center'}}><ActivityIndicator color={Colors.text} /></View>:
        (<ScrollView style={styles.container}>
          {this.state.list.length===0 && <Text style={styles.note}>Nenhuma notificação até agora.</Text>}
          {this.state.list.map((n, i)=>(
          <View key={i} style={[styles.listItem, this.isStatusReaded(n.statusReaded)==false && {backgroundColor: 'rgba(255,255,255,0.1)'}]}>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MeuPerfil')}} style={styles.listItemPress}>
                {this.icone(n.icon)}
                <View style={{flex:1}}>
                    <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.listItemText}>{n.title}</Text>
                    <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.note}>{n.message}</Text>
                </View>
            </TouchableOpacity>
          </View>))}
        </ScrollView>)
        }
      </View>
    );
  }
}

const space = Platform.select({ios: 0, android: 35});
const margin = Platform.select({ios: 0, android: 20});


const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 25,
    marginRight: 10
  },
  userdata: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  nome: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 15
  },
  voittocoins: {
    color: Colors.text,
    opacity: 0.9,
    fontSize: 12
  },
  listItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: 1
  },
  listItemPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  listItemIcon: {
    marginRight: 10,
    width: 30
  },
  listItemText: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    paddingRight: 5,
  },
  bar: {
    height: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom:margin
    },
  backButtom: {
        width: HEADER_MIN_HEIGHT * 0.7,
        height: HEADER_MIN_HEIGHT,
        alignItems: 'center',
        marginTop:space,
        justifyContent: 'center'
    },
  title: {
        backgroundColor: 'transparent',
        color: Colors.text,
        fontSize: 18,
        marginTop:space,
        paddingHorizontal: 15,
        flex: 1,
    },
    note: {
        fontSize: 10,
        color: Colors.text,
        opacity: 0.8,
        paddingRight: 5,
      },
});
