import React, { useContext, useEffect} from 'react';
import {useState} from 'react';
import { store } from "../store";
import * as echarts from "echarts";
import worldJson from 'echarts/map/json/world.json'
import ReactEcharts from "echarts-for-react";
import 'echarts/map/js/china';

function DetailView1() {
    const {state, dispatch} = useContext(store);
    console.log(state.ControlVertical);
    let [main, setMain] = useState('')
    var mychart;
    var mapdata = state.data.filter(company=>
      ((state.country === null || company.Region === state.country)
      &&(state.tDate[company['Funding Date'].slice(4)])&&(state.ControlVertical == null || state.ControlVertical == company['Vertical'])
      &&(state.ControlStage == null || state.ControlStage == company['Funding Stage'])
    )).slice();
    console.log(mapdata);
    mapdata.sort((a,b)=>{
        if(a['Vertical'] != b['Vertical']) return (a['Vertical'] < b['Vertical'])?-1:1;
        else return (a['Funding Stage'] < b['Funding Stage'])?-1:1;
    })
    let sz = 0, flag = 0, chsz = 0;
    let mydata = [], cntver = 0, cntsta = 0;
//    console.log(mapdata);
    for(var i = 0; i < mapdata.length; i++){
        if(mapdata[i]['Funding Amount (USD)'] == 'Unknown') continue;
        if(state.country != null && state.country != mapdata[i]['Region']) continue;
        
        if(flag == 0){
            flag = 1;
            cntver = cntsta = 1;
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
                    cntver++; cntsta++;
                    mydata[sz - 1]['value'] += Number(mapdata[i]['Funding Amount (USD)']);
                    mydata[sz - 1]['children'][chsz - 1]['value'] += Number(mapdata[i]['Funding Amount (USD)']);
                }
                else{
                    if(state.Average) mydata[sz - 1]['children'][chsz - 1]['value'] /= cntsta;
                    mydata[sz - 1]['value'] += Number(mapdata[i]['Funding Amount (USD)']);
                    chsz++;
                    cntver++;
                    cntsta = 1;
                    mydata[sz - 1]['children'].push({
                        name: mapdata[i]['Funding Stage'],
                        value: Number(mapdata[i]['Funding Amount (USD)']),
                    })
                }
            }
            else{
                if(state.Average) mydata[sz - 1]['children'][chsz - 1]['value'] /= cntsta;
                if(state.Average) mydata[sz - 1]['value'] /= cntver;
                cntver = cntsta = 1;
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
    if(state.Average) mydata[sz - 1]['children'][chsz - 1]['value'] /= cntsta;
    if(state.Average) mydata[sz - 1]['value'] /= cntver;
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
        text: (state.country) == null ? 'World':state.country,
        left: 'center'
        },
        tooltip: {
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
            'Funding Amount (million USD): ' + echarts.format.addCommas(value/1000000)
            ].join('');
        }
        },
        series: [
        {
            Datazoom: 'Inside',
            left: 5,
            right: 5,
            top: 30,
            bottom: -5,
            name: ((state.country) == null ? 'World':state.country)+" " + 'Funding Amount',
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
    mychart.off('click');
    mychart.on('click', function(params) {
        console.log(params);
        if (params.seriesType === 'treemap') { // 判断是否为地图区域被点击
            
            if(params.treePathInfo.length == 3){
                dispatch({type: "Vertical", payload: params.treePathInfo[1].name});
                dispatch({type: "Stage", payload: params.treePathInfo[2].name});
            //    console.log("akldfjaldfasd");
            }
            else if(params.treePathInfo.length == 2) {
                dispatch({type: "Vertical", payload: params.treePathInfo[1].name});
                dispatch({type: "Stage", payload: null});
            }
            else{
                dispatch({type: "Vertical", payload: null});
                dispatch({type: "Stage", payload: null});
            }
        }
      });  
  }, [main, state.country, state.data, state.tDate, state.Average]);

  if (main !== "") {
    
    console.log("ee");
  }
  return (
    <div style={{ width: "100%", height: "100%" }} id="mainDetail"></div>
  )

}



