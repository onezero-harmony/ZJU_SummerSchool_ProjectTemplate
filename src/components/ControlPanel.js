import React, {useContext, useRef, useState} from 'react';
import {store} from "../store";
import { Button, Space } from 'antd';
import { Checkbox, Divider, Input } from 'antd';
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['2020', '2021'];
const defaultCheckedList = ['2020', '2021'];

function ControlPanel() {
    const {state, dispatch} = useContext(store);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    var word = useRef('');
    var word2 = useRef('');
    const onChange = (list) => {
      setCheckedList(list);
      setIndeterminate(!!list.length && list.length < plainOptions.length);
      setCheckAll(list.length === plainOptions.length);
    };
  
    const onCheckAllChange = (e) => {
      setCheckedList(e.target.checked ? plainOptions : []);
      setIndeterminate(false);
      setCheckAll(e.target.checked);
    };
    const OnChange1 =(event)=>{
      word.current = event.target.value
      console.log(word)
    }
    const OnChange2 =(event)=>{
      word2.current = event.target.value
      console.log(word)
    }
    const submit = () => {
        console.log(checkedList, word.current);
        dispatch({type: "tDate", payload: checkedList});
        dispatch({type: "ControlVertical", payload: word.current});
        dispatch({type: "ControlStage", payload: word2.current});
    }
    if(!state.Average)
    return (
    <div style={{position:"relative"}}>
      <div style={{width: "80%", position:"absolute", top: 100, left: 30 }}>
        <p>Choose year</p> 
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} style= { {textAlign:"center"}} checked={checkAll}>
          Check all
        </Checkbox>
        <p></p>
        
        <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
        <p> </p>
        <Input  type="text" onChange={OnChange1} placeholder="Choose Vertical" ></Input>
        <p></p>
        <Input  type="text" onChange={OnChange2} placeholder="Choose Stage" ></Input>
        <p></p>
        <Button type="primary" style={{width: "100%"}}onClick={submit}>Apply</Button>
        <Divider></Divider>
        <Button tyoe="primary" style={{width: "100%"}} onClick={() => dispatch({type: 'increment'})}>{state.count%3 == 2?'Funding Amount' : ((state.count%3 == 0)?'Funding Ratio':'Trend')}</Button>
        <p></p>
        <Button tyoe="primary" style={{width: "100%"}} onClick={() => dispatch({type: 'Average'})}>{state.Average?'View Initial Data' : 'View Average'}</Button>
      </div>
      <div style={{position:"absolute", bottom: 100}}>{"Help"}</div>
    </div>
    );
    else
    return (
      <div style={{position:"relative", height: "100%", width:"100%"} }>
        <div style={{width: "80%", position:"absolute", top: 100, left: 30 }}>
          <p>Choose year</p> 
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} style= { {textAlign:"center"}} checked={checkAll}>
            Check all
          </Checkbox>
          <p></p>
          
          <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
          <p> </p>
          <Input  type="text" onChange={OnChange1} placeholder="Choose Vertical" ></Input>
          <p></p>
          <Input  type="text" onChange={OnChange2} placeholder="Choose Stage" ></Input>
          <p></p>
          <Button type="primary" style={{width: "100%"}}onClick={submit}>Apply</Button>
          <Divider></Divider>
          <Button tyoe="primary" style={{width: "100%"}} onClick={() => dispatch({type: 'increment'})} disabled>{state.count%3 == 2?'Funding Amount' : ((state.count%3 == 0)?'Funding Ratio':'Trend')}</Button>
          <p></p>
          <Button tyoe="primary" style={{width: "100%"}} onClick={() => dispatch({type: 'Average'})}>{state.Average?'View Initial Data' : 'View Average'}</Button>
        </div>
        <div style={{position:"absolute", bottom: "3%", left:"45%" }}><a href="https://www.bilibili.com/" target="_blank" title="Help">Help</a></div>
        
      </div>
      );  
//    var m = state.count%2? 'aa': 'ab'
/*    return <div>
        <p>{state.count}</p>
        <Button onClick={() => dispatch({type: 'increment'}) } autoSize={{ enable: false }} style={{width: "100%"}}  >{m}</Button>
    </div>;*/
}

export default ControlPanel;