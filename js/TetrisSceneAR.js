'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroSceneNavigator,
  ViroScene,
  ViroARScene,
  ViroImage,
  ViroQuad,
  ViroNode,
  ViroMaterials,
  ViroOmniLight,
  ViroARTrackingTargets,
  ViroARImageMarker,
  ViroSphere,
  ViroAmbientLight,
  ViroSpotLight,
  ViroDirectionalLight,
  ViroAnimations,
  Viro3DObject,
  ViroUtils,
  ViroARPlaneSelector,
  
} from 'react-viro';


var createReactClass = require('create-react-class');

var TetrisSceneAR = createReactClass({
  getInitialState() {
    return {
      runAnimation:true,
    }
  },
  render: function() {
    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={200}/>

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
            source={require('./res/gameGuide/NaomiWAVE2.vrx')}
            resources={[require('./res/gameGuide/Naomi_color.jpg')]}
            position={[0, -1, -1]}
            scale={[.015, .015, .015]}
            type="VRX"
            dragType="FixedToWorld" onDrag={()=>{}}
            onClick={this._onClickAnimate}
            animation={{name:"Waving", run:this.state.runAnimation, loop:true,}}
      />

          <ViroQuad
          rotation={[-90, 0, 0]}
          position={[0, -1.6, 0]}
          width={5} height={5}
          arShadowReceiver={true}
      />


        </ViroARScene>
    );
  },

  _onClickAnimate() {
    this.setState({
      runAnimation : !this.state.runAnimation,
    })
  },

});

module.exports = TetrisSceneAR;