function countVerticals(vertical,list,num,sum) {
    
    switch (vertical) {
        case 'B2B Software':
            list[0]+=num;
            break;
        case 'Artificial Intelligence':
            list[1]+=num;
            break;
        case 'Blockchain': 
            list[2]+=num;
            break;
        case 'Cloud Computing':
            list[3]+=num;
            break;
        case 'Cyber Security':
            list[4]+=num;
            break;
        case 'Education':
            list[5]+=num;
            break;
        case 'Finance':
            list[6]+=num;
            break;
        case 'Health Care':
            list[7]+=num;
            break;
        default:
            sum -= num / 100;
  //          list[8]+=num;
            break;
    }
    console.log(list, num);
    return sum;
  }

function divide(list, num){
    for(var i = 0; i<8;i++){
        list[i] /= num;
    }
    return list;
}

function DetailView2() {
    const {state, dispatch} = useContext(store);
    let [main, setMain] = useState('')
    var mychart;
    //console.log(state.data)

    var mydata = [0, 0, 0, 0, 0, 0, 0]
    var Seed = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesA = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesB = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesC = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesD = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesE = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesF = [0, 0, 0, 0, 0, 0, 0, 0]
    var SeriesG = [0, 0, 0, 0, 0, 0, 0, 0]
    var Seriesetc= [0, 0, 0, 0, 0, 0, 0, 0]
    var verticallist = ['B2B Software', 'Artificial Intelligence', 'Blockchain', 'Cloud Computing', 'Cyber Security', 'Education', 'Finance', 'Health Care']
    var stagelist = ['Seed','Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Series G', 'etc']
    var mapdata = state.data.filter(company=>
        ((state.country === null || company.Region === state.country)
        &&(state.tDate[company['Funding Date'].slice(4)]))&&(state.ControlVertical == null || state.ControlVertical == company['Vertical'])
        &&(state.ControlStage == null || state.ControlStage == company['Funding Stage'])
        );
    
    var sum = 0;
    for(var i = 0; i < mapdata.length; i++){
        if(mapdata[i]['Funding Amount (USD)'] == 'Unknown' ) continue;
        sum += mapdata[i]['Funding Amount (USD)'] / 100000000;
        switch(mapdata[i]['Funding Stage']){
            case 'Seed': 
                mydata[0] += mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], Seed, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break;
            case 'Series A':
                mydata[1]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesA, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break;
            case 'Series B':
                mydata[2]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesB, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break;
            case 'Series C':
                mydata[3]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesC, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break;
            case 'Series D':
                mydata[4]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesD, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break;
            case 'Series E':
                mydata[5]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesE, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break; 
            case 'Series F':
                mydata[6]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesF, mapdata[i]['Funding Amount (USD)'] / 1000000, sum);
                break;
            case 'Series G':
                mydata[7]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], SeriesG, mapdata[i]['Funding Amount (USD)']/ 1000000,sum);
                break;
            default:
                mydata[8]+= mapdata[i]['Funding Amount (USD)'] / 1000000;
                sum = countVerticals(mapdata[i]['Vertical'], Seriesetc, mapdata[i]['Funding Amount (USD)']/ 1000000,sum);
                break;
        }
      }
      Seed = divide(Seed,sum);
      SeriesA = divide(SeriesA, sum);
      SeriesB = divide(SeriesB, sum);
      SeriesC = divide(SeriesC, sum);
      SeriesD = divide(SeriesD, sum);
      SeriesE = divide(SeriesE, sum);
      SeriesF = divide(SeriesF, sum);
      SeriesG = divide(SeriesG, sum);
      Seriesetc = divide(Seriesetc, sum);
    console.log(sum)

    const option = {
        //console.log(SeriesA)
        title: {
            top: 5,
            text: (state.country) == null ? 'World':state.country,
            left: 'center'
        },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  // Use axis to trigger tooltip
                  type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
              },
              legend: {top: 33  },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
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
                        show: false,
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
                        show: false,
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
                        show: false,
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
                        show: false,
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
                        show: false,
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
                        show: false,
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
                        show: false,
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
                        show: false,
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
                    name: stagelist[8],
                    data: Seriesetc,
                    label: {
                        show: false,
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
    }, [main, state.country, state.data, state.tDate]);
    if (main !== "") {
    
    console.log("ee");
    }
    return (
    <div style={{ width: "100%", height: "100%" }} id="mainDetail2"></div>
    )
}
function DetailView3(){
    const {state, dispatch} = useContext(store);
    let [main, setMain] = useState('')
    var mychart;
    const data =state.data.filter(company=>
        ((state.country === null || company.Region === state.country)
        &&(state.tDate[company['Funding Date'].slice(4)]))&&(state.ControlVertical == null || state.ControlVertical == company['Vertical'])
        &&(state.ControlStage == null || state.ControlStage == company['Funding Stage'])
        );
    const categoryData = {};

    for (const entry of data) {
        const category = entry['Funding Date'];
        const fundingAmount = parseFloat(entry['Funding Amount (USD)']);

        if (!isNaN(fundingAmount) && category) {
            const amount = entry['Funding Amount (USD)'] !== 'Unknown' ? fundingAmount : 0;
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += amount;
        }
    }

    const xAxisData = Object.keys(categoryData);
    const seriesData = Object.values(categoryData);

    const option = {
        title: {
            text: 'Trend',
            left: "40%",
            top: "5%",
            textStyle: {
                fontSize: 30,
                fontWeight: "bolder"
            },
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            name: 'Mouth',
            data: xAxisData,
            axisLabel: {
                show: true,
                fontStyle: "normal",
                fontWeight: "bolder",
                fontSize: 9
            },
            nameTextStyle: {
                fontWeight: "bolder",
                fontSize: 18
            }

        },
        grid: {
            top: "20%",
            containLabel: true
        },
        yAxis: {
            type: 'value',
            name: 'Funding Amount(USD)',
            nameTextStyle: {
                fontStyle: "normal",
                fontSize: 18,
                fontWeight: "bolder",
                lineHeight: 80
            },
            nameLocation: "end",
            axisLabel: {
                show: true,
                fontStyle: "normal",
                fontWeight: "bolder",
                fontSize: 15
            }
        },

        series: [
            {
                data: seriesData,
                type: 'line',

            }
        ]
    };
    useEffect(() => {
        var node = document.getElementById('mainDetail3')
        setMain(state.data);
        mychart = echarts.init(node);
        mychart.setOption(option); 
    }, [main, state.country, state.data, state.tDate]);
    if (main !== "") {
    
    console.log("ee");
    }
    return (
    <div style={{ width: "100%", height: "100%" }} id="mainDetail3"></div>
    )
}
        

