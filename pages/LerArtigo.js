import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  Animated
} from 'react-native';

import { Icon } from 'expo';

import Colors from '../constants/Colors';
import ImageCache from '../components/ImageCache';
import Layout from '../constants/Layout';

const width = Layout.window.width;
const height = Layout.window.width * 0.5625;

const HEADER_MAX_HEIGHT = height;
const HEADER_MIN_HEIGHT = 55;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class LerArtigo extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
      super(props);
      const artigoRef = this.props.navigation.getParam('ref', null);
      this.store = this.props.screenProps.s;
      if(artigoRef!==null){
          this.loadArtigo(artigoRef);
      }
      this.state = {
        html: "",
        titulo: "",
        imagem: '',
        scrollY: new Animated.Value(0)
      }
  }

  loadArtigo(ref = ''){
      if(typeof ref !== 'string') return;
      if(ref.length===0) return;
      this.store.request(`http://api.voitto.com.br/blog/${ref}`,`artigos/${ref}`).then((s)=>{
        if(!s.status){
            this.setState({
                titulo: s.titulo,
                html: s.descricao,
                imagem: {uri:s.imagem},
                webviewHeight: Layout.window.height
            });
        }

      }).catch(e=>{

      });
  }

  realHtml(html = ''){
    return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>0</title>
        <style>
        img {
          max-width: calc(100% - 20px);
        }
        body, html, #height-calculator {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
          }
          #height-calculator {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
          }
          .post {
            padding: 10px;
            max-width: calc(100% - 20px);
            font-family: Montserrat!important;
            text-align: justify;
            color: rgba(0,0,0,.8);
          }
          .post, .post div, .post div *, .post h4, .post p, .post p * {
              text-align: justify;
              color: rgba(0,0,0,.8);
          }
          a {
            color: rgba(0,0,0,.8);
            text-decoration: none;
            border-bottom: dotted 1px;
          }
          a:hover {
              color: #777;
              text-decoration: none;
          }
          a:link {
              text-decoration: none;
          }
        </style>
    </head>
    <body>
    <div class="post" style="width:90%; margin-left:2.5%">
    ${html}
    </div>
    <script>
    window.location.hash = 1;
    var calculator = document.createElement("div");
    calculator.id = "height-calculator";
    while (document.body.firstChild) {
        calculator.appendChild(document.body.firstChild);
    }
    document.body.appendChild(calculator);
    document.title = calculator.clientHeight;
    </script>
    </body>
    </html>
    `;
  }

  onNavigationStateChange(navState) {
    console.log(navState);
    this.setState({
      webviewHeight: Math.max(Number(navState.title), Layout.window.height),
    });
  }  

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0.6, 0.6, 0],
      extrapolate: 'clamp',
    });

    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -50],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.header, {height: headerHeight}]}>
          <Animated.View style={[styles.backgroundImage,{opacity: imageOpacity, transform: [{translateY: imageTranslate}]}]}>
            <Image source={this.state.imagem} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <View style={styles.bar}>
            <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={styles.backButtom}>
              <Icon.Ionicons name={Platform.select({ios: "ios-arrow-back", android: 'md-arrow-back'})} size={20} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{this.state.titulo}</Text>
          </View>
        </Animated.View>
        <ScrollView style={{flex:1}} scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
          )}>
          <WebView originWhitelist={["about://*", "*youtube*"]} scrollEnabled={false} javaScriptEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          style={{flex: 1, height: this.state.webviewHeight}} html={this.realHtml(this.state.html)}></WebView>
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
  header: {
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },
  bar: {
    height: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  title: {
    backgroundColor: 'transparent',
    color: Colors.text,
    fontSize: 18,
    paddingHorizontal: 15,
    flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: width,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  backButtom: {
    width: HEADER_MIN_HEIGHT * 0.7,
    height: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
