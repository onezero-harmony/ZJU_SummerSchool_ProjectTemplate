import React, { useContext, useEffect} from 'react';
import {useState} from 'react';
import { store } from "../store";
import * as echarts from "echarts";
import worldJson from 'echarts/map/json/world.json'
import ReactEcharts from "echarts-for-react";
import 'echarts/map/js/china';

function DetailView1() {
    const {state, dispatch} = useContext(store);
    let [main, setMain] = useState('')
    var mychart;
    var mapdata = state.data.filter(company=>
      state.country === null || company.Region === state.country
    );
    console.log([state.country]);
    mapdata.sort((a,b)=>{
        if(a['Vertical'] != b['Vertical']) return (a['Vertical'] < b['Vertical'])?-1:1;
        else return (a['Funding Stage'] < b['Funding Stage'])?-1:1;
    })
    let sz = 0, flag = 0, chsz = 0;
    let mydata = [];
//    console.log(mapdata);
    for(var i = 0; i < mapdata.length; i++){
        if(mapdata[i]['Funding Amount (USD)'] == 'Unknown') continue;
        if(state.country != null && state.country != mapdata[i]['Region']) continue;
        
        if(flag == 0){
            flag = 1;
            chsz++;
            sz++;
            mydata.push({
                name: mapdata[i]['Vertical'], 
                value: Number(mapdata[i]['Funding Amount (USD)']),
                children: [{
                    name: mapdata[i]['Funding Stage'],
                    value: Number(mapdata[i]['Funding Amount (USD)']),
                }]
            })
            console.log(mapdata[i]['Funding Stage']);
            continue;
        }
        else{
            
            if(mapdata[i]['Vertical'] == mapdata[i - 1]['Vertical']){
           //     console.log([mapdata[i]['Vertical'], mapdata[i - 1]['Vertical']]);
                if(mapdata[i]['Funding Stage'] == mapdata[i-1]['Funding Stage']){
                    mydata[sz - 1]['value'] += Number(mapdata[i]['Funding Amount (USD)']);
                    mydata[sz - 1]['children'][chsz - 1]['value'] += Number(mapdata[i]['Funding Amount (USD)']);
                }
                else{
                    mydata[sz - 1]['value'] += Number(mapdata[i]['Funding Amount (USD)']);
                    chsz++;
                    mydata[sz - 1]['children'].push({
                        name: mapdata[i]['Funding Stage'],
                        value: Number(mapdata[i]['Funding Amount (USD)']),
                    })
                }
            }
            else{
                chsz = 1;
                sz++;
                mydata.push({
                    name: mapdata[i]['Vertical'], 
                    value: Number(mapdata[i]['Funding Amount (USD)']),
                    children: [{
                        name: mapdata[i]['Funding Stage'],
                        value: Number(mapdata[i]['Funding Amount (USD)']),
                    }]
                })
            }
        }
    }
  //  console.log(mydata);
    function getLevelOption() {
        return [
          {
            itemStyle: {
              borderColor: '#777',
              borderWidth: 0,
              gapWidth: 1,
            },
            upperLabel: {
              show: false
            }
          },
          {
            itemStyle: {
              borderColor: '#555',
              borderWidth: 5,
              gapWidth: 1,
            },
            emphasis: {
              itemStyle: {
                borderColor: '#ddd'
              }
            }
          },
          {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              borderWidth: 5,
              gapWidth: 1,
              borderColorSaturation: 0.6
            }
          }
        ];
      }
    var option = {
        title: {
        text: 'Disk Usage',
        left: 'center'
        },
        /*tooltip: {
        formatter: function (info) {
            var value = info.value;
            var treePathInfo = info.treePathInfo;
            var treePath = [];
            for (var i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
            }
            return [
            '<div class="tooltip-title">' +
                echarts.format.encodeHTML(treePath.join('/')) +
                '</div>',
            'Disk Usage: ' + echarts.format.addCommas(value) + ' KB'
            ].join('');
        }
        },*/
        series: [
        {
            Datazoom: 'Inside',
            left: 5,
            right: 5,
            top: 30,
            bottom: -5,
            name: 'Disk Usage',
            type: 'treemap',
            visibleMin: 300,
            label: {
            show: true,
            formatter: '{b}'
            },
            upperLabel: {
            show: true,
            height: 30
            },
            itemStyle: {
            borderColor: '#fff'
            },
            levels: getLevelOption(),
            data: mydata
        }]
    }
  useEffect(() => {
    var node = document.getElementById('mainDetail')
    setMain(state.data);
    mychart = echarts.init(node);
    mychart.setOption(option); 
    console.log("no");
  }, [main, state.country, state.data]);

  if (main !== "") {
    
    console.log("ee");
  }
  return (
    <div style={{ width: "100%", height: "100%" }} id="mainDetail"></div>
  )

}

