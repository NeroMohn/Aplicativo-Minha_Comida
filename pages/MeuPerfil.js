import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Dimensions,
    Animated,
    Alert,
    Linking,
    Picker,
} from 'react-native';
  
import {Icon,ImagePicker,Permissions} from 'expo';
import Modal from "react-native-modal";

import axios from 'axios';
import Colors from '../constants/Colors';
import Input from '../components/Input';
import Layout from '../constants/Layout';
import ImageCache from '../components/ImageCache';
import Button from '../components/Button';
import { withNativeAd } from 'expo/build/facebook-ads';

const width = Layout.window.width;
const height = Layout.window.width * 0.5625;
const {screenHeight } = Dimensions.get("window");

const HEADER_MAX_HEIGHT = height;
const HEADER_MIN_HEIGHT = 55;

var ID = 0;
export default class MeuPerfil extends React.Component {
    static navigationOptions = {
      header: null,
    };
  
    constructor(props){
      super(props);
        this.store = this.props.screenProps.s;
        this.state = {
            id_user:'',
            imageSource:null,
            empty: require('./../assets/images/no-image.jpg'),
            userData: this.store.get_offline('usuario'),
            isLoading:false,
            nome:'',
            email:'',
            celular:'',
            alterado:false, 
            cep:'',
            endereco:'',
            numero:'',
            bairro:'',
            complemento:'',
            cidade:'',
            estado:'AC',
            estadosmodal:false,
        };
    }

