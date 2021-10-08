import React, {useCallback, useEffect, useState} from "react";
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import './App.css';
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

    let [parks, setParks] = useState([
        {
            id: 1,
            name: "Регіональний ландшафтний парк “Знесіння“",
            area: "312,1 га",
            longitude: 24.06609218467404,
            latitude: 49.85231953495459
        },
        {
            id: 2,
            name: "Парк-пам’ятка садово-паркового мистецтва місцевого значення↵“Залізна Вода“",
            area: "19,5 га",
            longitude: 24.035978761977706,
            latitude: 49.82119878452948
        },
        {
            id: 3,
            name: "Парк “Горіховий гай“",
            area: "35,5 га",
            longitude: 24.010021812034985,
            latitude: 49.81551628110055
        },
        {
            id: 4,
            name: "Парк “700-річчя Львова“",
            area: "22,09 га",
            longitude: 24.01887346804171,
            latitude: 49.86245184778529
        },
        {
            id: 5,
            name: "Парк ім. Папи Римського Івана Павла ІІ",
            area: "97,9 га",
            longitude: 24.05489787933887,
            latitude: 49.793672930994525
        },
        {
            id: 6,
            name: "Центральний парк культури і відпочинку↵ім. Б. Хмельницького",
            area: "26 га",
            longitude: 24.019285518824386,
            latitude: 49.830638412963985
        },
    ]);

    let [marker, setMarker] = useState({
        id: null,
        longitude: null,
        latitude: null
    });

    const [selectedPark, setSelectedPark] = useState(null)
    const [draggable, setDraggable] = useState(false)

    const [events, logEvents] = useState({});

    useEffect(() => selectedPark && setMarker((prevState) => ({...prevState, id: selectedPark.id})), [selectedPark]);

    function Park() {
        parks.map(park => {
            if (park.id === marker.id && marker.latitude != null && marker.longitude!= null){
                park.latitude = marker.latitude;
                park.longitude = marker.longitude;
            }
        })
    }


    const onMarkerDrag = useCallback(event => {
        logEvents(_events => ({..._events, onDrag: event.lngLat}));
        console.log(event, 'DRAG')
        setMarker(prevState => ({
            ...prevState,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1]
        }));
    }, []);

    const onMarkerDragEnd = useCallback((event) => {
        logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
        setMarker(prevState => ({
            id: null,
            longitude: null,
            latitude: null
        }));
    }, [marker]);


    function moveMarker() {
        const change = !draggable;
        setDraggable(change)
    }


    useEffect(() => {
        Park();
    }, [marker])



    return <div>
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={token}
            mapStyle='mapbox://styles/allex372/ckuchzkr720zt18qj1zvyihev'
            onViewportChange={viewport => {
                setViewport(viewport)
            }}>
            {
                parks.map(park =>
                <Marker draggable={draggable}
                        offsetTop={-20}
                        offsetLeft={-10}
                        // onDragStart={onMarkerDragStart}
                        onDrag={onMarkerDrag}
                        onDragEnd={onMarkerDragEnd}
                        longitude={park.longitude}
                        latitude={park.latitude}
                        key={park.id}>
                    <button className='marker-btn'
                            onClick={event => {
                                event.preventDefault()
                                setSelectedPark(park)
                            }}>
                        <Pin size={30}/>
                    </button>
                </Marker>

                )}
            {selectedPark ? (
                <Popup longitude={selectedPark.longitude}
                       latitude={selectedPark.latitude}
                       onClose={() => {
                           setSelectedPark(null)
                       }}
                >
                    <div>
                        <h2>{selectedPark.name}</h2>
                        <p>{selectedPark.area}</p>
                        <div className='wrapper'>
                            <button className='apple-maps'><a
                                href={`comgooglemaps://?center=${[selectedPark.longitude, selectedPark.latitude]}&zoom=14&views=traffic`}>Open
                                in Apple Maps</a></button>
                            <button className='google-maps'><a
                                href={`//maps.apple.com/?q=${[selectedPark.latitude, selectedPark.longitude]}`}>Open
                                in Google Maps</a></button>
                            <button className='move' onClick={moveMarker}>{draggable ? 'Save' : 'Move'} Point</button>
                        </div>

                    </div>
                </Popup>
            ) : null}

        </ReactMapGL>
    </div>
}

export default App;
