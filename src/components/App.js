// 本文件是界面UI的根目录

import React,{useEffect,useState} from 'react';
import clsx from "clsx";
import {makeStyles} from "@material-ui/core";
import AssistView from "./AssistView";
import ControlPanel from "./ControlPanel";
import Overview from "./Overview";
import DetailView from "./DetailView";
import "./ignore.css";

// 这是JSS的写法，相当于声明了一些css的类
/*const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    },
    view: {
        border: '1px solid black',
        borderRadius: '5px',
    },
    controlPanel: {
        position: 'absolute',
        top: 70,
        height: 100,
        left: 70,
        width: 100,
    },
    assistView: {
        position: 'absolute',
        top: 20,
        bottom: 370,
        left: 850,
        width: 675,
    },
    overview: {
        position: 'absolute',
        top: 20,
        bottom: 370,
        left: 300,
        right: 690,
    },
    detailView: {
        position: 'absolute',
        top: 350,
        bottom: 20,
        left: 300,
        right: 10,
    },
}))*/
const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: "#f9ecf1",
    },
    view: {
    //    border: '1px solid black',
    //    borderRadius: '5px',
    },
    controlPanel: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0    ,
        width: "18%",
        backgroundColor: "white",
    },
    assistView: {
        position: 'absolute',
        top: 0,
        bottom: "50%",
        left: "57%",
        right:"0.5%"
    //    backgroundColor: "white",
    },
    overview: {
        position: 'absolute',
        top: "1%",
        bottom: "51%",
        left: "19%",
        right: "43.5%",
    //    backgroundColor: "white",
    },
    detailView: {
        position: 'absolute',
        top: '49%',
        bottom: '1%',
        left: '19%',
        right: '0.5%',
    //    backgroundColor: "white",
    },

      
}))
// App组件
function App() {
    // 使用上述的css样式
    const classes = useStyles();
    const useBeforeRender = (callback: any, deps: any) => {
        const [isRun, setIsRun] = useState(false);
      
        if (!isRun) {
          callback();
          setIsRun(true);
        }
      
        useEffect(() => () => setIsRun(false), deps);
      };
      useBeforeRender(() => {
        window.addEventListener("error", (e) => {
          if (e) {
            const resizeObserverErrDiv = document.getElementById(
              "webpack-dev-server-client-overlay-div",
            );
            const resizeObserverErr = document.getElementById(
              "webpack-dev-server-client-overlay",
            );
            if (resizeObserverErr)
              resizeObserverErr.className = "hide-resize-observer";
            if (resizeObserverErrDiv)
              resizeObserverErrDiv.className = "hide-resize-observer";
          }
        });
      }, []);
    // 使用classes.root使用样式中定义的root类
    // 可视化项目中，若干视图一般采用绝对布局，方便后续调整各个视图的位置与大小
    // 目前四个视图都是一样的，查看AssistView的注释
    return <div className={classes.root}>
        <div className={clsx(classes.view, classes.controlPanel)}><ControlPanel/></div>
        <div className={clsx(classes.view, classes.assistView)}><AssistView/></div>
        <div className={clsx(classes.view, classes.overview)}><Overview/></div>
        <div className={clsx(classes.view, classes.detailView)}><DetailView/></div>
    </div>;
}
/*      */
export default App;