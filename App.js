/**
 * Copyright (c) 2019-present, dARe Project.
 * Planning of Internet-based Business
 * Erika Loman, Abdo Shajadi
 */

/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  StatusBar,
  TouchableHighlight,
} from 'react-native';

import { TetrisSceneAR } from './js/TetrisSceneAR';

import {
  ViroARSceneNavigator
} from 'react-viro';


// var sharedProps = {
//   apiKey:"DA081282-712F-47D8-B5EE-E4E61A5D3A7C",
// }

const API_KEY = "DA081282-712F-47D8-B5EE-E4E61A5D3A7C";


// Game definitions
const GAME_STATES = {
  MENU: Symbol("Menu"),
  IN_GAME: Symbol("InGame"),
  GAME_OVER: Symbol("GameOver"),
  LEVEL_START: Symbol("LevelStart"),
}

const SCORE_MODIFIER = 100;
const MODEL_PER_LEVEL = 10;

// var InitialARScene = require('./js/TetrisSceneAR.js');


var UNSET = "UNSET";
var defaultNavigatorType = UNSET;

export default class TetrisAR extends Component {
  state = {
    score: 0,
    level: 0,
    lives: 3,
    gameState: GAME_STATES.MENU
  }

  startGame = () => {
    this.setState({
      gameState: GAME_STATES.IN_GAME
    })
  }

  changeLevel = () => {
    this.setState({
      level: this.state.level + 1,
      gameState: GAME_STATES.LEVEL_START
    })
  }

  looseLive = () => {
    if (this.state.lives === 1) {
      return this.gameOver();
    }
    this.setState({
      lives: this.state.lives - 1
    })
  }

  gameOver = () => {
    this.setState({
      score: 0,
      level: 0,
      lives: 3,
      gameState: GAME_STATES.GAME_OVER
    })
  }

  backToMenu = () => {
    this.setState({
      score: 0,
      level: 1,
      lives: 3,
      gameState: GAME_STATES.MENU
    })
  }
  


  updateScore = () => {
    this.setState({
      score: this.state.score + 100
    })
  }



  render() {
    switch (this.state.gameState) {
      case GAME_STATES.MENU:
        return this.renderUI()
      case GAME_STATES.IN_GAME:
        return this.renderGameView()
      case GAME_STATES.GAME_OVER:
        return this.renderUI()
      case GAME_STATES.LEVEL_START:
        return this.renderLevelStartGUI()
    }
  }

  renderLevelStartGUI(){
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner}>
          <Text style={localStyles.titleText}>{`LEVEL ${this.state.level}`}</Text>
          <Text style={localStyles.text}>{`Put ${this.state.level * MODEL_PER_LEVEL} blocks on the surface. There may someone apear to help you!`}</Text>
          <TouchableHighlight style={localStyles.buttons}
            onPress={this.startGame}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>Start Level</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  renderUI() {
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >
          <Text style={localStyles.titleText}>Tetris!</Text>
          <Text style={localStyles.titleText}>
            { this.state.gameState === GAME_STATES.MENU ? "MENU" : "GAME OVER" }
          </Text>
          { this.state.gameState === GAME_STATES.MENU &&
            <Text style={localStyles.text}>
              
            </Text>
          }
          <TouchableHighlight style={localStyles.buttons}
            onPress={this.changeLevel}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>Go!</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  setGameReady = () => {
    this.setState({
      planeSelected: true
    })
  }

  renderGameView(){
    return (
      <View style={localStyles.flex}>
        <StatusBar hidden={true} />
        <ViroARSceneNavigator
          apiKey={API_KEY}
          viroAppProps={{
            modelNumber: this.state.level * MODEL_PER_LEVEL,
            level: this.state.level,
            changeLevel: this.changeLevel,
            updateScore: this.updateScore,
            looseLive: this.looseLive,
            levelGUIRender: this.renderLevelStartGUI
          }}
          initialScene={{ scene: TetrisSceneAR }} 
        />
        <View style={localStyles.topMenu}>
          <TouchableHighlight style={localStyles.buttons}
            underlayColor={'#68a0ff'}
            onPress={this.backToMenu}
          >
            <Text style={localStyles.buttonText}>
              Back
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={localStyles.buttons}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>
              { this.state.score }
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={localStyles.buttons}
            active={!this.state.modelLoading}
            underlayColor={'#68a0ff'}>
            <Text style={localStyles.buttonText}>
              {`Lives: ${ this.state.lives }`}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }


  // constructor() {
  //   super();

  //   this.state = {
  //     navigatorType : defaultNavigatorType,
  //     sharedProps : sharedProps
  //   }
  //   this._getARNavigator = this._getARNavigator.bind(this);
  //   this._exitViro = this._exitViro.bind(this);
  // }

  // render() {
  //   if (this.state.navigatorType == UNSET) {
  //     return this._getARNavigator();
  //   }
  // }
  // _getARNavigator() {
  //   return (
  //     <ViroARSceneNavigator {...this.state.sharedProps}
  //       initialScene={{scene: InitialARScene}} />
  //   );
  // }

  // _exitViro() {
  //   this.setState({
  //     navigatorType : UNSET
  //   })
  // }
}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  flex : {
    flex : 1,
  },
  arView: {
    flex:1,
  },
  topMenu: {
    width : '100%',
    position : 'absolute',
    top : 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'rgba(123,123,231,.4)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(123,087,231,.4)'
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});
module.exports = TetrisAR
