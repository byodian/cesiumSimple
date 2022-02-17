import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

console.log(process.env.CESIUM_TOKENID)
Cesium.Ion.defaultAccessToken = process.env.CESIUM_TOKENID

const viewer = new Cesium.Viewer('cesium-container', {
  terrainProvider: Cesium.createWorldTerrain({
    requestWaterMask: true,
    requestVertexNormals: true
  }),
  imageryProvider : Cesium.createWorldImagery({
    style : Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
  }),
  timeline: false,
  baseLayerPicker : false,
  sceneMode: Cesium.SceneMode.SCENE2D,
  fullscreenButton: false,
  animation: false,
  homeButton: false,
  navigationHelpButton: false,
  infoBox: false,
}); 
    
const options = {
  style: 'normal',
  crs: 'BD09'
}

console.log(options)

// remove the credit logo of the Cesium map
viewer.cesiumWidget.creditContainer.style.display = 'none'

// // enable lighting on the globe
// viewer.scene.globe.enableLighting = true;

// add a ion imagery provider layer
const layers = viewer.scene.imageryLayers

const blackMarble = layers.addImageryProvider(
  new Cesium.IonImageryProvider({ assetId: 3812 })
);
blackMarble.alpha = 0.5
blackMarble.brightness = 2 

// add a single tile imagery provider  
layers.addImageryProvider(
  new Cesium.SingleTileImageryProvider({
    url : './images/images.png',
    rectangle : Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75)
  })); 

const mapServerProvider = new Cesium.ArcGisMapServerImageryProvider({
  url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer'
})

layers.addImageryProvider(mapServerProvider)
  
// get location of a point
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction(function(event) {
  // mapServerProvider.pickFeatures(event.position).then((fearures) => {
  //   console.log(fearures)
  // })

  const pickRay = viewer.camera.getPickRay(event.position)
  const featurePromise = viewer.imageryLayers.pickImageryLayerFeatures(pickRay, viewer.scene)

  if (!Cesium.defined(featurePromise)) {
    console.log('No features picked.')
  } else {
    Cesium.when(featurePromise, function(features) {
      console.log('Number of features picked: ' + features.length)
      console.log(features)
      if (features.length > 0) {
        console.log('Name of the feature picked', features[0].name)
      }
    })
  }

  // const pickedPosition = viewer.scene.pickPosition(event.position)
  // console.log(pickedPosition) 
  // if (Cesium.defined(pickedPosition)) {
  //   console.log(pickedPosition)
  // }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

console.log(viewer)
