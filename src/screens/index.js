import React from 'react';
import { Text, View } from 'react-native';
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
import Icon from 'react-native-vector-icons/FontAwesome5';

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
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        if (routeName === 'Home') {
          return (
            <View>
              <Icon name="home" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        if (routeName === 'Calendar') {
          return (
            <View style={{ paddingRight: 10 }}>
              <Icon name="calendar-alt" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        if (routeName === 'Alarm') {
          return (
            <View
              style={{
                backgroundColor: '#6a9c90',
                width: 50,
                height: 30,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <Icon name="clock" size={25} color={(focused && '#6a9c90') || '#888'} /> */}
              <Text style={{ color: 'white', fontSize: 30, fontWeight: '800', marginBottom: 5 }}>
                +
              </Text>
            </View>
          );
        }
        if (routeName === 'MedicineBox') {
          return (
            <View style={{ paddingLeft: 10 }}>
              <Icon name="pills" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        if (routeName === 'Mypage') {
          return (
            <View>
              <Icon name="user-alt" size={25} color={(focused && '#6a9c90') || '#888'} />
            </View>
          );
        }
        // can use react-native-vector-icons
        // <Icon name={iconName} size={iconSize} color={iconColor} />
      },
    }),
    lazy: false,
    tabBarOptions: {
      style: { borderTopColor: 'transparent' },
      showLabel: false,
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
