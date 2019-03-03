import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import Colors from '../constants/Colors';

//Pages
import Home from '../pages/Home';
import VoittoCast from '../pages/VoittoCast';
import Artigos from '../pages/Artigos';
import LerArtigo from '../pages/LerArtigo';
import MeuPerfil from '../pages/MeuPerfil';
import Mais from '../pages/Mais';
import Notificacoes from '../pages/Notificacoes';

const HomeStack = createStackNavigator({
  Home: Home,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home`
          : 'md-home'
      }
    />
  ),
};



const ArtigosStack = createStackNavigator({
  Artigos: Artigos,
  LerArtigo: LerArtigo
});

ArtigosStack.navigationOptions = {
  tabBarLabel: 'Artigos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-paper' : 'md-paper'}
    />
  ),
};

const MaisStack = createStackNavigator({
  Mais: Mais,
  MeuPerfil: MeuPerfil,
  Notificacoes: Notificacoes
});

MaisStack.navigationOptions = {
  tabBarLabel: 'Mais',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,

  ArtigosStack,
  MaisStack
}, {
  tabBarOptions: {
    showLabel: false,
    activeTintColor: Colors.text,
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: Colors.primary,
    },
  }
});
