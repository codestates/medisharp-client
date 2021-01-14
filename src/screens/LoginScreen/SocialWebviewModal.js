import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Modal from 'react-native-modal';
import SocialWebview from './SocialWebview';

const SocialWebviewModal = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      style={styles.container}
    >
      <Icon
        onPress={() => {
          props.closeSocialModal();
        }}
        name="times-circle"
        size={30}
        color={'#ffaaaa'}
        style={{
          marginLeft: 5,
        }}
      />
      {props.visible ? (
        <SocialWebview source={{ uri: props.source }} closeSocialModal={props.closeSocialModal} />
      ) : null}
    </Modal>
  );
};
export default SocialWebviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
