import React, { useState, useEffect } from "react";
import { StatusBar, Dimensions, Text, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import Svg, { Circle, Line } from "react-native-svg";

const { height, width } = Dimensions.get("window");
const centerX = width / 2,
  centerY = height / 2;

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    _subscribe();
    StatusBar.setHidden(true, "fade");
    return () => {
      _unsubscribe();
    };
  }, []);

  const _setInterval = () => {
    DeviceMotion.setUpdateInterval(77);
  };

  const _subscribe = () => {
    DeviceMotion.addListener((devicemotionData) => {
      setData(devicemotionData.rotation);
    });
    _setInterval();
  };

  const _unsubscribe = () => {
    DeviceMotion.removeAllListeners();
  };

  let { beta, gamma } = data;
  gamma = round(gamma);
  beta = round(beta);
  const shadowElement = (
    <>
      <Line
        x1={centerX}
        y1={centerY}
        x2={centerX - width / 4}
        y2={centerY - height / 4}
        stroke="#555"
        strokeWidth="60"
      />
      <Circle
        cx={centerX - width / 4}
        cy={centerY - height / 4}
        r="30"
        fill="#555"
      />
    </>
  );
  const cylinderElement = (
    <>
      <Line
        x1={centerX}
        y1={centerY}
        x2={centerX - (gamma * width) / 3.14}
        y2={centerY - (beta * height) / 3.14}
        stroke="lightgray"
        strokeWidth="60"
      />
      <Circle cx={centerX} cy={centerY} r="30" fill="lightgray" />
      {beta >= 0 && (
        <Line
          x1={centerX}
          y1={centerY + 30}
          x2={centerX - (gamma * width) / 3.14}
          y2={centerY + 30 - (beta * height) / 3.14}
          stroke="gray"
          strokeWidth="1"
        />
      )}
      <Circle
        cx={centerX - (gamma * width) / 3.14}
        cy={centerY - (beta * height) / 3.14}
        r="30"
        fill="gray"
      />
    </>
  );
  const gammaAlign = gamma <= 1.57 && gamma >= -1.57;
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#BBB",
      }}
    >
      {gammaAlign && (
        <Svg height={height} width={width} originX={centerX} originY={centerY}>
          {shadowElement}
          {cylinderElement}
        </Svg>
      )}
      {!gammaAlign && <Text color="lightgray">Keep the Screen on Top!</Text>}
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}
