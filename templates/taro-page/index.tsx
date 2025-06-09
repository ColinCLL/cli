
import React, { useEffect, useState, useMemo } from 'react';
import Taro, { useDidHide, useDidShow } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
// import { useMount, useRequest, useScroll } from "ahooks";
// import _ from "lodash";
import "./index.less";

const <%= fileName %> = (props:any) => {
  const { } = props;
  
  return (
    <div className='<%= className || fileName %>'>
    </div>
  );
}

export default <%= fileName %>;

