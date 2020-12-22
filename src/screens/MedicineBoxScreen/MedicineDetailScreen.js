import React from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';

import medisharpLogo from '../../img/medisharpLogo.png';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class MedicineDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('MedicineData'),
      MedicineName: '',
      // MedicineImage: '',
      MedicineEffect: '',
      MedicineCapacity: '',
      MedicineValidity: '',
      isLoading: true,
    };
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios({
          method: 'get',
          url: 'http://127.0.0.1:5000/medicines/name',
          headers: {
            Authorization: token,
          },
          params: {
            id: this.state.item['id'],
            name: this.state.item['name'],
            camera: this.state.item['camera'],
          },
        })
          .then((data) => {
            let { name, effect, capacity, validity } = data.data.results[0];
            if (Array.isArray(capacity)) {
              capacity = capacity.join('\n');
            }
            if (Array.isArray(validity)) {
              validity = validity.join('\n');
            }
            this.setState({
              MedicineName: name,
              MedicineEffect: effect, //camera인식된 약은 array형태, 직접입력한 약은 string
              MedicineCapacity: capacity, //camera인식된 약은 array형태, 직접입력한 약은 string
              MedicineValidity: validity,
              isLoading: false,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  deletemymedicine = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios({
          method: 'delete',
          url: 'http://127.0.0.1:5000/medicines',
          headers: {
            Authorization: token,
          },
          params: {
            id: this.state.item['id'],
          },
        })
          .then((data) => {
            //삭제 후 다시 약 현황 page로 navigate되면서 API요청
            this.props.navigation.navigate('MedicineBox');
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.loginContainer}>
          <View style={[styles.container, styles.horizontal]}>
            <Image
              style={{ width: 77, height: 71, marginTop: '60%', marginBottom: '20%' }}
              source={medisharpLogo}
            />
            <Text>약 정보를 가져오고 있습니다. 잠시만 기다려주세요.</Text>
            <ActivityIndicator size={60} color="#6a9c90" />
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: 'white',
            height: window.height * 0.92 - 1,
            paddingLeft: 20,
            paddingTop: getStatusBarHeight(),
          }}
        >
          {/* -- 상단 타이틀 -- */}
          <Text
            style={{
              marginTop: 30,
              fontSize: 24,
            }}
          >
            약통
          </Text>
          <View
            style={{
              borderBottomStyle: 'solid',
              borderBottomWidth: 5,
              borderBottomColor: '#6a9c90',
              alignSelf: 'flex-start',
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 5,
                fontSize: 20,
                fontWeight: 'bold',
                paddingBottom: 5,
              }}
            >
              내가 복용하는 모든 약
            </Text>
          </View>
          <ScrollView>
            {/* -- 약 사진 -- */}
            <Image
              source={{ uri: this.state.item['image_dir'] }}
              style={{
                width: window.width - 40,
                height: window.width - 40,
                //resizeMode: 'contain', //실제로 구현될때는 바로 위 하이트 값 삭제하고 리사이즈모드를 살리면 될듯합니닷!
                marginBottom: 10,
                borderRadius: 50,
              }}
            />

            {/* -- 약 이름 뷰 -- */}
            <View
              style={{
                marginBottom: window.height * 0.01,
                width: window.width - 40,
              }}
            >
              <Text
                style={{
                  paddingLeft: 10,
                  fontSize: 22,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                {this.state.MedicineName}
              </Text>
            </View>

            {/* -- 약 효능/효과 뷰 -- */}
            <View
              style={{
                marginBottom: window.height * 0.01,
                borderBottomWidth: 1,
                borderBottomColor: '#6A9C90',
                borderStyle: 'solid',
                width: window.width - 40,
              }}
            >
              <Text style={styles.titleText}>효능/효과</Text>
              <Text style={styles.bodyText}>{this.state.MedicineEffect}</Text>
            </View>

            {/* -- 약 용법/용량 뷰 -- */}
            <View
              style={{
                marginBottom: window.height * 0.01,
                borderBottomWidth: 1,
                borderBottomColor: '#6A9C90',
                borderStyle: 'solid',
                width: window.width - 40,
              }}
            >
              <Text style={styles.titleText}>용법/용량</Text>
              <Text style={styles.bodyText}>{this.state.MedicineCapacity}</Text>
            </View>

            {/* -- 약 유효기간 뷰 -- */}
            <View
              style={{
                marginBottom: window.height * 0.01,
                borderBottomWidth: 1,
                borderBottomColor: '#6A9C90',
                borderStyle: 'solid',
                width: window.width - 40,
              }}
            >
              <Text style={styles.titleText}>유효기간</Text>
              <Text style={styles.bodyText}>{this.state.MedicineValidity}</Text>
            </View>

            {/* -- 삭제하기 버튼 -- */}
            <View style={{ alignItems: 'center', marginLeft: -20 }}>
              <TouchableOpacity onPress={this.deletemymedicine}>
                <View
                  style={{
                    justifyContent: 'center',
                    margin: 20,
                    alignItems: 'center',
                    width: window.width * 0.7,
                    height: window.height * 0.075,
                    backgroundColor: '#9a6464',
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                    }}
                  >
                    삭제하기
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  viewBox: {
    marginBottom: window.height * 0.005,
    width: window.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#6A9C90',
    borderStyle: 'solid',
  },
  titleText: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  bodyText: {
    paddingLeft: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },
});
