import React from 'react';
import {
  Text,
  ListView,
  TouchableOpacity,
  Picker,
  View,
  Dimensions
} from 'react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { Icon } from 'expo';
import ImageCache from '../components/ImageCache';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Carrinho extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor(props){
        super(props);
        this.init = this._init.bind(this);
        this.state = {
          isLoading: false,
          empty:true,
          lista:[],
          total:0,
          quantdades:[]
        };
    }
    
    _init = (dados)=>{
        let array = this.state.lista;
        let total = this.state.total + dados.valor;
        let array2 = this.state.quantdades;
        array.push(dados)
        array2.push(1);
        this.setState({
            show: true,
            total:total,
            lista:array,
            quantdades:array2
        });
    }

    
    format_dinheiro (numero){
        var numero = numero.toFixed(2).split('.');
        numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }
    delete = (id, index)=>{
        let array = this.state.lista;
        let array2 = this.state.quantdades;
        var a = 0;
        for(var i=0;i<array.length;i++){
            if(array[i]['_id'] !== undefined){
                if(array[i]['_id'] == id){
                    a = i;
                    break;
                }
            }
        }

        delete array[a];
        delete array2[index];
        this.setState({
            quantdades:array2,
            lista:array,
        })
    }
   set_quantidade(index, type,valor){
       if(type === "plus"){
            let array = this.state.quantdades;
            array[index] = array[index]+1;
            this.setState({
                quantdades:array,
                total: this.state.total+valor
            })
       }else{
        let array = this.state.quantdades;
        if(array[index] > 1){
            array[index] = array[index]-1;
            this.setState({
                quantdades:array,
                total: this.state.total-valor
            })
        }
       }
      
   }
    render(){
        if(this.state.show){
            return(
                <View style={{position:'absolute', backgroundColor:"#F5F5EF", width:'100%', height:'100%',}}>
                    <View style={{width:'100%', backgroundColor:'#fff', height:'7%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={{position:'absolute', left:10, padding:5, top:'50%', marginTop:-13}} onPress={()=>this.setState({show: false})}>
                            <Icon.AntDesign name={"down"} color={Colors.buttonlogin} size={20} />
                        </TouchableOpacity>
                        <Text style={{color:'black', fontSize:17, fontWeight:'600',  }}>Carrinho</Text>
                    </View>

                    <View style={{ backgroundColor:'#fff', marginTop:5, height:'71.5%'}}>
                        <ListView
                        dataSource={ds.cloneWithRows(this.state.lista)}
                        renderRow={(rowData,rowA,rowIndex) => 
                            <View style={{ alignItems:'center',marginLeft:20, marginBottom:10,alignItems:'flex-start', width:'100%', marginTop:10}}>
                                <View style={{ flexDirection:'row',width:'100%', alignItems:'center'}}>
                                    <TouchableOpacity onPress={()=>{this.delete(rowData.id, rowIndex)}}>
                                    <Icon.FontAwesome name={"trash-o"} style={{marginRight:10}} color={Colors.buttonlogin} size={20} />    
                                    </TouchableOpacity>
                                    <ImageCache source={rowData.img} style={{width:50,height:50, borderRadius:25,}}/>
                                    <View style={{marginLeft:10, alignItems:'flex-start', }}>
                                        <Text style={{color:Colors.inputPlaceholder, fontSize:15,  color:'black'}}>{rowData.nome}</Text>
                                        <Text style={{color:Colors.inputPlaceholder, fontSize:13, color:Colors.inputPlaceholder}}>Valor: {this.format_dinheiro(rowData.valor )}</Text>
                                    </View>
                                    <View style={{position:'absolute', right:'10%',  backgroundColor:'#fff', flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=>{this.set_quantidade(rowIndex, "plus", rowData.valor)}}>
                                            <Icon.AntDesign name={"pluscircleo"} color={Colors.buttonlogin} size={20} />
                                        </TouchableOpacity>
                                        <Text style={{marginRight:10, marginLeft:10}}>{this.state.quantdades[rowIndex]}</Text>
                                        <TouchableOpacity onPress={()=>{this.set_quantidade(rowIndex, "minus",rowData.valor)}}>
                                            <Icon.AntDesign name={"minuscircleo"} color={Colors.buttonlogin} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }/>
                    </View>
                    <View style={{ position:'absolute', width:'100%', bottom:0, backgroundColor:'#fff',  height:'20%',alignItems:'center', justifyContent:'center'}}>
                        <View style={{flexDirection:'row',alignSelf:'flex-end'}}>
                            <Text style={{ marginRight:5, fontSize:17, color:Colors.inputPlaceholder}}>Total:</Text>
                            <Text style={{ marginRight:20, fontSize:16}}>{this.format_dinheiro(this.state.total)}</Text>
                        </View>
                        <Button onPress={()=>{}} loading={this.state.loading} color={Colors.buttonlogin}><Text style={{color:Colors.text, fontWeight:'bold', }}>Finalizar Compra</Text></Button>
                    </View>
                </View>
            )
        }else{
            return(<View></View>)
        }
      
  
    }
}