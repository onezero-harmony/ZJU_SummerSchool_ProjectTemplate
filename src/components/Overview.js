import React, { useContext, useEffect} from 'react';
import {useState} from 'react';
import { store } from "../store";
import * as echarts from "echarts";
import worldJson from 'echarts/map/json/world.json'
import ReactEcharts from "echarts-for-react";
import 'echarts/map/js/china';

function Overview() {
  const {state, dispatch} = useContext(store);    
  echarts.registerMap('world', worldJson);
  let [main, setMain] = useState('')
  var mychart;
  var mapdata = [];
  var countrydata = {};
  if(state.Average == 0){
    for(var i = 0; i < state.data.length; i++){
      var tmp;
      if(state.data[i]['Funding Amount (USD)'] == 'Unknown' 
          || !(state.tDate[state.data[i]['Funding Date'].slice(4)]) || 
          (state.ControlVertical != null && state.data[i]['Vertical'] != state.ControlVertical)||
          (state.ControlStage != null && state.data[i]['Funding Stage'] != state.ControlStage)) continue;
      if(!countrydata.hasOwnProperty(state.data[i]['Region'])) countrydata[state.data[i]['Region']] = 0;
      tmp = Number(countrydata[state.data[i]['Region']]) + Number(state.data[i]['Funding Amount (USD)']);
      countrydata[state.data[i]['Region']] = tmp;
    }
    for(var key in countrydata){
      mapdata.push({name: key, value: countrydata[key]/1000000});
    }
  }
  else{
    var countrynum = {};
    for(var i = 0; i < state.data.length; i++){
      var tmp;
      if(state.data[i]['Funding Amount (USD)'] == 'Unknown' 
          || !(state.tDate[state.data[i]['Funding Date'].slice(4)]) || 
          (state.ControlVertical != null && state.data[i]['Vertical'] != state.ControlVertical)||
          (state.ControlStage != null && state.data[i]['Funding Stage'] != state.ControlStage)) continue;
      if(!countrydata.hasOwnProperty(state.data[i]['Region'])) countrydata[state.data[i]['Region']] = countrynum[state.data[i]['Region']] = 0;
      tmp = Number(countrydata[state.data[i]['Region']]) + Number(state.data[i]['Funding Amount (USD)']);
      countrydata[state.data[i]['Region']] = tmp;
      countrynum[state.data[i]['Region']] ++ ;
    }
    for(var key in countrydata){
      mapdata.push({name: key, value: countrydata[key]/countrynum[key]/1000000});
      console.log(key, countrydata[key], countrynum[key])
    }
  }
  
  var option = 
  {
    title: {
      left: 'center',
      text: 'Regional Distribution of Funding',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} (million dollar)'
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        myTool1: {
          show: true,
          title: "还原",
          icon:
            "path://M512 981.333333c-209.866667 0-396.693333-126.026667-466.293333-314.08a35.52 35.52 0 0 1 23.626666-44.426666 38.613333 38.613333 0 0 1 48 20.693333c58.666667 158.933333 217.013333 265.493333 394.666667 265.6s336-106.666667 394.666667-266.133333a37.6 37.6 0 0 1 28.853333-23.626667 38.986667 38.986667 0 0 1 35.786667 11.946667 34.773333 34.773333 0 0 1 7.146666 35.36c-69.386667 188.373333-256.48 314.666667-466.453333 314.666666z m431.36-574.08a37.92 37.92 0 0 1-35.946667-24.266666C849.386667 222.56 690.613333 114.88 512 114.72S174.72 222.346667 116.746667 382.773333A38.72 38.72 0 0 1 69.333333 403.733333a35.786667 35.786667 0 0 1-24.106666-44.373333C113.333333 169.866667 301.013333 42.666667 512 42.666667s398.666667 127.306667 467.146667 316.96a34.56 34.56 0 0 1-4.906667 32.64 38.933333 38.933333 0 0 1-30.88 14.986666z",
          onclick: () => {
          //  const chart = echarts.init(main);
            // 还原
            if(main != ''){
              mychart.clear();
              mychart.setOption(option);
            }
          //  state.country = null;
            dispatch({type: 'country', payload: null});
          }
        },
        saveAsImage: {}
      }
    },
    visualMap: {
      min: 0,
      max: state.Average?400:10000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered']
      }
    },
    series: [
      {
        name: '世界',
        type: 'map',
        map: 'world',
        zoom: 1.2 ,
        label: {
          show: false
        },
        roam: true,
        scaleLimit: { //滚轮缩放的极限控制
                min: 1,
                max: 3
              },
        data: mapdata
      }
    ]
    
    /*
    geo: {
      type: 'map',
      map: 'world',
      roam: true,
      zoom: 1.2,
      label: {
        show: true,
      }
    }*/
  }
  useEffect(() => {
    var node = document.getElementById('main')
    setMain(state.data);
    console.log(countrydata);
    mychart = echarts.init(node);
    mychart.setOption(option);
    mychart.off('click');
    mychart.on('click', function(params) {
      if (params.seriesType === 'map') { // 判断是否为地图区域被点击
        var country = params.name;
        if(params.value != NaN && params.value > 0){
          dispatch({type: 'country', payload: country});
          dispatch({type: "Vertical", payload: null});
          dispatch({type: "Stage", payload: null});
          console.log(["md",state.country, country, params.value]);
        } 
        console.log([state.country, params.value]);
      }
    });      
  }, [main, state.data, state.tDate, state.Average])

  if (main !== "") {
    
    console.log("ee");
  }
  return (
    <div style={{ width: "100%", height: "100%" }} id="main"></div>
  )

}export default Overview;
/*

function Overview() {
    const {state, dispatch} = useContext(store);

    const getOption = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {    
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }]
        };
    };

    return <div>
        <ReactEcharts option={getOption()} />;
    </div>
}
export default Overview;
*/
