import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import Colors from '../constants/Colors';
import ImageCache from '../components/ImageCache';
import { Icon } from 'expo';


export default class Mais extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.store = this.props.screenProps.s;
    this.state = {
      isUserDataLoading: true,
      userData: this.store.get_offline('usuario')
    }
  }

  openSite(url = null)
  {
    if(typeof url === undefined) return;
    if(typeof url === null) return;
    Linking.openURL(url);
  }


  render() {

    const avalie =Platform.select({
      ios: "https://itunes.apple.com/br/app/voitto-app/id1250181789?mt=8",
      android: "https://play.google.com/store/apps/details?id=br.com.voitto.app.voitto_app"
    });


    return (
      <View style={styles.container}>
        <View style={styles.userdata}>
          <ImageCache source={this.state.userData.foto} style={styles.avatar} />
          <View>
            <Text style={styles.nome}>{this.state.userData.nome}</Text>
            <View style={{flexDirection: 'row'}}>
              <Image resizeMode={"contain"} style={{height: 15, width: 15, marginRight: 5}} source={require('./../assets/images/voittocoins.png')} />
              <Text style={styles.voittocoins}>{this.state.userData.voittocoins}</Text>
            </View>
          </View>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.listItem}>
            {/* onPress={()=>{this.props.navigation.navigate('LerArtigo', {ref: art.id})}} */}
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MeuPerfil')}}   style={styles.listItemPress}>
                <Icon.Ionicons name={"ios-person"} style={styles.listItemIcon} size={styles.listItemText.fontSize} color={Colors.text} />
                <Text style={styles.listItemText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listItem}>
            <TouchableOpacity  onPress={()=>{this.props.navigation.navigate('Notificacoes')}} style={styles.listItemPress}>
                <Icon.Ionicons name={"md-notifications"} style={styles.listItemIcon} size={styles.listItemText.fontSize} color={Colors.text} />
                <Text style={styles.listItemText}>Notificações</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listItem}>
            <TouchableOpacity  onPress={()=>{this.props.screenProps.downlaods(true)}} style={styles.listItemPress}>
                <Icon.Ionicons name={"ios-cloud-done"} style={styles.listItemIcon} size={styles.listItemText.fontSize} color={Colors.text} />
                <Text style={styles.listItemText}>Central de Downloads</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listItem}>
            <TouchableOpacity  onPress={()=>{this.openSite(avalie)}} style={styles.listItemPress}>
                <Icon.Ionicons name={"md-star"} style={styles.listItemIcon} size={styles.listItemText.fontSize} color={Colors.text} />
                <Text style={styles.listItemText}>Avalie o VoittoApp</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listItem}>
            <TouchableOpacity onPress={()=>{this.store.set('usuario', null)}} style={styles.listItemPress}>
                <Icon.FontAwesome name={"times"} style={styles.listItemIcon} size={styles.listItemText.fontSize} color={Colors.text} />
                <Text style={styles.listItemText}>Sair</Text>
            </TouchableOpacity>
          </View>

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
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  listItemPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  listItemIcon: {
    marginRight: 10,
    width: 30
  },
  listItemText: {
    flex: 1,
    color: Colors.text,
    fontSize: 18
  }
});