var Seed = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesA = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesB = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesC = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesD = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesE = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesF = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var SeriesG = [0, 0, 0, 0, 0, 0, 0, 0, 0]

function countVerticals(vertical,list) {
    switch (vertical) {
        case 'B2B Software':
            list[0]++;
            break;
        case 'Artificial Intelligence':
            list[1]++;
            break;
        case 'Blockchain': 
            list[2]++;
            break;
        case 'Cloud Computing':
            list[3]++;
            break;
        case 'Cyber Security':
            list[4]++;
            break;
        case 'Education':
            list[5]++;
            break;
        case 'Finance':
            list[6]++;
            break;
        case 'Health Care':
            list[7]++;
            break;
        default:
            list[8]++;
            break;
    }
  
    return list;
  }

function DetailView2() {
    const {state, dispatch} = useContext(store);
    let [main, setMain] = useState('')
    var mychart;
    //console.log(state.data)

    var mydata = [0, 0, 0, 0, 0, 0, 0, 0]

    var verticallist = ['B2B Software', 'Artificial Intelligence', 'Blockchain', 'Cloud Computing', 'Cyber Security', 'Education', 'Finance', 'Health Care', 'etc']
    var stagelist = ['Seed','Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Series G']
    var mapdata = state.data.filter(company=>
        state.country === null || company.Region === state.country
      );
    for(var i = 0; i < mapdata.length; i++){
        switch(mapdata[i]['Funding Stage']){
            case 'Seed': 
                mydata[0]++;
                countVerticals(mapdata[i]['Vertical'], Seed);
                break;
            case 'Series A':
                mydata[1]++;
                countVerticals(mapdata[i]['Vertical'], SeriesA);
                break;
            case 'Series B':
                mydata[2]++;
                countVerticals(mapdata[i]['Vertical'], SeriesB);
                break;
            case 'Series C':
                mydata[3]++;
                countVerticals(mapdata[i]['Vertical'], SeriesC);
                break;
            case 'Series D':
                mydata[4]++;
                countVerticals(mapdata[i]['Vertical'], SeriesD);
                break;
            case 'Series E':
                mydata[5]++;
                countVerticals(mapdata[i]['Vertical'], SeriesE);
                break; 
            case 'Series F':
                mydata[6]++;
                countVerticals(mapdata[i]['Vertical'], SeriesF);
                break;
            case 'Series G':
                mydata[7]++;
                countVerticals(mapdata[i]['Vertical'], SeriesG);
                break;
        }
      }

    //console.log(Seed)


    const option = {
        //console.log(SeriesA)
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  // Use axis to trigger tooltip
                  type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
              },
              legend: {},
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
                data: verticallist
            },
            series: [
                {
                    name: stagelist[0],
                    data: Seed,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[1],
                    data: SeriesA,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[2],
                    data: SeriesB,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[3],
                    data: SeriesC,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[4],
                    data: SeriesD,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[5],
                    data: SeriesE,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[6],
                    data: SeriesF,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: stagelist[7],
                    data: SeriesG,
                    label: {
                        show: true
                    },
                    stack: 'total',
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                }
            ]
    };

    useEffect(() => {
        var node = document.getElementById('mainDetail2')
        setMain(state.data);
        mychart = echarts.init(node);
        mychart.setOption(option); 
    }, [main, state.country, state.data]);
    if (main !== "") {
    
    console.log("ee");
    }
    return (
    <div style={{ width: "100%", height: "100%" }} id="mainDetail2"></div>
    )
}

function DetailView(){
  const {state, dispatch} = useContext(store);
  if(state.count == 0){
    return (
      <DetailView1/>
    );
  }
  else if(state.count%2){
    if(document.getElementById("mainDetail")!=null){
      document.getElementById("mainDetail").removeAttribute("_echarts_instance_");
      document.getElementById("mainDetail").innerHTML="";
    }
    return (<><DetailView2/></>);
  }
  else {
    if(document.getElementById("mainDetail2")!=null){
      document.getElementById("mainDetail2").removeAttribute("_echarts_instance_");
      document.getElementById("mainDetail2").innerHTML="";
    }
    return (<><DetailView1/></>);
  }
}

export default DetailView;