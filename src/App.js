import React, {useCallback, useEffect, useState} from "react";
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import * as parkData from './data/Public_data.json';
import './App.css';
import marker_img from './img/marker.png';
import Pin from "./Pin";


function App() {
    const token = 'pk.eyJ1IjoiYWxsZXgzNzIiLCJhIjoiY2t0OXRtYzlyMGJ1YzJ3bXdvN2c0Nmk2aiJ9.Z6G1NqH0YDqKwlBY11HzEA'

    const [viewport, setViewport] = useState({
        latitude: 49.8382600,
        longitude: 24.0232400,
        width: '100vw',
        height: '100vh',
        zoom: 10
    })

    const [marker, setMarker] = useState({
        latitude: null,
        longitude: null
    });

    const [selectedPark, setSelectedPark] = useState(null)
    const [draggable, setDraggable] = useState(false)

    const [events, logEvents] = useState({});

    const onMarkerDragEnd = useCallback(event => {
        logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
        setMarker({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1]
        });
    }, []);

    useEffect(()=> console.log(draggable), [draggable])

    function moveMarker() {
        const change = !draggable;
        setDraggable(change)
    }



    return <div>
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={token}
            mapStyle='mapbox://styles/allex372/ckuchzkr720zt18qj1zvyihev'
            onViewportChange={viewport => {
                setViewport(viewport)
            }}>


            {
                parkData.features.map(water => (
                    <Marker draggable={draggable}
                            offsetTop={-20}
                            offsetLeft={-10}
                            onDragEnd={onMarkerDragEnd}
                            longitude={marker.longitude?marker.longitude:water.geometry.coordinates[0][0][0][0]}
                            latitude={marker.latitude?marker.latitude:water.geometry.coordinates[0][0][0][1]}
                            key={water.properties.id}>
                        <button className='marker-btn'
                                onClick={event => {
                                    event.preventDefault()
                                    setSelectedPark(water)
                                }}>
                            {/*<img src={marker_img} alt='marker-of-water'/>*/}
                            <Pin size={30} />
                        </button>
                    </Marker>
                ))
            }


            {selectedPark ? (
                <Popup longitude={marker.longitude?marker.longitude:selectedPark.geometry.coordinates[0][0][0][0]}
                       latitude={marker.latitude?marker.latitude:selectedPark.geometry.coordinates[0][0][0][1]}
                       onClose={() => {
                           setSelectedPark(null)
                       }}
                >
                    <div>
                        <h2>{selectedPark.properties.name}</h2>
                        <p>{selectedPark.properties.area}</p>
                        <div className='wrapper'>
                            <button className='apple-maps'><a
                                href={`comgooglemaps://?center=${[selectedPark.geometry.coordinates[0][0][0][0], selectedPark.geometry.coordinates[0][0][0][1]]}&zoom=14&views=traffic`}>Open
                                in Apple Maps</a></button>
                            <button className='google-maps'><a
                                href={`//maps.apple.com/?q=${[selectedPark.geometry.coordinates[0][0][0][1], selectedPark.geometry.coordinates[0][0][0][0]]}`}>Open
                                in Google Maps</a></button>
                            <button className='move' onClick={moveMarker}>{draggable?'Save': 'Move'} Point</button>
                        </div>

                    </div>
                </Popup>
            ) : null}

        </ReactMapGL>
    </div>
}

export default App;
