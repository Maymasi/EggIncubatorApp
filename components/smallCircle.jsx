import React from 'react';
import { Text,StyleSheet } from 'react-native';
import { COLORS,SIZES } from '../constants/theme';

export default function smallCircle({pressHandlerCircle,state}) {
  return (
    <Text style={[styles.smallCircle,
        {backgroundColor:state==='active'?'white':COLORS.bgWhite20},
        {width:state==='active'?SIZES.medium:SIZES.small+3},
        {height:state==='active'?SIZES.medium:SIZES.small+3},
        {borderRadius:state==='active'?SIZES.medium/2:SIZES.small+3/2}]}
        onPress={pressHandlerCircle}
    ></Text>
  )
}
const styles = StyleSheet.create({
    smallCircle: {

        backgroundColor: 'white',
        marginHorizontal: 5,
    },
    });