    useCameraHandler = async () => {
        const permissions = Permissions.CAMERA_ROLL;
        const status = await Permissions.getAsync(permissions);
        var image = '';
        var result = '';
        if (status !== 'granted') {
            result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                base64: true
            });
            if (!result.cancelled) {
                this.setState({isLoading:true})
                let localUri = result.uri;
                let filename = localUri.split('/').pop();
              
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
              
                let formData = new FormData();
                formData.append('photo', { uri: localUri, name: new Date()+'.png', type });
                formData.append('id_user',ID);
                
                return await fetch('https://api.voitto.com.br/alunos/atualizaImagem?authorization=master', {
                  method: 'POST',
                  body: formData,
                  header: {
                    'content-type': 'multipart/form-data',
                  },
                }).then((res)=>{
                    this.setState(
                        {
                            imageSource:JSON.parse(res._bodyInit).archiev,
                            isLoading:false,
                        }
                    );
                    Alert.alert(JSON.parse(res._bodyInit).callback)
                });
            }
        }             
    }   

    loadUserInfos(){
        this.setState({isLoading:true});
        this.store.request(`https://api.voitto.com.br/alunos/pessoa/${this.state.userData.id}?authorization=master`).then((s)=>{
            s.forEach((v)=>{
                infos = v;
            })
            this.setState({
                isLoading:false,
                nome:infos.nome,
                celular:infos.celular,
                email:infos.email,
                imageSource:infos.foto,
                cidade:infos.cidade,
                estado:infos.estado,
                complemento:infos.complemento,
                bairro:infos.bairro,
                endereco:infos.endereco,
                numero:infos.numero,
                cep:infos.cep,
            });
            ID = this.state.userData.id;
        }).catch(e=>{
          this.setState({
            isLoading:false
          });
        });
    }


    updUserInfos(){
        let formData = new FormData();
        formData.append('id',this.state.userData.id)
        formData.append('nome',this.state.nome)
        formData.append('email',this.state.email)
        formData.append('celular',this.state.celular)
        formData.append('cep',this.state.cep)
        formData.append('endereco',this.state.endereco)
        formData.append('numero',this.state.numero)
        formData.append('bairro',this.state.bairro)
        formData.append('complemento',this.state.complemento)
        formData.append('cidade',this.state.cidade);
        formData.append('estado',this.state.estado);

        fetch('https://api.voitto.com.br/alunos/upd_infos?authorization=master', {
            method: 'POST',
            header: {
                'content-type': 'multipart/form-data',
            },
            body: formData,
        }).then((res)=>{
            console.log(JSON.parse(res._bodyInit))
            Alert.alert(JSON.parse(res._bodyInit).callback)
        })
        .catch((res)=>{
            console.log(JSON.parse(res._bodyInit))
        })
    }

    renderpickers(ios=0){
        return(
            (ios)
            ?<Picker
                selectedValue = {this.state.estado}
                itemStyle={{color: "white"}} 
                onValueChange = {(estado) => this.onChangeHandler('estado',estado)}
                style={{ height: (!ios)?50:50, width: '100%',color:Colors.text }
            }
            >                      
                    <Picker.Item color="white" value="AC" label ="Acre" />
                    <Picker.Item color="white" value="AL" label ="Alagoas" />
                    <Picker.Item color="white" value="AP" label ="Amapá" />
                    <Picker.Item color="white" value="AM" label ="Amazonas" />
                    <Picker.Item color="white" value="BA" label ="Bahia" />
                    <Picker.Item color="white" value="CE" label ="Ceará" />
                    <Picker.Item color="white" value="DF" label ="Distrito Federal" />
                    <Picker.Item color="white" value="ES" label ="Espírito Santo" />
                    <Picker.Item color="white" value="GO" label ="Goiás" />
                    <Picker.Item color="white" value="MA" label ="Maranhão" />
                    <Picker.Item color="white" value="MT" label ="Mato Grosso" />
                    <Picker.Item color="white" value="MS" label ="Mato Grosso do Sul" />
                    <Picker.Item color="white" value="MG" label ="Minas Gerais" />
                    <Picker.Item color="white" value="PA" label ="Pará" />
                    <Picker.Item color="white" value="PB" label ="Paraíba" />
                    <Picker.Item color="white" value="PR" label ="Paraná" />
                    <Picker.Item color="white" value="PE" label ="Pernambuco" />
                    <Picker.Item color="white" value="PI" label ="Piauí" />
                    <Picker.Item color="white" value="RJ" label ="Rio de Janeiro" />
                    <Picker.Item color="white" value="RN" label ="Rio Grande do Norte" />
                    <Picker.Item color="white" value="RS" label ="Rio Grande do Sul" />
                    <Picker.Item color="white" value="RO" label ="Rondônia" />
                    <Picker.Item color="white" value="RR" label ="Roraima" />
                    <Picker.Item color="white" value="SC" label ="Santa Catarina" />
                    <Picker.Item color="white" value="SP" label ="São Paulo" />
                    <Picker.Item color="white" value="SE" label ="Sergipe" />
                    <Picker.Item color="white" value="TO" label ="Tocantins" />       
            </Picker> 
            :<Picker
                selectedValue = {this.state.estado}
                itemStyle={{color: "white"}} 
                onValueChange = {(estado) => this.onChangeHandler('estado',estado)}
                style={{ height: (!ios)?50:50, width: '100%',color:Colors.text }
            }
            >                      
                    <Picker.Item value="AC" label ="Acre" />
                    <Picker.Item value="AL" label ="Alagoas" />
                    <Picker.Item value="AP" label ="Amapá" />
                    <Picker.Item value="AM" label ="Amazonas" />
                    <Picker.Item value="BA" label ="Bahia" />
                    <Picker.Item value="CE" label ="Ceará" />
                    <Picker.Item value="DF" label ="Distrito Federal" />
                    <Picker.Item value="ES" label ="Espírito Santo" />
                    <Picker.Item value="GO" label ="Goiás" />
                    <Picker.Item value="MA" label ="Maranhão" />
                    <Picker.Item value="MT" label ="Mato Grosso" />
                    <Picker.Item value="MS" label ="Mato Grosso do Sul" />
                    <Picker.Item value="MG" label ="Minas Gerais" />
                    <Picker.Item value="PA" label ="Pará" />
                    <Picker.Item value="PB" label ="Paraíba" />
                    <Picker.Item value="PR" label ="Paraná" />
                    <Picker.Item value="PE" label ="Pernambuco" />
                    <Picker.Item value="PI" label ="Piauí" />
                    <Picker.Item value="RJ" label ="Rio de Janeiro" />
                    <Picker.Item value="RN" label ="Rio Grande do Norte" />
                    <Picker.Item value="RS" label ="Rio Grande do Sul" />
                    <Picker.Item value="RO" label ="Rondônia" />
                    <Picker.Item value="RR" label ="Roraima" />
                    <Picker.Item value="SC" label ="Santa Catarina" />
                    <Picker.Item value="SP" label ="São Paulo" />
                    <Picker.Item value="SE" label ="Sergipe" />
                    <Picker.Item value="TO" label ="Tocantins" />       
            </Picker> 
        )
    }

    onChangeHandler(field,value){
        this.setState({
            [field]:value,
            alterado:true,
        })
        if(field=='cep'){
            if(this.state.cep.length==9){
                fetch(`https://viacep.com.br/ws/${this.state.cep}/json`)
                    .then((res)=>{
                        var {_bodyInit} = res;
                        let json = JSON.parse(_bodyInit)
                        if(json.localidade!='')this.onChangeHandler('cidade',json.localidade)
                        if(json.uf!='')this.onChangeHandler('estado',json.uf)
                        if(json.complemento!='')this.onChangeHandler('complemento',json.complemento)
                        if(json.bairro!='')this.onChangeHandler('bairro',json.bairro)
                        if(json.logradouro!='')this.onChangeHandler('endereco',json.logradouro)
                        if(json.unidade!='')this.onChangeHandler('numero',json.unidade)
                    }
                )
            }
        }
    }

    componentDidMount(){
        this.loadUserInfos();
    }

    render() {
        return (
            <View style={[styles.container]}>
                {this.state.isLoading===true
                    ?<View style={styles.loadingSty}><ActivityIndicator color={Colors.text} /></View>
                    :<ScrollView style={{flex:1}} scrollEventThrottle={16}
                            onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                        )}>
                            <View style={styles.bar}>
                                <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={styles.backButtom}>
                                <Icon.Ionicons name={Platform.select({ios: "ios-arrow-back", android: 'md-arrow-back'})} size={20} color={Colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.title}>Edição de perfil</Text>
                            </View>
                            <TouchableOpacity onPress={this.useCameraHandler}>
                                <Image
                                    style={styles.imagePrev}
                                    source={(this.state.imageSource!=null)?{uri:this.state.imageSource}:{uri:'https://www.voitto.com.br/assets/images/no-image.jpg'}}
                                />
                            </TouchableOpacity>
                            <View style={styles.formContent}>
                                <Text style={[styles.fieldset,{color:Colors.text}]}>Dados Básicos</Text>
                                <Input placeHolderColor={"#FFF"} placeholder="Nome" value={this.state.nome} onChangeText={nome=> this.onChangeHandler('nome',nome)} style={styles.inputForm} textColor={Colors.text} />
                                <Input placeHolderColor={"#FFF"} placeholder="Email" value={this.state.email} onChangeText={email=>this.onChangeHandler('email',email)} style={styles.inputForm} textColor={Colors.text} />
                                <Input placeHolderColor={"#FFF"} placeholder="Celular" value={this.state.celular} onChangeText={celular=>this.onChangeHandler('celular',celular)} style={styles.inputForm} textColor={Colors.text} />

                                <Text style={[styles.fieldset,{color:Colors.text,marginTop:10}]}>Dados Pessoais</Text>

                                <Input placeHolderColor={"#FFF"} placeholder="CEP" value={this.state.cep} onChangeText={cep=>this.onChangeHandler('cep',cep)} style={styles.inputForm} textColor={Colors.text} />
                                <Text style={{textAlign:'center',color:Colors.text,marginBottom:5}} onPress={()=>{Linking.openURL('http://www.buscacep.correios.com.br/sistemas/buscacep/');}}>
                                    Não sei meu CEP
                                </Text> 
                                <Input placeHolderColor={"#FFF"} placeholder="Endereço" value={this.state.endereco} onChangeText={endereco=>this.onChangeHandler('endereco',endereco)} style={styles.inputForm} textColor={Colors.text} />
                                <Input placeHolderColor={"#FFF"} placeholder="Número" value={this.state.numero} onChangeText={numero=>this.onChangeHandler('numero',numero)} style={styles.inputForm} textColor={Colors.text} />
                                <Input placeHolderColor={"#FFF"} placeholder="Bairro" value={this.state.bairro} onChangeText={bairro=>this.onChangeHandler('bairro',bairro)} style={styles.inputForm} textColor={Colors.text} />
                                <Input placeHolderColor={"#FFF"} placeholder="Complemento" value={this.state.complemento} onChangeText={complemento=>this.onChangeHandler('complemento',complemento)} style={styles.inputForm} textColor={Colors.text} />
                                <Input placeHolderColor={"#FFF"} placeholder="Cidade" value={this.state.cidade} onChangeText={cidade=>this.onChangeHandler('cidade',cidade)} style={styles.inputForm} textColor={Colors.text} />
                                {Platform.OS === 'ios'
                                ?<Button style={{borderRadius:10}}  onPress={()=>this.setState({estadosmodal:!this.state.estadosmodal})} color={'rgba(0,0,0,.5)'}><Text style={{color:Colors.text}}>{this.state.estado}</Text></Button>
                                :this.renderpickers()
                                }    
                                {Platform.OS === 'ios'?<Modal isVisible={this.state.estadosmodal}>
                                    <View style={{flex: 1, position: 'absolute',bottom:0,backgroundColor:'#333', width: width - 40, height: '50%'}}>
                                    
                                        <TouchableOpacity onPress={()=>this.setState({estadosmodal:!this.state.estadosmodal})}>
                                            <Icon.Ionicons name="ios-close" style={{padding:10,alignSelf:'flex-end'}} size={30} color={Colors.text} />
                                        </TouchableOpacity>

                                        <View style={{flex: 1,justifyContent:'center',alignItems:'center',marginBottom:'35%'}}>
                                            {this.renderpickers(1)}
                                        </View>
                                    </View>
                                </Modal>:null}   
                            </View>
                            <Button style={{marginBottom:50}}  onPress={()=>{this.updUserInfos()}} color={this.state.alterado?Colors.buttonlogin:Colors.buttonDisabled}><Text style={{color:Colors.text}}>Salvar perfil</Text></Button>
                    </ScrollView>
                }
            </View>
        )
    }

}


