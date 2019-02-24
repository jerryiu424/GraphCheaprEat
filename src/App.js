import React, { Component } from 'react';
import { Select } from '@cheapreats/react-ui';
import { request, GraphQLClient } from 'graphql-request';
import Map from './ScriptCache';
import Geocode from "react-geocode";

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customer: null,
      loading: false,
      options: null, // Location Options
      selected: null,
      location: [ "Belarus" , "Canada" , "Germany" , "United State" , "United Kingdom" ],
      vendors: [],
      latitude: [],
      longitude: [],
      vendorsInSelectedLocationIndex: []
    }
  }

  componentDidMount() {
    const ENDPOINT = 'https://htv.cheapreats.com/graphql';
    Geocode.setApiKey("AIzaSyAEBVABCLs-P5coC6qn5zvKhdOJmsEeiKU");
    const API_KEY = '5c70e12c8d83b0233d4c1689-1e304839-56b0-40d2-b314-8136dd18daa7'; // The key you obtained
    const client = new GraphQLClient(ENDPOINT, {
      headers: {
        authorization: API_KEY
      }
    });

    var orderTime = new Date();
    var pickupTime = new Date(orderTime.getTime() + 10 * 60000).toISOString();

    // ---------------------------------
    // First request call (Request a list of vendors)
    client.request(`{
      vendors{
        name
        location{
          latitude
          longitude
        }
      }
    }`)
      .then(data => {
        // console.log(data);

        var numOfVendors = data.vendors.length;
        var counter;

        for(counter = 0; counter < numOfVendors; counter++){
          this.state.vendors.push(data.vendors[counter].name);
          this.state.latitude.push(data.vendors[counter].location.latitude);
          this.state.longitude.push(data.vendors[counter].location.longitude);
        }

        this.setState({
          vendors: this.state.vendors,
          latitude: this.state.latitude,
          longitude: this.state.longitude
        });

        // console.log(this.state.vendors);
        // console.log(this.state.latitude);
        // console.log(this.state.longitude);

      })
      .catch(e => {
        console.error(e);
      });

    // ---------------------------------
    // Second request call (Request customer's name)      
    client.request(`{
        the_customer {
            _id
            email_address
            name
        }
    }`)
      .then(data => {
        this.setState({
          customer: data.the_customer
        });
      })
      .catch(e => {
        console.error(e);
      });

  }

  change = el => {
    this.setState({
      options: el.target.value,
      loading: true,
      selected: true
    }, async () => {
      var selectedCountry = this.state.location[this.state.options];
 
      // Enable or disable logs. Its optional.
      // Geocode.enableDebug();
  
      var numVendorsLength = this.state.vendors.length;
      var counter;
      
      const arr = [];
      for (counter = 0; counter < numVendorsLength; counter++){
        var lat = this.state.latitude[counter];
        var long = this.state.longitude[counter];
        var name = this.state.vendors[counter];
  
        try {
          const response = await Geocode.fromLatLng(lat, long);
          var resultLength = response.results.length;
          const country = response.results[resultLength-1].formatted_address;

          if(country === selectedCountry){
            // console.log(country, selectedCountry, lat, long);
            arr.push([name, lat, long]);
          } 
        } catch(error) {
            console.log("not a valid location");
            // console.error(error);
        } 
      }

      this.setState({
          vendorsInSelectedLocationIndex: arr,
          loading: false
      }, () => {
        console.log(this.state.vendorsInSelectedLocationIndex);
      });
    });
  }

  renderMap = mp => {
    var vLen = this.state.vendorsInSelectedLocationIndex.length;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>GraphCheaprEat</h1>
          
          {this.state.customer ? (
            <h3>Welcome Back { this.state.customer.name }</h3>
          ):(
            <div>Loading...</div>
          )}

          <Select 
            name='select'
            placeholder='Items'
            onChange={ this.change }
            options={ this.state.location }
            value={this.state.selected} 
          />
        </header>

        {this.state.loading ? (
          <div>Loading...</div>
          ):(
            // PUT GOOGLE MAP HERE
            <div>
            <h3>Lower Part { this.state.location[this.state.options]}</h3> 
            <p> {this.state.vendorsInSelectedLocationIndex.length} </p>
            <Map points={this.state.vendorsInSelectedLocationIndex}/>
          </div>
            
          )}
      </div>
    );
  }
}

export default App;