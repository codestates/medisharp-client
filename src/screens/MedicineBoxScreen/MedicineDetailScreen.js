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
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

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
      token: '',
    };
    const get_token = async () => {
      const token = await getItem();
      this.setState({ token: token });
    };

    const getMediDetail = () => {
      console.log(this.state.item);
      axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/medicines/name',
        headers: {
          Authorization: this.state.token,
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
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => getMediDetail(),
              },
            ],
            { cancelable: false },
          );
        });
    };

    get_token().then(() => {
      getMediDetail();
    });
  }

  deletemymedicine = () => {
    axios({
      method: 'delete',
      url: 'http://127.0.0.1:5000/medicines',
      headers: {
        Authorization: this.state.token,
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
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.deletemymedicine(),
            },
          ],
          { cancelable: false },
        );
      });
  };

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={{ height: '100%', backgroundColor: 'white', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#76a991',
              width: '100%',
              height: window.height * 0.5,
              borderBottomRightRadius: 50,
              borderBottomLeftRadius: 50,
              alignItems: 'center',
            }}
          >
            <Image
              style={{
                width: window.width * 0.2,
                height: window.width * 0.2,
                resizeMode: 'center',
                marginTop: window.height * 0.2,
              }}
              source={require('../../../assets/logoWhite.png')}
            />
            <Text style={{ fontSize: 28, fontWeight: '200', color: 'white' }}>약올림</Text>
          </View>
          <View style={{ marginTop: '20%' }}>
            <ActivityIndicator size={60} color="#76a991" />
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: 'white',
            paddingTop: getStatusBarHeight() + verticalMargin,
            height: window.height * 0.9,
          }}
        >
          {/* -- 상단 타이틀 -- */}
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#76a991',
              padding: 10,
              paddingLeft: 25,
              paddingRight: 25,
              borderTopRightRadius: 35,
              borderBottomRightRadius: 35,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: '200',
                color: 'white',
              }}
            >
              약통
            </Text>
            <Text
              style={{
                color: 'white',
                marginTop: 5,
                fontSize: 24,
                fontWeight: 'bold',
                paddingBottom: 5,
              }}
            >
              나의 약 모두보기
            </Text>
          </View>

          {/* -- 콘텐츠 시작 -- */}

          <ScrollView>
            {/* -- 약 사진 -- */}
            <Image
              source={{ uri: this.state.item['image_dir'] }}
              style={{
                width: window.width - 40,
                height: window.width - 40,
                borderRadius: 50,
                marginLeft: 20,
              }}
            />

            {/* -- 약 이름 뷰 -- */}
            <View
              style={{
                width: window.width,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 15,
                  color: '#76a991',
                }}
              >
                {this.state.MedicineName}
              </Text>
            </View>

            {/* -- 약 정보 + 버튼 -- */}
            <View style={{ marginLeft: 20 }}>
              {/* -- 약 효능/효과 뷰 -- */}
              <View style={styles.textInputBox}>
                <Text style={styles.textInputTitle}>효능/효과</Text>
                <Text style={styles.bodyText}>{this.state.MedicineEffect}</Text>
              </View>

              {/* -- 약 용법/용량 뷰 -- */}
              <View style={styles.textInputBox}>
                <Text style={styles.textInputTitle}>용법/용량</Text>
                <Text style={styles.bodyText}>{this.state.MedicineCapacity}</Text>
              </View>

              {/* -- 약 유효기간 뷰 -- */}
              <View style={styles.textInputBox}>
                <Text style={styles.textInputTitle}>유효기간</Text>
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
                      backgroundColor: '#ffaaaa',
                      borderRadius: window.height * 0.075,
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
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  textInputBox: {
    marginBottom: verticalMargin,
    borderBottomWidth: 1,
    borderBottomColor: '#76a991',
    borderStyle: 'solid',
    width: window.width - 40,
    paddingBottom: window.height * 0.015,
  },
  textInputTitle: {
    fontSize: 18,
    fontWeight: '200',
    color: '#626262',
    paddingLeft: 5,
  },
  bodyText: {
    width: window.width - 40,
    padding: 10,
    paddingBottom: 5,
    fontSize: 18,
  },
});
