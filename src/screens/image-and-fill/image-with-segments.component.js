import React, {PureComponent} from 'react';
import {StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Rect} from 'react-native-svg';
import {ScreenDetector} from "../../utils/screen-detector";
import {ImageAndFillStyle as style} from './image-and-fill.style';
import {ImageModel} from "../../models/image";
import {ServerImage} from "../../components/server-image.component";
import {commonStyle} from "../../styles/common.style";
import {ImageUtils} from "../../utils/image-utils";
import {colors} from "../../constants/colors";

type Props = {
  image: ImageModel;
  selectSegment: Function<string>,
}

export class ImageWithSegments extends PureComponent<Props> {
  DELTA = 2;
  state = {
    imageSize: null
  };

  async componentDidMount() {
    try {
      const imageSize = await ImageUtils.getSize(this.props.image.path);
      this.setState({imageSize});
    } catch (e) {
      Alert.alert('Error', e && e.message || e);
    }
  }

  getRectangleSize(coords: Array<{ x: number; y: number }>): { width: number; height: number } {
    let width, height;
    width = coords[1].x - coords[0].x;
    height = coords[1].y - coords[0].y;
    if (width < 0) {
      width = width * -1;
    } else  if(!width) {
      width = coords[2].x - coords[0].x;
      if (width < 0) {
        width = width *  -1;
      } else  if (!width){
        width = coords[3].x - coords[0].x;
        if (width < 0) {
          width = width  * -1;
        }
      }
    }

    if (height < 0) {
      height = height * -1;
    } else if (!height) {
      height = coords[2].y - coords[0].y;
      if (height < 0) {
        height = height * -1;
      } else if  (!height) {
        height = coords[3].y - coords[0].y;
        if (height < 0) {
          height = height * -1;
        }
      }
    }
    return {width, height};
  }

  renderPolygon(item = {}, index) {
    if (!index) {
      return null;
    }

    const {description, boundingPoly} = item;
    const {vertices} = boundingPoly;

    const {vertex} = this.getVertexAndPortraitMode(vertices);
    const {x, y} = vertex;
    const {width, height} = this.getRectangleSize(vertices);

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        style={{
          position: 'absolute',
          top: y - this.DELTA,
          left: x - this.DELTA,
        }}
        onPress={() => this.props.selectSegment(description)}
      >
        <Svg
          height={height + 2}
          width={width + 2}
        >
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="transparent"
            stroke={colors[index % colors.length]}
            strokeWidth="3"
          />
        </Svg>
      </TouchableOpacity>
    )
  }

   getVertexAndPortraitMode(vts: any[]) {
    let vertices = JSON.parse(JSON.stringify(vts));

     vertices = vertices.sort((a,b)=> b.x - a.x);
     const vertA = vertices[0];
     const vertB = vertices[1];
     let vert1, vert2, vert4;
     if(vertA.y - vertB.y > 0){
       vert2 = vertB;
     }  else {
       vert2 = vertA;
     }

     const vertC = vertices[2];
     const vertD = vertices[3];

     if (vertC.y - vertD.y > 0) {
       vert1 = vertD;
       vert4 = vertC;
     } else {
       vert1 = vertC;
       vert4 = vertD;
     }

    const side1  = vert4.y - vert1.y;
    const side2  = vert2.x - vert1.x;

    const portraitMode = side1 >  side2;

     if (portraitMode) {
       const vert1 = vertices[2];
       const vert2 = vertices[3];
       return vert1.y - vert2.y > 0 ? {vertex: vert2, portraitMode} : {vertex: vert1, portraitMode};
     } else {
       return {vertex: vert1, portraitMode}
     }
   }

  render() {
    if (!this.state.imageSize) {
      return (<ActivityIndicator/>);
    }

    const iW = this.state.imageSize.width;
    const iH = this.state.imageSize.height;
    return (
      <ImageZoom
        cropWidth={iW}
        cropHeight={iH}
        imageWidth={iW}
        imageHeight={iH}
        centerOn={{
          x: 0, y: 0,
          scale: 0.4
        }}
        minScale={0.4}
        maxScale={4}
        enableCenterFocus={false}
      >
        <View style={{width: iW, height: iH}}>
          <ServerImage uri={this.props.image.path} style={commonStyle.fullSize}/>
          <View style={commonStyle.overlay}>
            {this.props.image.googleVisionDetection.map((value, index) => this.renderPolygon(value, index))}
          </View>
        </View>
      </ImageZoom>
    );
  }
}