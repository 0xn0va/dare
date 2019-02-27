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
  ViroText,
  ViroConstants,
  ViroBox,
  ViroARPlaneSelector,
  
} from 'react-viro';

const BLOCKS = [
  require("./res/gameBlocks/block1.vrx"),
  require("./res/gameBlocks/block2.vrx"),
  require("./res/gameBlocks/block3.vrx"),
  require("./res/gameBlocks/block4.vrx"),
  require("./res/gameBlocks/block5.vrx"),
]

const PLANE_SIZE = 0.5

export class TetrisSceneAR extends Component {

  state = {
    isTracking: false,
    initialized: false,
    modelMap: [],
    activatedIndexes: [],
    loadedModelsCounter: 0,
    nextModelIndex: 0,
    planeWidth: 0,
    planeLength: 0
  }

  modelsRefs = {}

  getRandomModel = () => Math.floor(Math.random() * 5)

  componentDidMount(){
    this.loadLevel()
  }

  loadLevel = () => {
    this.setState({
      activatedIndexes: [],
      loadedModelsCounter: 0,
      nextModelIndex: 0,
      planeWidth: 0,
      planeLength: 0,
      modelMap: Array.from(Array(this.props.arSceneNavigator.viroAppProps.modelNumber), () => Math.floor(Math.random() * 5))
    });
  }

  resetLevel = () => {
    this.setState({
      activatedIndexes: [],
      loadedModelsCounter: 0,
      nextModelIndex: 0,
      modelMap: Array.from(Array(this.props.arSceneNavigator.viroAppProps.modelNumber), () => Math.floor(Math.random() * 5)),
      planeWidth: PLANE_SIZE / this.props.arSceneNavigator.viroAppProps.level,
      planeLength: PLANE_SIZE / this.props.arSceneNavigator.viroAppProps.level
    })
  }

  getUIText(uiText){
    return (
      <ViroText 
        text={uiText} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} transformBehaviors={["billboardX", "billboardY"]}
      />
    )
  }

  getGameGuide(){
    return (
          <Viro3DObject
            source={require('./res/gameGuide/NaomiWAVE.vrx')}
            resources={[require('./res/gameGuide/Naomi_color.jpg')]}
            position={[-1, -1, -1]}
            scale={[.013, .013, .013]}
            rotation={[0, 35, 0]}
            type="VRX"
            dragType="FixedDistance" onDrag={()=>{}}
            onClick={() => {
              this.setState({
                runAnimation : !this.state.runAnimation,
              })
            }}
            animation={{name:"Waving", run:this.state.runAnimation, loop:true,}}
      />
    )
  }
 
  activateModelGravity(modelId, index) {
    const { updateScore, changeLevel } = this.props.arSceneNavigator.viroAppProps
    this.setState({
      activatedIndexes: [...this.state.activatedIndexes, modelId],
      nextModelIndex: index + 1
    }, () => {
      updateScore()
      if (this.state.activatedIndexes.length === this.state.modelMap.length) {
        changeLevel()
      }
    })
  }

  getModelByType(modelType, index) {
    const modifier = index% 2 === 0 ? 1 : -1
    const modelId = `$model:{modelType}-no:${index}`
    const yPosition = this.state.nextModelIndex === index ? 0.5 : .5  + 0.1 * index
    return (
      <Viro3DObject
        type="VRX" 
        highAccuracyEvents
        key={index}
        scale={[0.04, 0.04, 0.04]}
        viroTag={modelId}
        animation={{
          name: "loopRotate",
          run: this.state.nextModelIndex === index,
          interruptible: true,
          loop:true
        }}
        opacity={
          this.state.loadedModelsCounter === this.state.modelMap.length &&
          (index === this.state.nextModelIndex || this.state.activatedIndexes.includes(modelId)) ? 1 : 0}
        dragType="FixedDistance"
        onDrag={() => {
          if (!this.state.activatedIndexes.includes(modelId)) {
            this.activateModelGravity(modelId, index)
          }
        }}
        onLoadEnd={() => {
          this.setState({
            loadedModelsCounter: this.state.loadedModelsCounter + 1
          })
        }}
        position={[0, yPosition, 0]}
        source={BLOCKS[modelType]}
        physicsBody={{
          type:'Dynamic',
          enabled: this.state.activatedIndexes.includes(`$model:{modelType}-no:${index}`),
          mass: 1,
        }}
        
      />  
    )
  }
  
  deadZoneCollide = () => {
    this.props.arSceneNavigator.viroAppProps.looseLive()
  }
  
  onPlaneSelected = (anchorMap) => {
    this.setState({
      planeWidth: PLANE_SIZE / this.props.arSceneNavigator.viroAppProps.level,
      planeLength: PLANE_SIZE / this.props.arSceneNavigator.viroAppProps.level
    })
  }
  
  getARScene(){
   return (
      <ViroARPlaneSelector onPlaneSelected={this.onPlaneSelected} pauseUpdates>
        { 
          this.state.modelMap.map((modelType, index) => this.getModelByType(modelType, index))
        }
        <ViroBox
          materials={["metal"]}
          physicsBody={{ type:'Static', restitution:0.3, friction: 0.3 }}
          width={this.state.planeWidth}
          length={this.state.planeLength}
          scale={[1,.01, 1]}
        />
        <ViroQuad 
          key="deadZone"
          height={100}
          width={100}
          rotation={[-90, 0, 0]}
          position={[0,-3,0]}
          materials={["transparent"]}
          physicsBody={{ type:'Static' }}
          onCollision={this.deadZoneCollide}
        />
      </ViroARPlaneSelector>
   )
               
  }
 
  render() {
    return (
        <ViroARScene onTrackingUpdated={this._onInitialized}>
          <ViroDirectionalLight color="#ffffff"
            direction={[1, -1, -10]}
            shadowOrthographicPosition={[0, 8, -2]}
            shadowOrthographicSize={5}
            shadowNearZ={1}
            shadowFarZ={4}
            castsShadow={true} 
          />
          {
            this.state.planeWidth === 0 && this.getUIText("To start playing select an area!")
          }
          {
            this.state.loadedModelsCounter !== this.state.modelMap.length && 
            this.state.planeWidth !== 0 && 
            this.getUIText(`Loading 3d models ${this.state.loadedModelsCounter} of ${this.state.modelMap.length}`)
          }
          { 
            this.state.isTracking ? 
            this.getARScene() : 
            this.getUIText(
              this.state.initialized ? "Initializing" : "No Tracking"
            )  
          }
          {
            this.getGameGuide()
          }
        </ViroARScene>
    );
  }
  _onInitialized = (state, reason) => {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        isTracking : true,
        initialized: true
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      this.setState({
        isTracking: false
      })
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 10,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

ViroMaterials.createMaterials({
  transparent: {
    diffuseColor: "rgba(0,0,0,0)"
  },
  metal: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/grounds/metal.jpg'),
    normalTexture: require('./res/grounds/metalnormal.jpg'),
    specularTexture: require('./res/grounds/metalspec.jpg')
  }
})

ViroAnimations.registerAnimations({
  loopRotate:{
    properties:{
      rotateY:"+=90",
    }, duration:1000
  },
  rotate: {
    properties: {
      rotateZ: "+=90"
    },
    duration: 1000
  }
});