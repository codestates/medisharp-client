import React from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './HomeScreen';
import LoadingScreen from './LoadingScreen';
import CalendarScreen from './CalendarScreen';
import AlarmScreen from './AlarmScreen';
import MedicineBoxScreen from './MedicineBoxScreen';
import LoginScreen from './LoginScreen';
import MypageScreen from './MypageScreen';
import HomeIcon from '../img/Home.png';
import calendarIcon from '../img/calendar.png';
import alarmIcon from '../img/alarm.png';
import medicineBoxIcon from '../img/medicineBox.png';
import myPageIcon from '../img/myPage.png';

// import { useAsyncStorage } from '@react-native-community/async-storage';
// const { getItem } = useAsyncStorage('@yag_olim');

// const _retrieveData = async () => {
//   const value = await getItem();
//   if (value !== null) {
//     console.log(value);
//     //this.setState({ isAuthorized: true });
//     console.log('success');
//     return value;
//   }
// };

const LoginStack = createStackNavigator(
  {
    LoginScreen,
  },
  {
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: ({ navigation }) => ({
        headerShown: false,
      }),
    },
  },
);

const HomeStack = createStackNavigator(
  {
    HomeScreen,
  },
  // if you need.
  // recommend custom header
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerShown: false,
    }),
  },
);
const CalendarStack = createStackNavigator(
  {
    CalendarScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Calendar',
      headerShown: false,
    }),
    initialRouteName: 'CalendarScreen',
  },
);
const AlarmStack = createStackNavigator(
  {
    AlarmScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Alarm',
      headerShown: false,
    }),
    initialRouteName: 'AlarmScreen',
  },
);
const MedicineBoxStack = createStackNavigator(
  {
    MedicineBoxScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'MedicineBox',
      headerShown: false,
    }),
    initialRouteName: 'MedicineBoxScreen',
  },
);
const MypageStack = createStackNavigator(
  {
    MypageScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: 'Mypage',
      headerShown: false,
    }),
    initialRouteName: 'MypageScreen',
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Calendar: CalendarStack,
    Alarm: AlarmStack,
    MedicineBox: MedicineBoxStack,
    Mypage: MypageStack,
  },
  {
    lazy: false,
    tabBarOptions: {
      activeTintColor: '#6a9c90',
      inactiveTintColor: '#888',
    },
  },
);

const AppStack = createStackNavigator({
  LoadingScreen: LoadingScreen, // 3번 로딩 화면 보기를 위해 급하게 만들었습니다. 이걸 없애면 첫화면이 로그인 화면이 됩니다.
  LoginScreen: LoginScreen,
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
});
export default createAppContainer(AppStack);
