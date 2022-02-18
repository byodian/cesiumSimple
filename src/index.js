import 'cesium/Widgets/widgets.css'
import { 
  Viewer, 
  Ion, 
  // Rectangle,
  IonWorldImageryStyle,
  IonImageryProvider,
  ArcGisMapServerImageryProvider,
  defined,
  when,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
  // SingleTileImageryProvider,
  createWorldTerrain,
  createWorldImagery,
  SceneMode,
  UrlTemplateImageryProvider,
  WebMercatorTilingScheme,
  Cartesian3,
  Math,
  // GeoWTFS,
  Color,
  LabelStyle,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
  WebMapServiceImageryProvider
} from 'cesium'
// import './lib'

Ion.defaultAccessToken = process.env.CESIUM_TOKENID
const tdtTokenId = process.env.TIANDITUTOKENID
const tdtStyle = 'vec'
const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// const MAP_URL = `${tdtUrl}DataServer?T=${tdtStyle}_w&x={x}&y={y}&l={z}&tk=${tdtTokenId}`
const MAP_URL = `http://t0.tianditu.gov.cn/vec_w/wmts?tk=${tdtTokenId}`
const TDT_VEC_W = 'http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default&format=tiles&tk=' + tdtTokenId;

const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

// 叠加ArcGisMapServerImageryProvider
function addArcgisMapServer(layers) {
  const mapServerProvider = new ArcGisMapServerImageryProvider({
    url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer'
  })

  layers.addImageryProvider(mapServerProvider)
}

// 叠加天地图影像
function addTDTMapServer(layers) {
  const wms = new WebMapServiceImageryProvider({
    url: TDT_VEC_W,
    credit: '天地图',
    layers: '0',
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maximumLevel: 18,
    minimumLevel: 1,
  })
  layers.addImageryProvider(wms)
}

// 叠加三维地面名服务
function addTDTLocationName() {
  const wtfs = new GeoWTFS({
    viewer,
    subdomains: subdomains,
    metadata:{
      boundBox: {
        minX: -180,
        minY: -90,
        maxX: 180,
        maxY: 90
      },
      minLevel: 1,
      maxLevel: 20
    },
    aotuCollide: true, //是否开启避让
    collisionPadding: [5, 10, 8, 5], //开启避让时，标注碰撞增加内边距，上、右、下、左
    serverFirstStyle: true, //服务端样式优先
    labelGraphics: {
      font:'28px sans-serif',
      fontSize: 28,
      fillColor:Color.WHITE,
      scale: 0.5,
      outlineColor:Color.BLACK,
      outlineWidth: 5,
      style:LabelStyle.FILL_AND_OUTLINE,
      showBackground:false,
      backgroundColor:Color.RED,
      backgroundPadding:new Cartesian2(10, 10),
      horizontalOrigin:HorizontalOrigin.MIDDLE,
      verticalOrigin:VerticalOrigin.TOP,
      eyeOffset:Cartesian3.ZERO,
      pixelOffset:new Cartesian2(0, 8)
    },
    billboardGraphics: {
      horizontalOrigin:HorizontalOrigin.CENTER,
      verticalOrigin:VerticalOrigin.CENTER,
      eyeOffset:Cartesian3.ZERO,
      pixelOffset:Cartesian2.ZERO,
      alignedAxis:Cartesian3.ZERO,
      color:Color.WHITE,
      rotation:0,
      scale:1,
      width:18,
      height:18
    }
  });

  wtfs.getTileUrl = function(){
    return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk='+ tdtTokenId
  }

  wtfs.getIcoUrl = function(){
    return tdtUrl + 'mapservice/GetIcon?id={id}&tk='+ tdtTokenId
  }

  wtfs.initTDT([{x:6,y:1,level:2,boundBox:{minX:90,minY:0,maxX:135,maxY:45}},{x:7,y:1,level:2,boundBox:{minX:135,minY:0,maxX:180,maxY:45}},{x:6,y:0,level:2,boundBox:{minX:90,minY:45,maxX:135,maxY:90}},{x:7,y:0,level:2,boundBox:{minX:135,minY:45,maxX:180,maxY:90}},{x:5,y:1,level:2,boundBox:{minX:45,minY:0,maxX:90,maxY:45}},{x:4,y:1,level:2,boundBox:{minX:0,minY:0,maxX:45,maxY:45}},{x:5,y:0,level:2,boundBox:{minX:45,minY:45,maxX:90,maxY:90}},{x:4,y:0,level:2,boundBox:{minX:0,minY:45,maxX:45,maxY:90}},{x:6,y:2,level:2,boundBox:{minX:90,minY:-45,maxX:135,maxY:0}},{x:6,y:3,level:2,boundBox:{minX:90,minY:-90,maxX:135,maxY:-45}},{x:7,y:2,level:2,boundBox:{minX:135,minY:-45,maxX:180,maxY:0}},{x:5,y:2,level:2,boundBox:{minX:45,minY:-45,maxX:90,maxY:0}},{x:4,y:2,level:2,boundBox:{minX:0,minY:-45,maxX:45,maxY:0}},{x:3,y:1,level:2,boundBox:{minX:-45,minY:0,maxX:0,maxY:45}},{x:3,y:0,level:2,boundBox:{minX:-45,minY:45,maxX:0,maxY:90}},{x:2,y:0,level:2,boundBox:{minX:-90,minY:45,maxX:-45,maxY:90}},{x:0,y:1,level:2,boundBox:{minX:-180,minY:0,maxX:-135,maxY:45}},{x:1,y:0,level:2,boundBox:{minX:-135,minY:45,maxX:-90,maxY:90}},{x:0,y:0,level:2,boundBox:{minX:-180,minY:45,maxX:-135,maxY:90}}]);
}

// // 增加单张图片
// function addSingleImageTile() {
// // add a single tile imagery provider  
//   layers.addImageryProvider(
//     new SingleTileImageryProvider({
//       url: '../images/images.png',
//       rectangle: Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75)
//     })); 
// }

function addDarkImageTile(layers) {
  const blackMarble = layers.addImageryProvider(
    new IonImageryProvider({ assetId: 3812 })
  );

  blackMarble.alpha = 0.5
  blackMarble.brightness = 2 
  // // enable lighting on the globe
  // viewer.scene.globe.enableLighting = true;
}

// 初始化 cesium viewer
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

// remove the credit logo of the map
viewer.cesiumWidget.creditContainer.style.display = 'none'

// add a ion imagery provider layer
const layers = viewer.scene.imageryLayers
addDarkImageTile(layers)

// 增加天地图矢量图层
addTDTMapServer(layers)
// addTDTLocationName()
// 增加 arcgis 地图服务
// addArcgisMapServer(layers)

// 将三维球定位到中国
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(103.84, 31.15, 17850000),
  orientation: {
    heading :  Math.toRadians(348.4202942851978),
    pitch : Math.toRadians(-89.74026687972041),
    roll : Math.toRadians(0)
  },
  complete:function callback() {
    // 定位完成之后的回调函数
  }
});
  
// get location of a point
const handler = new ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction(function(event) {
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
}, ScreenSpaceEventType.LEFT_CLICK)
