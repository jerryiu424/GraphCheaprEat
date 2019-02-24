import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  
  center = map => {
    const { points, google } = this.props;
    if (points.length > 0) {
      const [a, lat, lng] = points[0];
      const c = new google.maps.LatLng(lat, lng);
      map.panTo(c);
    }
  }

  render() {
    const { points } = this.props;
    return (
      <Map google={this.props.google} zoom={14} onReady={(mapProps, map) => this.center(map)}>
        <Marker name={'Current location'} />
        {
          points.map(([ name, lat, lng ], key) => (
            <Marker key={ key } name={ name } position={{ lat, lng }} />
          ))
        }
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: "AIzaSyAEBVABCLs-P5coC6qn5zvKhdOJmsEeiKU"
})(MapContainer)