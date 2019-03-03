import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    PanResponder,
    Animated,
    Platform,
    ActivityIndicator,
    Alert
  } from "react-native";

import Slider from 'react-native-slider';
import Modal from "react-native-modal";
import { Audio, Video, Icon, FileSystem, Constants, ScreenOrientation } from 'expo';
import Colors from '../constants/Colors';
import ImageCache from './ImageCache';

import Button from './Button';
import Input from './Input';


const { width, height: screenHeight } = Dimensions.get("window");
const height = width * 0.5625;
const plataforma = Platform.select({
  ios:'ios',
  android:'android'
}); 

export default class Player extends React.Component {
  constructor(props) {
        super(props);
        this.store = this.props.screenProps.s;
        this.filecache = this.props.screenProps.fc;
        initialState = {
            show: false,
            isLoadingVideo: false,
            isLoadingList: false,
            modal2:false,
            modal:false,
            notasModal: false,
            currentNota: '',
            currentNotaData: {},
            isNotaLoading: false,
            duvidaModal: false,
            currentDuvida: '',
            currentDuvidaData: {},
            currentDuvidaTutor: null,
            isDuvidaLoading: false,
            isDuvidaSending: false,
            uid: this.store.get_offline('usuario/id'),
            error: null,
            list: {},
            modalHandlerLicao:{},
            listType: null,
            modalHandleridcurso:null,
            totalLength:0,
            currentPosition:0,
            currentListItem: null,
            fastLearn:1.0,
            currentListSubItem: null,
            paused:true,
            nextItem: null,
            currentSource: "",
            currentPoster: "",
            currentTitle: null,
            playerStatus: {
              isPlaying: false
            },
            currentLessonData: {},
            settingLicaoAsComplete: false,
            videoPlayerControlsShow: new Animated.Value(0),
        }

        this.state =initialState;
        this.loadCurso = this._loadCurso.bind(this);
        this.loadCast = this._loadCast.bind(this);
    }
    player = null;

    async componentDidMount() {
      try {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
        await Audio.setIsEnabledAsync(true);
      
      } catch (e) {
     
      }
    }

