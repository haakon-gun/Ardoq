import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";

import axios from "axios";

type apidata1 = {
  data: { stations: stationInfo[] };
  last_updated: number;
};

type apidata2 = {
  data: { stations: stationAvailability[] };
  last_updated: number;
};

type stationInfo = {
  address: String;
  capacity: number;
  name: String;
  lat: number;
  lon: number;
  station_id: String;
};

type stationAvailability = {
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
  num_bikes_available: number;
  num_docks_available: number;
  station_id: String;
};

const Stations = () => {
  const [bikeStation, setBikeStation] = useState<stationInfo[]>();
  const [availabilityInfo, setAvailabilityInfo] =
    useState<stationAvailability[]>();

  const bikeApi = axios.create({
    baseURL: "https://gbfs.urbansharing.com/oslobysykkel.no",
    timeout: 1000,
    headers: { "Client-Identifier": "Ardoq-Test" },
  });

  useEffect(() => {
    async function getData() {
      try {
        const stationRes = await bikeApi.get<apidata1>(
          "/station_information.json"
        );
        const availabilityRes = await bikeApi.get<apidata2>(
          "/station_status.json"
        );
        console.log(stationRes.data);
        console.log(availabilityRes.data);
        setBikeStation(stationRes.data.data.stations);
        setAvailabilityInfo(availabilityRes.data.data.stations);
      } catch (error) {
        console.error(error);
      }
    }

    getData();
  }, []);

  if (bikeStation != undefined) {
    return (
      <MapContainer
        center={[59.90688962048543, 10.76030652299994]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bikeStation?.map((s) =>
          availabilityInfo?.map((i) => {
            if (s.station_id == i.station_id) {
              return (
                <Marker key={s.station_id.toString()} position={[s.lat, s.lon]}>
                  <Popup>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>{s.name}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Adress</Td>
                          <Td>{s.address}</Td>
                        </Tr>
                        <Tr>
                          <Td>Capacity</Td>
                          <Td>{s.capacity}</Td>
                        </Tr>
                        <Tr>
                          <Td>Bikes available</Td>
                          <Td>{i.num_bikes_available}</Td>
                        </Tr>
                        <Tr>
                          <Td>Docks available</Td>
                          <Td>{i.num_docks_available}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Popup>
                </Marker>
              );
            }
          })
        )}
      </MapContainer>
    );
  }
  return (
    <div>
      <p>Something went wrong</p>
    </div>
  );
};

export default Stations;
