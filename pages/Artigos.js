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
  Dimensions
} from 'react-native';
import Colors from '../constants/Colors';
import Input from '../components/Input';
import ImageCache from '../components/ImageCache';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const width = screenWidth - 20;
const height = width * 0.5625;

export default class Artigos extends React.Component {
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
      blog: [],
      backup: [],
      search: ""
    };
  }

  checkIfExists(id){
    for (const art of this.state.blog) {
      if(art.id===id) return true;
    }
    return false;
  }

  loadArtigos(){
    this.setState({isLoading:true});
    this.store.request(`https://api.voitto.com.br/blog/blogartigos/${this.state.page}/${this.state.limit}`).then((s)=>{
      if(!s.status){
          let curBlog = this.state.backup;
          for (const art of s) {
            if(!this.checkIfExists(art.id)) curBlog.push(art);
          }
          this.setState({
            blog: curBlog,
            backup: curBlog,
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
    let curBlog = this.state.backup;
    /*
      FAZER REQUISICÁO DE BUSCA E COLOCAR RESULTADO EM curBlog
    */
    this.setState({blog: curBlog});
  }

  componentDidMount(){
    this.loadArtigos();
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    return (
      <View style={[styles.container]}>
        <Image source={{uri:'https://www.voitto.com.br/images/icones/materiaisLogoIcon.png'}} style={{width:'35%', height:40, alignSelf:'center', resizeMode:'stretch', marginTop:20, marginBottom:10}}/>
          {
            //<Input placeHolderColor={"#FFF"} placeholder="Buscar..." value={this.state.search} onChangeText={(text)=>{this.search(text)}} style={{backgroundColor: 'rgba(0,0,0,.5)', borderWidth: 0,marginTop:50}} textColor={Colors.text} />
          }
       
          {this.state.isLoading===true? <View><ActivityIndicator color={Colors.text} /></View>: <View></View>}
          <ScrollView style={{flex:1}} onScroll={({nativeEvent}) => {
                                          if (this.isCloseToBottom(nativeEvent)) {
                                            this.setState({page: this.state.page+1}, ()=>{
                                              this.loadArtigos();
                                            });
                                          }
                                        }}
                                        scrollEventThrottle={400}>
            {this.state.blog.map((art, i)=>(
              
              <View key={i} style={styles.art}>
                <ImageCache source={art.imagem + '?size=' + width} style={styles.artImage} />
                <View style={styles.artCont}>
                  <TouchableOpacity style={[styles.artCont, {flex: 1}]} onPress={()=>{this.props.navigation.navigate('LerArtigo', {ref: art.id})}}>
                    <Text style={[styles.artTitle]}>{art.titulo}</Text>
                    <Text style={styles.artSubtitle}>{art.subtitulo}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {this.state.isLoading===true? <View></View>: <View  style={{height:'5%'}}><ActivityIndicator color={Colors.text} /></View>}
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
    padding: 10,
    marginVertical: 5,
    width: width,
    height: height,
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
    flex: 1,
  },
  artCont: {
    padding: 20,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: width,
    height: height,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  artTitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",

  },
  artSubtitle: {
    fontSize: 12,
    color: Colors.text,
    opacity: 0.9,
    textAlign: "center"
  },
});
