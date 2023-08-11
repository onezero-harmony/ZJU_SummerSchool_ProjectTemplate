import React from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import ReactDragListView from 'react-drag-listview'
import 'react-resizable/css/styles.css';
import './index.css'
 
const ResizeableTitle = (props) => {
	const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }
    return (
        <Resizable
            width={width?width:null}
            height={0}
            minConstraints={[50, 50]}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
            >
            <th {...restProps} />
        </Resizable>
    );
}
 
class DragTable extends React.Component {
 
    constructor(props) {
        super(props);
        this.state = {
            columns: this.props.columns
        }
    }
 
    static getDerivedStateFromProps(nextProps, prevState) {
        return null;
    }
 
    components = {
		header: {
			cell: ResizeableTitle,
	 	},
	};
   
	handleResize = index => (e, { size }) => {
		this.setState(({ columns }) => {
			const nextColumns = [...columns];
			nextColumns[index] = {
                ...nextColumns[index],
                width: size.width?size.width:'100%',
            };
			return { columns: nextColumns };
		});
	}
    
    render() {
        const { components, columns, ...others } = this.props;
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const columns = [...that.state.columns];
                const item = columns.splice(fromIndex, 1)[0];
                columns.splice(toIndex, 0, item);
                that.setState({
                    columns
                });
            },
            nodeSelector: "th",
            handleSelector: 'p'
        };
 
        const newColumns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width?column.width:100, // 100 没有设置宽度可以在此写死 例如100试下
                onResize: this.handleResize(index),
                style: { cursor: 'move' },
            }),
        })) 
        
        return (<ReactDragListView.DragColumn {...dragProps}>
            <Table 
                components={this.components}
                columns={newColumns}
                { ...others }
            ></Table>
        </ReactDragListView.DragColumn>)
    }
}
 
export default DragTable;