
// 不同请求的处理
const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case 'increment':
            return {
                ...state,
                count:( state.count + 1)%3,
            };
        case 'init': {
            let newData = [];
            // TODO: use action.payload to update newData
            console.log(action.payload[0]['item']);
            newData = action.payload;
            newData.pop();
            return {
                ...state,
                data: newData
            };
        }
        case 'country': {
            return {
                ...state,
                country: action.payload
            }
        }
        case 'Vertical':{
            return{
                ...state,
                Vertical: action.payload
            }
        }
        case 'Stage':{
            return{
                ...state,
                Stage: action.payload
            }
        }
        case 'tDate':{
            console.log("woc");
            let mp = {'20':0, '21': 0};
            for(let i = 0; i < action.payload.length; i++){
                console.log(action.payload[i].slice(2));
                mp[action.payload[i].slice(2)] = 1;
            }
            return{
                ...state,
                tDate: mp
            }
        }
        case "ControlVertical":{
            console.log("aaaaaaaaaaaa",action.payload);
            if(action.payload == '') action.payload = null;
            return{
                ...state,
                ControlVertical: action.payload
            }
        }
        case "ControlStage":{
            if(action.payload == '') action.payload = null;
            return{
                ...state,
                ControlStage: action.payload
            }
        }
        case "Average":{
            var x = state.Average;
            x ^= 1;
            return{
                ...state,
                Average: x
            }
        }
        default:
            throw new Error();
    }
}

export default reducer;