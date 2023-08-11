import React, { useContext, useEffect} from 'react';
import {useState} from 'react';
import DragTable from './DragTable';
import { store } from "../store";
import { SearchOutlined } from '@ant-design/icons';
import { useRef} from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
function AssistView(){
    
//  const [searchText, setSearchText] = useState('');
//  const [searchedColumn, setSearchedColumn] = useState('');
  const searchText = useRef('');
  const searchedColumn = useRef('');
  const searchInput = useRef(null);
  function setSearchText(params){
    searchText.value = params;
  }
  function setSearchedColumn(params){
    searchedColumn.value = params;
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };  
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
    const {state, dispatch} = useContext(store);
    console.log(state.data,"ee");
    var mydata = state.data.filter(company=>
        ((state.country === null || company.Region === state.country)
        &&(state.Stage === null || company['Funding Stage'] === state.Stage)
        &&(state.Vertical === null || company.Vertical === state.Vertical)
        &&(state.tDate[company['Funding Date'].slice(4)]))
        &&(state.ControlVertical == null || state.ControlVertical == company['Vertical'])
        &&(state.ControlStage == null || state.ControlStage == company['Funding Stage'])
      ).slice();
    console.log([mydata,state.Vertical,state.Stage]);
    mydata.sort((a,b)=>{
        if(a['Vertical'] != b['Vertical']) return (a['Vertical'] < b['Vertical'])?-1:1;
        else return (a['Funding Stage'] < b['Funding Stage'])?-1:1;
    })
    
    mydata = mydata.map((item, index) => {
        item['id'] = index + 1;
        return item;
    })
    function getfilter(key, mydata){
        var kind={};
        for(var i = 0; i < mydata.length; i++){
            kind[mydata[i][key]] = 1;
        }
        var res = [];
        for(let i in kind){
            res.push({text: i, value: i});
        }
        return res;
    }
    var myset = {loading: false, data: mydata};
    var stagedata = getfilter('Funding Stage',mydata);
    stagedata = stagedata.sort((a,b)=>{
      return (a.text<b.text)? -1: 1;
    });
    console.log(stagedata, searchText, searchedColumn);
    
    
    var tmp = [
        {
            "text": "Seed",
            "value": "Seed"
        },
        {
            "text": "Series A",
            "value": "Series A"
        },
        {
            "text": "Series B",
            "value": "Series B"
        },
        {
            "text": "Series E",
            "value": "Series E"
        },
        {
            "text": "Series H",
            "value": "Series H"
        },
        {
            "text": "Series C",
            "value": "Series C"
        },
        {
            "text": "Unknown",
            "value": "Unknown"
        },
        {
            "text": "Pre-Seed",
            "value": "Pre-Seed"
        },
        {
            "text": "Private Equity",
            "value": "Private Equity"
        },
        {
            "text": "Series D",
            "value": "Series D"
        },
        {
            "text": "Angel",
            "value": "Angel"
        },
        {
            "text": "Series F",
            "value": "Series F"
        },
        {
            "text": "Unkown",
            "value": "Unkown"
        },
        {
            "text": "Debt Financing",
            "value": "Debt Financing"
        },
        {
            "text": "Funding",
            "value": "Funding"
        },
        {
            "text": "Series G",
            "value": "Series G"
        },
        {
            "text": "Undisclosed",
            "value": "Undisclosed"
        },
        {
            "text": "ICO",
            "value": "ICO"
        },
        {
            "text": "Initial Coin Offering",
            "value": "Initial Coin Offering"
        },
        {
            "text": "Crowdfunding",
            "value": "Crowdfunding"
        },
        {
            "text": "Growth",
            "value": "Growth"
        },
        {
            "text": "Grant",
            "value": "Grant"
        }
    ]
    let reFF = useRef(0) ;
    var val = reFF.current;
    console.log(val, state);
    useEffect(()=>{console.log("damai");reFF.current++;val++;},[state]);
    
    console.log(val, state);
    console.log([tmp, stagedata.slice(0,2), tmp == stagedata.slice(0,2)])
    var columns = [
        { title: () => { return <p>index</p> }, dataIndex: 'id', key: 'id', ellipsis: true, 
            sorter: (a, b) => a.id - b.id,
        },
        { title: () => { return <p>Company</p> }, dataIndex: 'Company', key: 'Company', ellipsis: true, 
            sorter: (a, b) => (a.Company < b.Company)?-1:1,
            ...getColumnSearchProps('Company'),
        },
        { title: () => { return <p>Website</p> }, dataIndex: 'Website', key: 'Website', ellipsis: true, 
            sorter: (a, b) => (a.Website < b.Website)?-1:1,
        },
        { title: () => { return <p>Region</p> }, dataIndex: 'Region', key: 'Region', ellipsis: true, 
            sorter: (a, b) => (a.Region < b.Region)?-1:1,
            ...getColumnSearchProps('Region'),
        },
        { title: () => { return <p>Vertical</p> }, dataIndex: 'Vertical', key: 'Vertical', ellipsis: true,
            sorter: (a, b) => (a.Vertical < b.Vertical)?-1:1,
            ...getColumnSearchProps('Vertical'),
        },
        { title: () => { return <p>Funding Amount (USD)</p> }, dataIndex: 'Funding Amount (USD)', key: 'Funding Amount (USD)', ellipsis: true, 
            sorter: (a, b) => ((a['Funding Amount (USD)'] == 'Unknown' || (a['Funding Amount (USD)']!='Unknown' && b['Funding Amount (USD)']!='Unknown' && Number(a['Funding Amount (USD)']) < Number(b['Funding Amount (USD)'])))?-1:1), 
        },
        { title: () => { return <p>Funding Stage</p> }, dataIndex: 'Funding Stage', key: 'Funding Stage', ellipsis: true, 
            sorter: (a, b) => (a['Funding Stage'] < b['Funding Stage'])?-1:1,
            filters: [...stagedata], 
            filterSearch: true,
            
            filterMode: 'menu',
            onFilter: (value, record) => record['Funding Stage'].startsWith(value),
        },
        { title: () => { return <p>Funding Date</p> }, dataIndex: 'Funding Date', key: 'Funding Date', ellipsis: true, 
            sorter: (a, b) => (a['Funding Date'] < b['Funding Date'])?-1:1,
            ...getColumnSearchProps('Funding Date'),
        },
    ]
    console.log(columns);
    
    return (
        <div id="table">
            <DragTable
                key = {val}
                columns={[...columns]}
            //    loading={myset.loading}
                rowKey='id'
                dataSource={[...mydata]}
                size='small'
                pagination={true}
                style={{marginTop: 10, }}
                rowClassName={(record, index) => {}}
                scroll={{x: 1000, y: 'calc(32vh)'}   }
            ></DragTable></div>);
}
/*
import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];
const AssistView = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>{
      console.log("mayamaya");
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );}
  });
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '20%',
      ...getColumnSearchProps('age'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ['descend', 'ascend'],
    },
  ];
  console.log("buyaoa");
  return <Table columns={columns} dataSource={data} />;
};*/
export default AssistView;