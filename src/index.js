import 'cesium/Widgets/widgets.css'
import { 
  Viewer, 
  Ion, 
  // Rectangle,
  IonWorldImageryStyle,
  IonImageryProvider,
  // ArcGisMapServerImageryProvider,
  defined,
  when,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
  // SingleTileImageryProvider,
  createWorldTerrain,
  createWorldImagery,
  SceneMode,
} from 'cesium'

Ion.defaultAccessToken = process.env.CESIUM_TOKENID
console.log(process.env.CESIUM_TOKENID)

const viewer = new Viewer('cesium-container', {
  terrainProvider: createWorldTerrain({
    requestWaterMask: true,
    requestVertexNormals: true
  }),
  imageryProvider : createWorldImagery({
    style : IonWorldImageryStyle.AERIAL_WITH_LABELS
  }),
  timeline: false,
  baseLayerPicker : false,
  sceneMode: SceneMode.SCENE2D,
  fullscreenButton: false,
  animation: false,
  homeButton: false,
  navigationHelpButton: false,
  infoBox: false,
}); 
    

// remove the credit logo of the Cesium map
viewer.cesiumWidget.creditContainer.style.display = 'none'

// // enable lighting on the globe
// viewer.scene.globe.enableLighting = true;

// add a ion imagery provider layer
const layers = viewer.scene.imageryLayers

const blackMarble = layers.addImageryProvider(
  new IonImageryProvider({ assetId: 3812 })
);
blackMarble.alpha = 0.5
blackMarble.brightness = 2 

// add a single tile imagery provider  
// layers.addImageryProvider(
//   new SingleTileImageryProvider({
//     url: '../images/images.png',
//     rectangle: Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75)
//   })); 

// const mapServerProvider = new ArcGisMapServerImageryProvider({
//   url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer'
// })

// layers.addImageryProvider(mapServerProvider)
  
// get location of a point
const handler = new ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction(function(event) {
  // mapServerProvider.pickFeatures(event.position).then((fearures) => {
  //   console.log(fearures)
  // })

  const pickRay = viewer.camera.getPickRay(event.position)
  const featurePromise = viewer.imageryLayers.pickImageryLayerFeatures(pickRay, viewer.scene)

  if (!defined(featurePromise)) {
    console.log('No features picked.')
  } else {
    when(featurePromise, function(features) {
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
}, ScreenSpaceEventType.LEFT_CLICK)