const space = Platform.select({ios: 0, android: 20});
const margin = Platform.select({ios: 0, android: 20});



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    loadingSty:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    addBtnSty:{
        opacity:0.6
    },
    imagePrev:{
        alignSelf:'center',
        width: '100%',
        borderRadius:90,
        height: 185,
        aspectRatio:1,
    },
    label:{
        backgroundColor: '#222',
        color:'#FFF',
        borderRadius: 10,
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15,
        margin: 10,
        minHeight: 40,
    },
    textbuttonModal:{
        color:'white',
        textAlign:'center',
        fontSize:16,
        fontWeight:'600'
      },
    formContent:{
        marginTop:'5%',
        marginBottom:'5%',
    },
    backButtom: {
        width: HEADER_MIN_HEIGHT * 0.7,
        height: HEADER_MIN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:space,
        marginBottom:margin,
    },
    title: {
        backgroundColor: 'transparent',
        color: Colors.text,
        fontSize: 18,
        paddingHorizontal: 15,
        flex: 1,
        marginTop:space,
        marginBottom:margin,
        //textAlign:'center'
    },
    bar: {
        height: HEADER_MIN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop:space
    },
    fieldset:{
        margin:3,
    },
    inputForm:{
        backgroundColor: 'rgba(0,0,0,.5)',
        borderWidth: 0,
        margin:3,
    }
})
