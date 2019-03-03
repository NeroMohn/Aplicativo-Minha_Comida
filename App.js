import React from 'react';
import { Platform, StatusBar, StyleSheet, Alert,View, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';
import Storage from './classes/Storage';
import FileCache from './classes/FileCache';
import LoginScreen from './pages/Login';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isLoggedIn: true
  };

  store = null;
  filecache = null;

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadi2ngError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.select({ios: "padding", android: "height"})} enabled>
              {Platform.OS === 'ios' && <StatusBar  backgroundColor="blue" barStyle="light" />}
              {this.state.isLoggedIn==true?
              <AppNavigator screenProps={{s: this.store, fc: this.filecache, pocurso: this.playerOpenCurso.bind(this),downlaods:this.openCentral.bind(this), pocast: this.playerOpenCast.bind(this) }} />
              :<LoginScreen screenProps= {{s: this.store, fc: this.filecache}} />}
            </KeyboardAvoidingView> 
          </SafeAreaView>
        </View>
      );
    }
  }

  getPlayer(){
    if(this.player!==undefined)
      return this.player;
    return {};
  }

  dowloadLicao(licao = {}, CURSO_ID = null){
    this.refs.dw.downloadLicao(licao, CURSO_ID)
  }

  openCentral(a =false){
    if(typeof a == undefined) return;
    this.refs.dw.openCentral(a);
  }

  playerOpenCurso(id){
    this.refs.player.loadCurso(id);
  }

  playerOpenCast(castObject){
    this.refs.player.loadCast(castObject);
  }

  componentDidMount(){
    this.store.watch('usuario', (data)=>{
      if(data !== null && data !== undefined){
        this.setState({isLoggedIn: true});
      } else {
        this.setState({isLoggedIn: false});
      }
    });
  }

  _loadResourcesAsync = async () => {
    this.store = new Storage;
    this.filecache = new FileCache;
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/voittocoins.png'),
        require('./assets/images/app.png'),
        require('./assets/images/cursosIcon.png'),
        require('./assets/images/vcastIcon.png'),
        require('./assets/images/logo.png'),
        require('./assets/images/gp-voitto-gray.png'),
        require('./assets/images/no-image.jpg'),
        require('./assets/images/icones/ic_play.png'),
        require('./assets/images/icones/ic_left.png'),
        require('./assets/images/icones/ic_right.png'),
        require('./assets/images/icones/ic_pause.png')
      ]), 
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
