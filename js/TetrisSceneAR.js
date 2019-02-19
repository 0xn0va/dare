'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroARPlaneSelector,
  Viro3DObject,
  ViroAmbientLight,
  ViroNode,
  ViroSpotLight,
  ViroSurface,
  ViroAnimations,
} from 'react-viro';


var createReactClass = require('create-react-class');

var TetrisSceneAR = createReactClass({
  getInitialState() {
    return {
      runAnimation:true,
    };
  },
  render: function() {
    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={200}/>

        <ViroARPlaneSelector> 
          <ViroSpotLight
            innerAngle={5}
            outerAngle={25}
            direction={[0,-1,0]}
            position={[0, 5, 0]}
            color="#ffffff"
            castsShadow={true}
            shadowMapSize={2048}
            shadowNearZ={2}
            shadowFarZ={7}
            shadowOpacity={.7}
          />

          <Viro3DObject
            source={require('./res/gameGuide/NaomiWaving.vrx')}
            resources={[require('./gameGuide/res/Naomi_color.jpg')]}
            position={[0, 0, 0]}
            scale={[.015, .015, .015]}
            type="VRX"
            /* onClick={this._onClickAnimate}
            animation={{name:"01", run:this.state.runAnimation, loop:true,}} */
      />

          <ViroSurface
            position={[0, 0, 0]}
            rotation={[-90, 0, 0]}
            width={2.5} height={2.5}
            arShadowReceiver={true}
          />

          </ViroARPlaneSelector>

        </ViroARScene>
    );
  },

/*   _onClickAnimate() {
    this.setState({
      runAnimation : !this.state.runAnimation,
    })
  }, */

});

module.exports = TetrisSceneAR;