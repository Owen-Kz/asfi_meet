import { useContext } from 'react';
import { gql } from '@apollo/client';
import StorageContext from '../components/StorageContext';
import { RoomInfoContextInterface } from '../components/room-info/useRoomInfo';
import { useSetRoomInfo } from '../components/room-info/useSetRoomInfo';
import { GraphQLContext } from '../components/GraphQLProvider';
import useGetName from './useGetName';
import useWaitingRoomAPI from '../subComponents/waiting-rooms/useWaitingRoomAPI';
import { base64ToUint8Array } from '../utils';
import { LogSource, logger } from '../logger/AppBuilderLogger';

const JOIN_CHANNEL_PHRASE = gql`
  query JoinChannel($passphrase: String!) {
    joinChannel(passphrase: $passphrase) {
      token
      rtmToken
      uid
      channel
      title
      meetingTitle
      attendee
      host
      isHost
      secret
      chat {
        groupId
        userToken
        isGroupOwner
      }
      secretSalt
      mainUser {
        rtc
        rtm
        uid
      }
      whiteboard {
        room_uuid
        room_token
      }
      screenShare {
        rtc
        rtm
        uid
      }
    }
  }
`;

/**
 * Returns an asynchronous function to join a meeting with the given phrase.
 */
export interface joinRoomPreference {
  disableShareTile: boolean;
}

export default function useJoinRoom() {
  const { store } = useContext(StorageContext);
  const { setRoomInfo } = useSetRoomInfo();
  const { client } = useContext(GraphQLContext);
  const { request: requestToJoin } = useWaitingRoomAPI();
  const isWaitingRoomEnabled = $config.ENABLE_WAITING_ROOM;

  return async (phrase: string, preference?: joinRoomPreference) => {
    setRoomInfo(prevState => ({
      ...prevState,
      isJoinDataFetched: false,
    }));
    
    console.log("Joining channel with passphrase:", phrase); // Log the passphrase

    try {
      let response = null;
      
      if (isWaitingRoomEnabled) {
        logger.log(
          LogSource.NetworkRest,
          'channel_join_request',
          'API channel_join_request. Trying request to join channel as waiting room is enabled'
        );
        response = await requestToJoin({
          meetingPhrase: phrase,
          send_event: false,
        });
      } else {
        logger.log(
          LogSource.NetworkRest,
          'joinChannel',
          'API joinChannel. Trying to join channel. Waiting room is disabled'
        );
        console.log('Client',client);
        console.log('clientPhrase', phrase);
        response = await client.query({
          query: JOIN_CHANNEL_PHRASE,
          variables: { passphrase: phrase },
        });
      }
      console.log('Response', response);
      if (response?.error) {
        logger.error(
          LogSource.NetworkRest,
          'joinChannel',
          'API joinChannel failed.',
          response?.error,
        );
        throw response.error;
      } else {
        const data = isWaitingRoomEnabled ? response : response.data;
        if (data?.joinChannel) {
          const roomInfo = data.joinChannel;
          // Process response data as you have it
          // ...
          console.log('MYROOMINFO', roomInfo);

          setRoomInfo(prevState => ({
            ...prevState,
            isJoinDataFetched: true,
            data: { ...prevState.data, ...roomInfo },
            roomPreference: { ...preference },
          }));

          // Utility function to set a cookie with expiry
   function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
      const expires = "; expires=" + date.toUTCString();
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

  

    // Example: Function to save roomInfo in a cookie and update it
    function saveRoomInfoToCookie(roomInfo) {
      // You can save specific fields from roomInfo, such as room_uuid
      const roomInfoData = {
        attendee: roomInfo.attendee,
        room_uuid: roomInfo.channel,
        title: roomInfo.title,
        isHost: roomInfo.isHost,
        // Add other properties you want to save
      };

      // Convert the data to JSON and save it in a cookie
      setCookie('roomInfo', JSON.stringify(roomInfoData), 1); // 1 day expiry
    }

    // Call this function each time roomInfo is received
    if (roomInfo) {
      saveRoomInfoToCookie(roomInfo); // Save or update roomInfo in cookie
      // console.log('My Room Info:', roomInfo);
    }


          return roomInfo;
        } else {
          throw new Error('No data returned from server.');
        }
      }
    } catch (error) {
      // Enhanced error handling
      if (error.networkError) {
        console.error("Network Error:", error.networkError.result);
      } else if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      } else {
        console.error("Error:", error.message);
      }
      logger.error(
        LogSource.NetworkRest,
        'joinChannel',
        'Error during join channel operation',
        error
      );
      throw error;
    }
  };
}
