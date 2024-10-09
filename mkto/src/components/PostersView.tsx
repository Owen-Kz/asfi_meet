/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  WebView
} from 'react-native';

import {
  isMobileUA,
  isWebInternal,
  useIsSmall,
} from '../utils/common';

import CommonStyles from './CommonStyles';
import {useLayout} from '../utils/useLayout';
import {getGridLayoutName} from '../pages/video-call/DefaultLayouts';
import {PostersHeader} from '../pages/video-call/SidePanelHeader';
import useCaptionWidth from '../../src/subComponents/caption/useCaptionWidth';


const PostersView = props => {
  const {hideName = false, showHeader = true} = props;
  const isSmall = useIsSmall();
  const {currentLayout} = useLayout();
  const {transcriptHeight} = useCaptionWidth();
  // // Log roomInfo to confirm access
  // if (!roomInfo || !roomInfo.data) {
  //   return <Text>Loading room information...</Text>; // Fallback UI while roomInfo is being fetched
  // }
    // Utility function to get the cookie value by name
    function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    const ChannelSecret = JSON.parse(getCookie("roomInfo")).room_uuid;

  return (
    <View
      style={[
        isMobileUA()
          ? //mobile and mobile web
            CommonStyles.sidePanelContainerNative
          : isSmall()
          ? // desktop minimized
            CommonStyles.sidePanelContainerWebMinimzed
          : // desktop maximized
            CommonStyles.sidePanelContainerWeb,
        isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
          ? {marginVertical: 4}
          : {},
        //@ts-ignore
        transcriptHeight && !isMobileUA() && {height: transcriptHeight},
      ]}>
      {showHeader && <PostersHeader {...props} />}
      <ScrollView style={style.contentContainer}>
        <View style={style.deckContainer}>
          <iframe
            src={`https://posters.asfischolar.com/posterlist/${ChannelSecret}`} // URL of the page to embed
            title="Poster Decks Container"
            style={style.iframeStyle} // Apply style to the iframe
          />
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  deckContainer: {
    width: '100%',
    height: '100%',
    flex: 1, // Ensures the container takes up available space
  },
 iframeStyle: {
    width: '100%', // Full width
    height: '100vh', // Full height of the viewport
    border: 'none', // Remove the iframe border
  },
});

export default PostersView;