function DetailView(){
  const {state, dispatch} = useContext(store);
  if(state.count == 0 || state.Average == 1){
    if(document.getElementById("mainDetail2")!=null){
        document.getElementById("mainDetail2").removeAttribute("_echarts_instance_");
        document.getElementById("mainDetail2").innerHTML="";
    }
    if(document.getElementById("mainDetail3")!=null){
        document.getElementById("mainDetail3").removeAttribute("_echarts_instance_");
        document.getElementById("mainDetail3").innerHTML="";
    }
    return (
      <DetailView1/>
    );
  }
  else if(state.count == 1 && state.Average == 0){
    if(document.getElementById("mainDetail")!=null){
      document.getElementById("mainDetail").removeAttribute("_echarts_instance_");
      document.getElementById("mainDetail").innerHTML="";
    }
    if(document.getElementById("mainDetail3")!=null){
        document.getElementById("mainDetail3").removeAttribute("_echarts_instance_");
        document.getElementById("mainDetail3").innerHTML="";
    }
    return (<><DetailView2/></>);
  }
  else {
    if(document.getElementById("mainDetail")!=null){
        document.getElementById("mainDetail").removeAttribute("_echarts_instance_");
        document.getElementById("mainDetail").innerHTML="";
    }
    if(document.getElementById("mainDetail2")!=null){
      document.getElementById("mainDetail2").removeAttribute("_echarts_instance_");
      document.getElementById("mainDetail2").innerHTML="";
    }
    return (<><DetailView3/></>);
  }
}

export default DetailView;