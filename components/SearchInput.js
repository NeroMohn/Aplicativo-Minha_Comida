import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView
} from 'react-native';
import {
    Icon,
}from 'expo';
import Colors from '../constants/Colors';

export default class SearchInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
         text:'',
        };
      }
    render() {
        return ( 
                <View style={styles.searchSection}>
                    <Icon.Feather style={styles.searchIcon} name="search" size={20} color={Colors.buttonlogin}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Busque sua comida favorita"
                        onChangeText={(searchString) => {this.setState({searchString})}}
                        underlineColorAndroid="transparent"
                    />
                </View>
        );
    }
}

const styles = StyleSheet.create({
   
  
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
});