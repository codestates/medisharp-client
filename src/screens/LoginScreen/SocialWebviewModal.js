import React from 'react';
import Modal from 'react-native-simple-modal';
import SocialWebview from './SocialWebview';

const SocialWebviewModal = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      //style={styles.container}
    >
      <SocialWebview source={{ uri: props.source }} closeSocialModal={props.closeSocialModal} />
    </Modal>
  );
};
export default SocialWebviewModal;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