    pad(n, width, z=0) {
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    async setScreenOrientation(o = false){
      try {
        if(o===true){
          await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
        } else {
          await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
        }
      } catch (error) {
        
      }
    }

    componentWillUnmount(){
      this.setScreenOrientation(false);
    }

    componentWillUpdate(){
      this.setScreenOrientation(this.state.show);
      if(this.state.show===false) return (<View></View>)
    }
    
    componentWillMount() {
   
        this._y = 0;
        this._animation = new Animated.Value(0);
        this._animation.addListener(({ value }) => {
          this._y = value;
          if(this._y<100){
            this.setScreenOrientation(true);
          } else if(this._y>=100){
            this.setScreenOrientation(false);
          }
        });
    
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => {
            this.showVideoPlayerControls();
            return true;
          },
          onMoveShouldSetPanResponder: () => true,
          onPanResponderMove: Animated.event([
            null,
            {
              dy: this._animation,
            },
          ]),
          onPanResponderRelease: (e, gestureState) => {
            if (gestureState.dy > 100) {
              Animated.timing(this._animation, {
                toValue: 300,
                duration: 200,
              }).start();
              this._animation.setOffset(300);
            } else {
              this._animation.setOffset(0);
              Animated.timing(this._animation, {
                toValue: 0,
                duration: 200,
              }).start();
            }
          },
        });
      }

      showVideoPlayerControlsTO = null;
      showVideoPlayerControls(){
        clearTimeout(this.showVideoPlayerControlsTO);
        Animated.timing(this.state.videoPlayerControlsShow, {
          toValue: 1,
          duration: 500,
        }).start(()=>{
          this.showVideoPlayerControlsTO = setTimeout(()=>{
            Animated.timing(this.state.videoPlayerControlsShow, {
              toValue: 0,
              duration: 500,
            }).start()
          },3500);
        });
      }

      handleOpen() {
        if(this.state.show===true) return; 
        try{
          this.setState({show: true}, ()=>{
            this._animation.setOffset(0);
            Animated.timing(this._animation, {
              toValue: 0,
              duration: 200,
            }).start();
          });
        }catch(e){
          console.log(e)
        }
      }

      show() {
        this.setState({show: true});
      }

      cleanState(){
        this.setState({
          show: false,
          currentSource: "",
          currentPoster: "",
          currentTitle: "",
          currentListItem: "",
          currentListSubItem: "",
          currentPoster: "",
          currentMP3: "",
          list: {},
          listType: "",
          isLoadingList: true,
          currentLessonData: {},
          modal2:false,
          modal:false,
          notasModal: false,
          duvidaModal: false,
          totalLength: 0,
          currentPosition: 0
        });
      }

      hide() {
        this.player.stopAsync().then(()=>{
          this.cleanState();
        });
      }

      handleClose() {
        this._animation.setOffset(0);
        Animated.timing(this._animation, {
          toValue: 300,
          duration: 200,
        }).start(()=>{
          this.setState({show: false});
        });
      }

      showNota(licao = {}, modulo = {}, CURSO_ID = null){
        this.setState({notasModal: true, currentNota: '', currentNotaData: {licao, CURSO_ID}, isNotaLoading:true});
        this.store.request(`https://api.voitto.com.br/notas/${this.state.uid}/${CURSO_ID}/${licao.lic_js_id}`, `notas/${this.state.uid}/${CURSO_ID}/${licao.lic_js_id}`).then((s)=>{
          if (s.status == 'success') {
            this.setState({currentNota: s.nota.nota,isNotaLoading:false});
          }
        });
      }

      salvarNota(){
        this.setState({notasModal: false});
        let data = {
          id_curso: this.state.currentNotaData.CURSO_ID,
          id_licao: this.state.currentNotaData.licao.lic_js_id,
          user: this.state.uid,
          notas: this.state.currentNota
        }
        this.store.request(`https://api.voitto.com.br/notas/${this.state.uid}/${this.state.currentNotaData.CURSO_ID}`, `notas/${this.state.uid}/${this.state.currentNotaData.CURSO_ID}/${this.state.currentNotaData.licao.lic_js_id}`,'POST', data).then((s)=>{
          if (s.status == 'sucesso' || s.status == 'success') {
            this.setState({currentNota: '', currentNotaData: {}, isNotaLoading:false});
          }
        });
      }
      
      showDuvida(licao = {}, modulo = {}, CURSO_ID = null){
        this.setState({duvidaModal: true, currentDuvida: '', currentDuvidaData: {licao, modulo, CURSO_ID}});
      }

      enviarDuvida(){
        this.setState({isDuvidaSending: true});
        if(this.state.currentDuvida==='' && this.state.currentDuvidaTutor===null){
          this.setState({isDuvidaSending: false});
          return Alert.alert('Enviar Dúvida', 'Por favor, preencha todos os campos');
        }
        let data = {
          id_curso: this.state.currentDuvidaData.CURSO_ID,
          id_pessoa: this.state.uid,
          id_tutor: this.state.currentDuvidaTutor,
          id_licao: this.state.currentNotaData.licao.lic_js_id,
          mensagem: this.state.currentDuvida,
          id_modulo: this.state.currentNotaData.modulo.mod_js_id
        };
        this.store.request(`https://api.voitto.com.br/tickets/enviar/${this.state.uid}`, '', 'POST', data).then(s=>{
          if (s.status == 'success') {
            this.setState({currentDuvidaTutor:null, isDuvidaSending: false, duvidaModal: false, currentDuvida: '', currentDuvidaData: {}});
            // this.store.request(`https://api.voitto.com.br/tickets/enviar/${this.state.uid}`, '', 'POST', data);
          }
        });
      }

      _loadCurso = (id = null)=>{
        if(typeof id !== "string") return;
        if(id.length===0) return;
        //this.setState({isLoadingList: true, isLoadingVideo: true, list: {}, currentLessonData: {}});
        let uid = this.store.get_offline('usuario/id');
        if(uid==null) return;
        try{
          this.setState({uid});
          this.hide();
          setTimeout(()=>{
            this.handleOpen();
          }, 500);
          this.store.request(`https://api.voitto.com.br/ead/assistir/lazyjson/${uid}/${id}?authorization=master`, `plataforma/${id}`).then((s)=>{
              if(s.status=="success"){
                  this.checkListDownloaded(s);
              } else {
                  this.setState({isLoadingList: false, error: s.erro});
              }
          }).catch(e=>{
              this.setState({isLoadingList: false, error: "Não possí­vel carregar o curso agora. Tente novamente mais tarde."});
          });
        }catch(e)
        {
          console.log(e);
        }
        
      };

      _loadCast = (info = {})=>{
        ///http://api.soundcloud.com/tracks/ID_SOUND_CLOUD/stream?cliente_id=TOKEN_SOUND_CLOUD
        this.setState({
          isLoadingList: true,
          isLoadingVideo: true
        });
        setTimeout(()=>{
          this.handleOpen('_loadCast');
        }, 500);
        this.player.stopAsync().then(()=>{
          this.cleanState();
          this.setState({
            list: info,
            currentPoster: info.imagem+ '?size=' + width, 
            currentMP3: info.link_mp3,
            listType: 'cast',
            currentTitle: info.titulo,
            isLoadingList: false,
            isLoadingVideo: false
          });
        });
      };

      licaoIcon(tipo = ''){
        let icon = 'circle';  
        if (tipo == "video") {
            icone = 'video-camera';
        } else if (tipo == "youtubelive") {
            icone = 'video-camera';
        } else if (tipo == "youtube") {
            icone = 'video-camera';
        } else if (tipo == "arquivo") {
            icone = 'file';
        } else if (tipo == "link") {
            icone = 'external-link';
        } else if (tipo == "pesquisa") {
            icone = 'star-half-empty';
        } else if (tipo == "expectativa") {
            icone = 'chart';
        } else if (tipo == "apresentacao") {
            icone = 'group-object';
        } else if (tipo == "teste") {
            icone = 'check-square-o';
        } else if (tipo == "embed") {
            icone = 'square-o';
        } else if (tipo == "file-sender") {
            icone = 'upload';
        } else if(tipo == "feedback"){
            icone = 'file';
        } else if(tipo == "linkYT"){
            icone = 'upload';
        }
        return (<Icon.FontAwesome name={icone} size={12} style={{}} color={"#fff"} />);
      }

      async loadVideoFromVimeo(JS_ID = null, CURSO_ID = null){
        if(JS_ID === null) return; 
        if(CURSO_ID === null) return;
        let fi = {g: false, exists: false, uri: `${FileSystem.documentDirectory}download/${CURSO_ID}${JS_ID.lic_js_id}.mp4`};
        fi = await FileSystem.getInfoAsync(fi.uri, {size: false}).then(()=>{
          if(fi.exists===false){
            fetch(`https://api.voitto.com.br/App_ios/download_video?js_id=${JS_ID.lic_js_id}&curso_id=${CURSO_ID}`).then(res=>res.json()).then(res=>{
              this.setState({currentSource:res.link});
            })
          }else {
            //console.info(fi.uri)
            this.setState({currentSource:fi.uri});
          }
        });
  
      }

      setLicaoAsComplete(licao = {}, CURSO_ID = null, modulo = {}){
        let uid = this.store.get_offline('usuario/id');
        if(uid==null) return;
        if(this.state.settingLicaoAsComplete===true) return;
        this.setState({uid, currentLessonData: {}, settingLicaoAsComplete: true});

        let url = `https://api.voitto.com.br/ead_progresso2.json.php?aluno=${uid}&update=true`;
        let data = {curso:CURSO_ID, cursoid: CURSO_ID, modulojsid: modulo.mod_js_id, licaojsid: licao.lic_js_id, progress: 1};

        if(parseInt(licao.progresso)===1){
          url += `&reforcado=${Math.min(licao.reforcado + 1, 2)}`;
        }

        if(parseInt(licao.progresso)===1 && parseInt(licao.reforcado)===2) return;
        this.store.request(url, '', 'POST', data).then((s)=>{
          let c = this.state.list;
          if(typeof c.curso == 'undefined') return;
          let list = c.curso.modulos;
            for (let i = 0; i < list.length; i++) {
              const mod = list[i];
              for (let li = 0; li < mod.licoes.length; li++) {
                const lic = mod.licoes[li];
                if(licao.lic_js_id==lic.lic_js_id){
                  list[i].licoes[li].progresso = 1;
                  if(parseInt(licao.progresso)===1){
                    list[i].licoes[li].reforcado = Math.min(licao.reforcado + 1, 2);
                  }
                  break;
                }
              }
              if(modulo.mod_js_id==mod.mod_js_id){
                break;
              }
            }
            c.curso.modulos = list;
            this.setState({
              list: c,
              settingLicaoAsComplete: false
            });
            this.nextLesson();
            this.store.set(`plataforma/${CURSO_ID}`, c);
        }).catch(e=>{
        });
      }

      playFirstVideo(){
        let c = this.state.list;
        if(typeof c.curso == 'undefined') return;
        let list = c.curso.modulos;
        let isFirst = 0;
        for (let i = 0; i < list.length; i++) {
          const mod = list[i];
          for (let li = 0; li < mod.licoes.length; li++) {
            const lic = mod.licoes[li];
            if(lic.tipo==="video"){
              this.pressLicao(lic, c.curso.id, mod);
              isFirst = 1;
              break;
            }
          }
          if(isFirst===1) break;
        }
      }

      nextLesson(){
        let c = this.state.list;
        if(typeof c.curso == 'undefined') return;
        let list = c.curso.modulos;
        let isNext = 0;
        let nextL = [-1, -1];
        for (let i = 0; i < list.length; i++) {
          const mod = list[i];
          for (let li = 0; li < mod.licoes.length; li++) {
            const lic = mod.licoes[li];
            if(isNext===1){
              nextL = [i, li];
              isNext = 2;
              break;
            }
            if(this.state.currentListSubItem==lic.lic_js_id){
              isNext = 1;
            }
          }
          if(isNext===2){
            break;
          }
        }
        if(list[nextL[0]]!==undefined){
          if(list[nextL[0]].licoes[nextL[1]]!==undefined){
            if(nextL[0]!==list.length-1 && nextL[1]!==list[nextL[0]].length-1) {
              let l = list[nextL[0]].licoes[nextL[1]];
              this.pressLicao(l, c.curso.id, list[nextL[0]]);
            }
          }
        }
      }

      async pressLicao(licao = {}, CURSO_ID = null, modulo = {}){
        let tipo = licao.tipo;
        this.setState({currentTitle: licao.titulo, paused: true, currentLessonData: {licao, CURSO_ID, modulo}});
        if(this.player !== null){
          try {
            await this.player.stopAsync();
          } catch (error) {
          }
        }
        if (tipo === "video") {
          this.setState({isLoadingVideo: true, currentListSubItem: licao.lic_js_id});
          this.loadVideoFromVimeo(licao, CURSO_ID);
        } else {
          this.setLicaoAsComplete(licao, CURSO_ID, modulo);
        }
      }

      modalHandler(licao = {}, CURSO_ID = null){
        this.setState({
          modal:!this.state.modal,
          modalHandlerLicao: licao,
          modalHandleridcurso:CURSO_ID,
        })
    
        //this.props.screenProps.dwlicao(licao,CURSO_ID)
      }
      
      getDownloadIcon(licao = {}, CURSO_ID = null){
        if(typeof CURSO_ID !== "string") return;
        if(licao === {} || licao.tipo !== "video")return;
        return(
          <TouchableOpacity onPress={()=>this.modalHandler(licao,CURSO_ID)}>
            <Icon.Entypo name={"dots-three-vertical"} size={20} style={{}} color={"#fff"} />
          </TouchableOpacity>
        )
      }

      getRealizadoIcon(licao = {}){
        if(parseInt(licao.progresso)===1){
          if(parseInt(licao.reforcado)===1){
            return (<Icon.Ionicons name={Platform.select({
              ios: "ios-done-all",
              android: "md-done-all"
            })} size={20} style={{}} color={"#98ff68"} />);
          } else if(parseInt(licao.reforcado)===2){
            return (<Icon.Ionicons name={Platform.select({
              ios: "ios-done-all",
              android: "md-done-all"
            })} size={20} style={{}} color={"#ffe500"} />);
          } else {
            return (<Icon.Ionicons name={Platform.select({
              ios: "ios-checkmark",
              android: "md-checkmark"
            })} size={20} style={{}} color={"#98ff68"} />);
          }
        } else  {
          return null;
        }
      }

      async checkListDownloaded(c = {}){
        if(typeof c.curso == 'undefined') return;
          let list = c.curso.modulos;
          let changed = false;
          for (let i = 0; i < list.length; i++) {
            const modulo = list[i];
            for (let li = 0; li < modulo.licoes.length; li++) {
              const licao = modulo.licoes[li];
              if(!licao.downloaded){
                changed = true;
                try {
                  fi = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}download/${c.curso.id}${licao.lic_js_id}.mp4`, {size: false});
                  list[i].licoes[li].downloaded = fi.exists;
                } catch (error) {
                  list[i].licoes[li].downloaded = false;
                }
              }
            }
          }
          if(changed === false) return;
          c.curso.modulos = list;
          this.setState({
            list: c,
            isLoadingList: false,
            listType: 'curso'
          }, ()=>{
            this.playFirstVideo();
          });
      }

      listaCurso(){
        let c = this.state.list;
        if(typeof c.curso == 'undefined') return <View></View>;
        return (
            <View>
                <Text style={styles.cursoTitle}>{c.curso.titulo}</Text>
                {
                    c.curso.modulos.map((modulo, mi)=>(
                        <View key={mi} style={styles.accordion}>
                            <View>
                                <TouchableOpacity style={{flex:1}} onPress={()=>{
                                    let l = this.state.currentListItem===modulo.mod_js_id? '':modulo.mod_js_id; 
                                    this.setState({currentListItem: l});
                                    }}><Text style={styles.moduloTitle}>{modulo.titulo}</Text></TouchableOpacity>
                            </View>
                            <View style={[{display: 'none'}, this.state.currentListItem==modulo.mod_js_id && {display: 'flex'}]}>
                                {modulo.licoes.map((licao, li)=>(
                                    <View key={li} style={[styles.licao, this.state.currentListSubItem===licao.lic_js_id && {backgroundColor: 'rgba(255,255,255,0.2)'}]}>
                                        <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                                          <TouchableOpacity style={{flex:1,flexDirection: 'row', height: 40, justifyContent:'center', alignItems:'center'}} onPress={()=>{this.pressLicao(licao, c.curso.id)}}>
                                              {licao.downloaded && licao.downloaded===true? 
                                              <Icon.Ionicons name={Platform.select({ios: "ios-checkmark-circle-outline", android: "md-checkmark-circle-outline"})} size={12} style={{}} color={"#65c411"} />:
                                              this.licaoIcon(licao.tipo)}
                                              <Text style={styles.licaoTitle}>{licao.titulo}</Text>
                                              {this.getRealizadoIcon(licao)}
                                          </TouchableOpacity>
                                          {this.getDownloadIcon(licao, c.curso.id)}
                                        </View>
                                        {this.state.currentListSubItem===licao.lic_js_id?
                                          (<View style={styles.licaoOptions}>
                                          <TouchableOpacity onPress={()=>this.showNota(licao, modulo, c.curso.id)} style={styles.licaoOptionsButton}>
                                            <Text style={{color:Colors.text}}>Anotações</Text>
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={()=>this.showDuvida(licao, modulo, c.curso.id)} style={styles.licaoOptionsButton}>
                                            <Text style={{color:Colors.text}}>Enviar Dúvida</Text>
                                          </TouchableOpacity>
                                        </View>):
                                        <View></View>
                                        }
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                }
            </View>
        );
      }

      listaCast(){
        let c = this.state.list;
        if(c === {}) return <View></View>;
        if(c.titulo != "")
          return (
              <View>
                  <Text style={[styles.cursoTitle,{fontWeight:'900'}]}>{c.titulo}</Text>
                  <Text style={[styles.licaoTitle,{marginTop:20, fontSize:14}]}>{c.subtitulo}</Text>
              </View>
          );
        else
          return(
            <View>
              <Text style={[styles.cursoTitle,{fontWeight:'900'}]}>{c.subtitulo}</Text>
            </View>
          )
      }



      getTitle(){
        switch(this.state.listType){
          case 'curso':
          let c = this.state.list;
            if(c.renovacao === undefined) return;
            if(this.state.currentTitle === undefined) return;
            let titulo = (c.renovacao.curso_n).replace("ONLINE - ","");
            return (
              <View style={{flex: 0.4, flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>this.hide()} style={{marginRight:10, padding:2}} >
                  <Icon.Ionicons name={"ios-close"} size={22} style={{}} color={Colors.text} />
                </TouchableOpacity>
                <View >
                  <Text numberOfLines={1}  style={{color:'white'}}>{this.state.currentTitle}</Text>
                  <Text numberOfLines={1}  style={{color:'white', fontSize:10,}}>{titulo}</Text>
                </View> 
              </View>
            );   
          case 'cast':
            return (
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity onPress={()=>this.hide()} style={{marginRight:10}} >
                  <Icon.Ionicons name={"ios-close"} size={22} style={{}} color={Colors.text} />
                </TouchableOpacity>
                <View style={{ marginTop:'5%', width:'60%'}} >
                  <Text numberOfLines={1} style={{color:'white', marginBottom:'2%'}}>{this.state.currentTitle}</Text>
                  <Slider
                    maximumValue={this.state.totalLength}
                    value={this.state.currentPosition}
                    style={[styles.slider,{width:'100%'}]}
                    minimumTrackTintColor='#fff'
                    maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
                    thumbStyle={styles.thumb}
                    onValueChange={(res)=> this.player.setPositionAsync(res)}
                    trackStyle={styles.track}/>
                </View>
              </View>
            )
        }
      }

      async setPaused(){
        const paused = this.state.paused;
        this.showVideoPlayerControls();
        if(paused===true){
          try {
            await this.player.playAsync();
            setState({
              paused:false
            });
          } catch (error) {
          }
        } else {
          try {
            await this.player.pauseAsync();
            this.setState({
              paused:true
            });
            this.showVideoPlayerControls();
          } catch (error) {
            
          }
        }
      }
      
     

      listaPlayerVTS(){
        return(
          <View style={{ flexDirection:'row',marginTop:20,alignSelf:'center', alignItems:'center',justifyContent:'space-between' }}>
              <TouchableOpacity>
                <Image source={require('../assets/images/icones/ic_left.png')} style={{width:40,height:40,marginRight:20}}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconplay} onPress={()=>this.setPaused()}>
                {this.state.paused? 
                  <Image source={require('../assets/images/icones/ic_play.png')} style={{width:60,height:70}}/>:
                  <Image source={require('../assets/images/icones/ic_pause.png')} style={{width:60,height:70}}/>
                }
              </TouchableOpacity>
              <TouchableOpacity >
                <Image source={require('../assets/images/icones/ic_right.png')} style={{width:40,height:40,marginLeft:20}}/>
              </TouchableOpacity>
          </View>
        )
      }

      listaPlayer(){
        return(
          <View style={{ flexDirection:'row',marginTop:20,alignSelf:'center', alignItems:'center',justifyContent:'space-between' }}>
              <TouchableOpacity style={this.state.isLoadingVideo===false && styles.iconplay} onPress={()=>this.setPaused()}>
                {this.state.isLoadingVideo===true?
                <ActivityIndicator style={{width:60,height:70}} color={Colors.text} />:
                (this.state.paused? 
                  <Image source={require('../assets/images/icones/ic_play.png')} style={{width:60,height:70}}/>:
                  <Image source={require('../assets/images/icones/ic_pause.png')} style={{width:60,height:70}}/>
                )}
              </TouchableOpacity>
          </View>
        )
      }

      msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
          seconds = parseInt((duration / 1000) % 60),
          minutes = parseInt((duration / (1000 * 60)) % 60),
          hours = parseInt((duration / (1000 * 60 * 60)) % 24);
        
        hours = !isNaN(hours) ? hours : 0;
        minutes = !isNaN(minutes) ? minutes : 0;
        seconds = !isNaN(seconds) ? seconds : 0;

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return  (hours!=='00'? hours+":": '') + minutes + ":" + seconds ;
      }
      
      listaSeekbar(){
        return( 
        <View style={[styles.container,{flexDirection:'row', alignSelf:'center', marginTop:60}]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text, {width: 40}]}>{this.msToTime(this.state.currentPosition)}</Text>
            <View style={{flex: 1}} />
          </View>
          <Slider
            maximumValue={this.state.totalLength}
            value={this.state.currentPosition}
            style={styles.slider}
            minimumTrackTintColor='#fff'
            maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
            thumbStyle={styles.thumb}
            onValueChange={(res)=> this.player.setPositionAsync(res)}
            trackStyle={styles.track}/>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text, {width: 40}]}> {this.msToTime(this.state.totalLength - this.state.currentPosition)}</Text>
            <View style={{flex: 1}} />
          </View>
          <TouchableOpacity>

          </TouchableOpacity>
        </View>
        )
      }

      listaSeekbarVTS(){
        
        return( 
        <View style={[styles.container,{flexDirection:'row', alignSelf:'center', marginTop:60}]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text, {width: 40}]}>{this.msToTime(this.state.currentPosition)}</Text>
            <View style={{flex: 1}} />
          </View>
          <Slider
            maximumValue={this.state.totalLength}
            value={this.state.currentPosition}
            style={styles.slider}
            minimumTrackTintColor='#fff'
            maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
            thumbStyle={styles.thumb}
            onValueChange={(res)=> this.player.setPositionAsync(res)}
            trackStyle={styles.track}/>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text, {width: 40}]}> {this.msToTime(this.state.totalLength - this.state.currentPosition)}</Text>
          <View style={{flex: 1}} />
          </View>
        </View>
        )
      }

      lista(){
        
          if(this.state.isLoadingList===true) return (<View style={{margin: 15}}><ActivityIndicator color={Colors.input} /></View>);
          switch (this.state.listType) {
            case 'curso':
              return this.listaCurso();    
            break;
            case 'cast':
              return (
                <View>
                  {this.listaCast()}
                  {this.listaSeekbarVTS()}
                  {this.listaPlayerVTS()}
                </View>
              );    
            break;
          
              default:
              return <View></View>;
                  break;
          }
      }


      openFastLearn(){
        this.setState({
          modal:false
        });
        setTimeout(() => {
          this.setState({
            modal2:true,
          })
        }, 500);
      }

      fastLearn(velocity = null)
      {
        if(velocity === null) return;
        this.setState({
          fastLearn:velocity,
          modal2:false,
        })
      }

      setDuration(data) {
        this.showVideoPlayerControls();
        this.setState({
          totalLength: Math.floor(data.durationMillis),
        });
        this.player.playAsync();
      }

      setProgress(data) {
        if(data.positionMillis/this.state.totalLength >= 1 && !data.isPlaying){
          this.setState({settingLicaoAsComplete: true});
          if(this.state.currentLessonData != {}){
            let l = this.state.currentLessonData;
            this.setLicaoAsComplete(l.licao, l.CURSO_ID, l.modulo);
          }
        }
        if(!data.isPlaying!==this.state.paused){
          return this.setState({
            paused: !data.isPlaying,
            currentPosition: Math.floor(data.positionMillis),
          });
        }
        if(data.isPlaying===this.state.isLoadingVideo) {
          return this.setState({
            isLoadingVideo: false,
            currentPosition: Math.floor(data.positionMillis),
          });
        }
        this.setState({
          currentPosition: Math.floor(data.positionMillis),
        });
      } 

      getTutores(){
        let c = this.state.list;
        if(c.curso!==undefined && c.curso.tutores!==undefined){
          return (<View style={{flexDirection: 'row', padding: 5, width: width - 50}}>
            {c.curso.tutores.map((tutor, ti)=>(
              <TouchableOpacity onPress={()=>this.setState({currentDuvidaTutor: tutor.email})} style={[styles.tutor, this.state.currentDuvidaTutor===tutor.email && {borderWidth: 2, borderColor: Colors.buttonlogin}]}>
                <ImageCache style={styles.tutorImage} source={tutor.foto} />
              </TouchableOpacity>
            ))}
          </View>);
        } else {
          return <View></View>;
        }
      }

      render() {

          const { width, height: screenHeight  } = Dimensions.get("window");
          const videoHeight = width * 0.5625;
          const space = Platform.select({
              ios: Constants.deviceName.toLowerCase()==='iphone x'? 147: 63,
              android: 18
          });
          const reduceScale = 0.4;
          const padding = 15;
          const statusBarHeight = 0;
          const yOutput = ((screenHeight - videoHeight - space) + (( videoHeight * .5) / 2)) - padding - statusBarHeight;
          const xOutput = ((width * .5) / 2) - padding + 5;
      
          const opacityInterpolate = this._animation.interpolate({
            inputRange: [0, 300],
            outputRange: [1, 0],
          });
      
          const translateYInterpolate = this._animation.interpolate({
            inputRange: [0, 300],
            outputRange: [0, yOutput],
            extrapolate: "clamp",
          });
      
          const scaleInterpolate = this._animation.interpolate({
            inputRange: [0, 300],
            outputRange: [1, reduceScale],
            extrapolate: "clamp",
          });
      
          const translateXInterpolate = this._animation.interpolate({
            inputRange: [0, 300],
            outputRange: [0, xOutput],
            extrapolate: "clamp",
          });
      
          const scrollStyles = {
            opacity: opacityInterpolate,
            transform: [
              {
                translateY: translateYInterpolate,
              },
            ],
          };
  
          const miniPlayerDisplayInterpolate = this._animation.interpolate({
            inputRange: [100, 300],
            outputRange: [0, 1]
          });
  
          const spacerCorrect = Platform.select({
            ios: Constants.deviceName.toLowerCase()==='iphone x'? -84: 0,
            android: 51.3
          });
          const spacerCorrect2 = Platform.select({
            ios: 0,
            android: 40
          });
  
          const miniPlayerStyles = {
            opacity: miniPlayerDisplayInterpolate,
            height: videoHeight*reduceScale,
            width: width - space - spacerCorrect2, 
            top: yOutput + space + spacerCorrect ,
            left: (space * reduceScale) + (spacerCorrect2/2),
          };
  
          const videoPlayerStyles = {
            opacity: opacityInterpolate
          }
      
          const videoStyles = {
            transform: [
              {
                translateY: translateYInterpolate,
              },
              {
                translateX: translateXInterpolate,
              },
              {
                scale: scaleInterpolate,
              },
            ],
          };
         
          return (
            <View style={this.state.show===true? StyleSheet.absoluteFill: {display:'none'}} pointerEvents="box-none">
              <Animated.View style={[styles.miniPlayer, miniPlayerStyles,{backgroundColor:"#454545"}]}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    {this.getTitle()}
                </View>
              </Animated.View>
              <Animated.View
                style={[{ width, height: videoHeight, backgroundColor: '#000' }, videoStyles]}
                {...this._panResponder.panHandlers}>
                  <Video 
                    source={{uri: this.state.listType==="cast"? 'https://s3.amazonaws.com/imagens-voitto/'  + this.state.currentMP3: this.state.currentSource, 
                    overrideFileExtensionAndroi:"mp4"
                  }}
                    rate={this.state.fastLearn}
                    volume={1.0}
                    isMuted={false}
                    useNativeControls={false} 
                    onPlaybackStatusUpdate={this.setProgress.bind(this)} 
                    onLoad={this.setDuration.bind(this)}
                    ref={(ref)=>this.player = ref}
                    style={StyleSheet.absoluteFill} />


                {this.state.listType==='cast'?
                  <View>
                    <Image resizeMode="contain" source={{uri:this.state.currentPoster}} style={[{ width, height: videoHeight, backgroundColor: Colors.primary}, StyleSheet.absoluteFill]} />
                  </View>
                :<View>

                </View>}
                {/* <Animated.View style={[StyleSheet.absoluteFill, styles.playerControls, miniControlsStyle]}>
                 
                </Animated.View> */}
              {
                this.state.listType==="curso"?
                (<Animated.View style={[
                  styles.videoPlayerControls,
                  {width, height: videoHeight, zIndex: 10},
                  videoPlayerStyles,
                  (this.state.listType==='curso' && 
                  this.state.paused===false) && {opacity: 1}]}>
                   <View style={[styles.videoPlayerControls, {flex:1, width, height: videoHeight - 20}]}>{this.listaPlayer()}</View>
                   <View style={{position: 'absolute', bottom: 5, flex:1}}>{this.listaSeekbar()}</View>
                 </Animated.View>)
                 :<View></View>
              }  
              </Animated.View>
              <Animated.ScrollView style={[styles.scrollView, scrollStyles]}>
                <View style={[styles.playlist, styles.padding, {paddingTop: 5}]}>
                  {this.lista()}
                </View>
              </Animated.ScrollView>
               
                <Modal isVisible={this.state.modal}>
                  <View style={{backgroundColor:'#333', position: 'absolute', bottom:0, flex: 1}}>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>{this.props.screenProps.dwlicao(this.state.modalHandlerLicao,this.state.modalHandleridcurso);this.modalHandler();setTimeout(() => {Alert.alert("Donwload","O download dessa lição foi iniciado.")}, 500);}}>
                      <Text style={styles.textbuttonModal}>Baixar Lição</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton}  onPress={()=>{this.openFastLearn();this.modalHandler()}}>
                      <Text style={styles.textbuttonModal}>Voitto FastLearn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>this.modalHandler()}>
                      <Text style={styles.textbuttonModal}>Voltar</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                <Modal isVisible={this.state.modal2}>
                  <View style={{backgroundColor:'#333', flex: 1, position: 'absolute',bottom:0}}>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>this.fastLearn(0.8)}>
                      <Text style={styles.textbuttonModal}>0.5x</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>this.fastLearn(1.0)}>
                      <Text style={styles.textbuttonModal}>Normal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>this.fastLearn(1.2)}>
                      <Text style={styles.textbuttonModal}>1.5x</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>this.fastLearn(1.3)}>
                      <Text style={styles.textbuttonModal}>2.0x</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={()=>this.setState({modal2:false})}>
                      <Text style={styles.textbuttonModal}>Voltar</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                <Modal isVisible={this.state.notasModal}>
                  <View style={{flex: 1, position: 'absolute',bottom:0,backgroundColor:'#333', width: width - 40, height: screenHeight - height}}>
                    {this.state.isNotaLoading===true? <View style={{flex: 1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator color={Colors.text} /></View>:
                    <View style={{flex: 1}}>
                      <View style={{flexDirection:'row'}}>
                        <Button onPress={()=>this.salvarNota()} style={{flex: 1}} color={Colors.buttonlogin}><Text style={{color:Colors.text}}>Salvar</Text></Button>
                        <Button onPress={()=>this.setState({notasModal:false})}><Icon.Ionicons name={Platform.select({ios:'ios-close',android:'md-close'})} color={Colors.text} size={16} /></Button>
                      </View>
                      <Input placeholder={"Escreva aqui suas anotações para esta lição..."} onChangeText={(text)=>this.setState({currentNota:text})} value={this.state.currentNota} multiline={true} style={{flex: 1, marginTop: 10}} />
                    </View>}
                  </View>
                </Modal>

                <Modal isVisible={this.state.duvidaModal}>
                  <View style={{flex: 1, position: 'absolute',bottom:0,backgroundColor:'#333', width: width - 40, height: screenHeight - height}}>
                    <View style={{flex: 1}}>
                      <View style={{flexDirection:'row'}}>
                        <Button loading={this.state.isDuvidaSending} onPress={()=>this.enviarDuvida()} style={{flex: 1}} color={Colors.buttonlogin}><Text style={{color:Colors.text}}>Enviar</Text></Button>
                        <Button loading={this.state.isDuvidaSending} onPress={()=>this.setState({duvidaModal:false})}><Icon.Ionicons name={Platform.select({ios:'ios-close',android:'md-close'})} color={Colors.text} size={16} /></Button>
                      </View>
                      {this.getTutores()}
                      <Input placeholder={"Escreva aqui sua dúvida..."} loading={this.state.isDuvidaSending} onChangeText={(text)=>this.setState({currentDuvida:text})} value={this.state.currentDuvida} multiline={true} style={{flex: 1, marginTop: 10}} />
                    </View>
                  </View>
                </Modal>
                
            </View>

            
        );
     
      }
    }
    const sombra = Platform.select({
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
    });
    const styles = StyleSheet.create({
      textbuttonModal:{
        color:'white',
        textAlign:'center',
        fontSize:16,
        fontWeight:'600'
      },
      modalButton:{
        padding:20,
        borderWidth:1,
        backgroundColor:'#333',
        borderColor:"#242424",
        flex: 1,
        width: width - 40
      },
      scrollView: {
        flex: 1,
        backgroundColor: Colors.primary,
      },
      title: {
        fontSize: 28,
      },
      padding: {
        paddingVertical: 15,
        paddingHorizontal: 15,
      },
      playlistUpNext: {
        fontSize: 24,
      },
      cursoTitle: {
        color: '#eee',
        fontSize: 16,
        marginBottom: 10,
      },
      accordion: {
          backgroundColor: '#333',
          padding: 10,
          marginBottom: 10,
          ...sombra
      },
      moduloTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#eee',
      },
      licao:{
        padding: 5,
        marginVertical: 5,
        minHeight: 40,
        justifyContent: "center"
      },
      licaoTitle: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 5,
        marginRight:5,
        flex: 1
      },
      miniPlayerText: {
        color: Colors.primary,
        fontWeight: 'bold',
        marginLeft: 10
      },
      miniPlayerButton: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      miniPlayer: {
        backgroundColor: '#f9f9f9',
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
      },
      playerControls: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      iconplay:{ 
        borderWidth:1.5,
        borderColor:'white',
        width:75, 
        alignItems:'center',
        borderRadius:75,
      },
      slider: {
        marginTop: -12, 
        width:'75%'
      },
      container: {
        marginTop:50,
      },
      track: {
        height: 2,
        borderRadius: 1,
      },
      thumb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
      },
      text: {
        color: 'rgba(255, 255, 255, 0.72)',
        fontSize: 12,

      },
      playPauseButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60,
        paddingLeft: 5,
        paddingTop: 5,
        marginVertical: 5,
        fontSize: 60
      },
      titleView:{
        width:'50%',
      },
      videoPlayerControls: {
        top: 0,
        left: 0,
        right: 0,
        position:'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      },
      licaoOptions: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
      },
      licaoOptionsButton: {
        marginHorizontal: 5,
        padding: 10,
        borderColor: Colors.text,
        borderWidth: 0.5,
        borderRadius: 5
      },
      tutor: {
        width: 35,
        height: 35,
        borderRadius: 15,
        marginVertical: 5
      },
      tutorImage: {
        width: 35,
        height: 35,
        borderRadius: 15,
        backgroundColor: '#eee'
      }
});
    