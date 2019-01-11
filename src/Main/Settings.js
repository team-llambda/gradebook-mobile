import React from 'react'
import { StyleSheet, View, Text, SectionList, Modal, TouchableWithoutFeedback } from 'react-native'

import { getData, storeData } from '../utils/storage'
import { deleteCredentials } from '../utils/keychain'
import { ButtonCell, ColorPickerCell, SwitchCell, renderSeparator } from '../Components/SectionListCells'
import WebView from './WebView'

import { SlidersColorPicker } from 'react-native-color'
import { showMessage } from "react-native-flash-message";

const WebViewCircleRadius = 20

export default class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      colorModalVisible: false,
      recentColors: [],
      gradeCardColor: "#611700",
      rememberCredentials: true,
      modalIsOpen: false
    }
  }

  componentDidMount() {
    getData('recentColors').then((recentColors) => {
      this.setState({recentColors})
    })
    getData('gradeCardColor').then((gradeCardColor) => {
      this.setState({gradeCardColor})
    })
    getData('rememberCredentials').then((rememberCredentials) => {
      this.setState({rememberCredentials})
    })
  }

  openColorModal = () => {
    this.setState({colorModalVisible: true})
  }

  _logout = () => {
    deleteCredentials().then(() => this.props.logout());
  }

  _deletecredentials() {
    deleteCredentials().then(() => {
      showMessage({
        message: "Deleted Credentials",
        type: "success",
        floating: true
      });
    })
  }

  _helpfaq = () => {
    showMessage({
      message: "Ask Nathan Yan, Andrew Liu, Alan Chu, or Terrance Li in the hallways or Contact Us!",
      type: "success",
      floating: true
    });
  }

  _contactus = () => {
    this.setState({modalIsOpen: true})
  }

  toggleSwitch = (key) => {
    storeData('rememberCredentials', !this.state[key])
    this.setState({
      [key]: !this.state[key]
    })
  }

  render() {
    const buttonRenderItem = ({item, index, section: {title, data}}) => <ButtonCell text={item.text} function={item.function}/>

    const generalSectionRender = ({item, index, section: {title, data}}) => {
      switch(item.type) {
        case 'color':
          return <ColorPickerCell title={item.text} color={this.state.gradeCardColor} openColorModal={this.openColorModal}/>
        case 'switch':
          return <SwitchCell title={item.text} value={this.state[item.key]} toggleSwitch={this.toggleSwitch} keyVal={item.key}/>
      }
    }

    return(
      <View style={styles.container}>
        <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.modalIsOpen}
            onRequestClose={() => {
            
            }}
          >
            {this.state.modalIsOpen &&  
              <View style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={() => this.setState({modalIsOpen: false})}>
                  <View style={{padding: 5, backgroundColor: '#e74c3c', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#ecf0f1', width: WebViewCircleRadius, height: WebViewCircleRadius, borderRadius: WebViewCircleRadius/2}}>
                      <Text style={{color: '#e74c4c', textAlign: 'center', textAlignVertical: 'center'}}>
                        X
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <WebView uri='https://goo.gl/forms/SqVmhSVrTd0SJJj93' style={{flex:10}}/>
              </View>
            }
        </Modal>
        <Text style={{fontFamily: 'SofiaProRegular',}}>General</Text>
        <SectionList
          contentContainerStyle={styles.sectionlist}
          keyExtractor={(item, index) => item.text}
          ItemSeparatorComponent={renderSeparator}
          sections={[
            {title: 'General', data: [
              {text: 'Color', type: 'color'},
              {text: 'Remember Credentials', key: 'rememberCredentials', type: 'switch'}
            ], renderItem: generalSectionRender},
          ]}
        />
        <Text style={{fontFamily: 'SofiaProRegular',}}>Account</Text>
        <SectionList
          contentContainerStyle={styles.sectionlist}
          keyExtractor={(item, index) => item.text}
          ItemSeparatorComponent={renderSeparator}
          sections={[
            {title: 'Account Options', 
            data: [
              {text: 'Delete Credentials', function: this._deletecredentials}, 
              {text: 'Log Out', function: this._logout}
            ], renderItem: buttonRenderItem}
          ]}
        />
        <SectionList
          contentContainerStyle={styles.sectionlist}
          keyExtractor={(item, index) => item.text}
          ItemSeparatorComponent={renderSeparator}
          sections={[
            {title: 'More', 
            data: [
              {text: 'Help / FAQ', function: this._helpfaq}, 
              {text: 'Contact Us', function: this._contactus}
            ], renderItem: buttonRenderItem}
          ]}
        />
        <Text>

        </Text>
        <SlidersColorPicker
          visible={this.state.colorModalVisible}
          color={this.state.gradeCardColor}
          returnMode={'hex'}
          onCancel={() => this.setState({ colorModalVisible: false })}
          onOk={colorHex => {
            this.setState({
              colorModalVisible: false,
              gradeCardColor: colorHex
            });
            let recentColors = [
              colorHex,
              ...this.state.recentColors.filter(c => c !== colorHex).slice(0, 4)
            ]
            storeData('recentColors', recentColors)
            storeData('gradeCardColor', colorHex)
            this.setState({
              recentColors
            });
            showMessage({
              message: "Reopen Gradebook to See Changes",
              type: "success",
              floating: true
            });
          }}
          swatches={this.state.recentColors}
          swatchesLabel="RECENTS"
          okLabel="Done"
          cancelLabel="Cancel"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  sectionlist: {
    borderRadius: 10, 
    width: '100%',
    backgroundColor: '#EFEFF4',
    padding: 15
  },
})