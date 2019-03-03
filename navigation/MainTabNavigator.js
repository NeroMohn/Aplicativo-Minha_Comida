import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import Colors from '../constants/Colors';

//Pages
import Home from '../pages/Home';
import Cart from '../pages/Cart';
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
          ? `home`
          : 'home'
      }
    />
  ),
};

const CartStack = createStackNavigator({
  Cart
});

CartStack.navigationOptions = {
  tabBarLabel: 'Cart',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'shopping-cart' : 'shopping-cart'}
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
      name={Platform.OS === 'ios' ? 'gear' : 'gear'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  CartStack,
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
