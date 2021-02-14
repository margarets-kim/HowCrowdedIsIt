import axios from 'axios';
import './App.css';
import React,{useState,useEffect} from 'react'
import ReactMarkdown from 'react-markdown';

const time = [{
  'ONE':1,'TWO':2,'TREE':3,'FOUR':4,'SIX':6,'SEVEN':7,'EIGHT':8,'NINE':9,'TEM':10,'ELEVEN':11,'TWELVE':12,'THIRTEEN':13,'FOURTEEN':14,'FIFTEEN':15,'SIXTEEN':16,'SEVENTEEN':17,'EIGHTENN':18,'NINETEEN':19,'TWENTY':20,'TWENTY_ONE':21,'TWENTY_TWO':22,'TWENTY_THREE':23,'TWENTY_FOUR':24
}
]
const time_ = [
  
'ONE','TWO','TREE','FOUR','SIX','SEVEN','EIGHT','NINE','TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN','TWENTY','TWENTY_ONE','TWENTY_TWO','TWENTY_THREE','TWENTY_FOUR'
]
const App = () => {


  const [date, setDate] = useState(new Date());
  const [search,setSearch] = useState()
  const [data, setData] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graph,setGraph] = useState(false)

  function tick() {
    setDate(new Date());
   }
  const onKeyPress = (e)=>{
    if(e.key == 'Enter'){
      getApi(search);
    }
  }
  const getHistory = async (Station,Line) =>{
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setError(null);
      setData(null);
      // loading 상태를 true 로 바꿉니다.
      setLoading(true);
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/55577058466d696e3932774c4f6e55/json/CardSubwayTime/1/1000/202101/${encodeURI(Line)}/${encodeURI(Station)}`
      );
      try{
        const nowData = response.data.CardSubwayTime.row[0];
        setResult(nowData[`${time_[date.getHours()-2]}_RIDE_NUM`]+nowData[`${time_[date.getHours()-2]}_ALIGHT_NUM`]);
         
      }
      catch(e){
        setError('There is No Data in Seoul Open API');
        setResult(null)
      }
      // // 데이터는 response.data 안에 들어있습니다.
    } catch (e) {
      console.log(e);
    }
  }
  const getApi = async (search) =>{
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setError(null);
      setData(null);
      // loading 상태를 true 로 바꿉니다.
      setLoading(true);
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/55577058466d696e3932774c4f6e55/json/SearchInfoBySubwayNameService/1/10/${encodeURI(search)}`
      );
      try{
        setData(response.data.SearchInfoBySubwayNameService.row);
       
      }
      catch(e){
        setError('There is No Data in Seoul Open API');
        setResult(null)
      }
    } catch (e) {
      console.log(e);
    }
  }
  function GrpahContents(){
    return(
      <section>
        <div>
          <h3>The station with the most passengers by time zone</h3>
          <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
              import csv
              f = open('subwaytime.csv')
              data = csv.reader(f)
              next(data)
              next(data)
              mx = [0] * 24
              mx_station = [''] * 24
              for row in data :
                  row[4:] = map(int, row[4:])
                  for j in range(24) :
                      a = row[j * 2 + 4]
                      if a > mx[j] :
                          mx[j] = a
                          mx_station[j] = row[3]+'('+str(j+4)+')' 
              import matplotlib.pyplot as plt
              #plt.figure(dpi = 300)
              plt.rc('font',family = 'Malgun Gothic')
              plt.bar(range(24), mx)
              plt.xticks(range(24), mx_station, rotation = 90)
              plt.show()
               `
            }
          />
              
            <img className="graph-img row-child" src='/graph/ride.png'/>
          </div>
          
        </div>
        <div>
        <h3>The station with the most drop-offs by time zone.</h3>
        <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
              import csv
              import matplotlib.pyplot as plt
              f = open('subwaytime.csv')
              data = csv.reader(f)
              next(data)
              next(data)
              mx = [0] * 24
              mx_station = [''] * 24
              for row in data :
                  row[4:] = map(int, row[4:])
                  for j in range(24) :
                      b = row[5 + j * 2]
                      if b > mx[j] :
                          mx[j] = b
                          mx_station[j] = row[3]+'('+str(j+4)+')'
              #plt.figure(dpi = 300)
              plt.rc('font',family = 'Malgun Gothic')
              plt.bar(range(24), mx, color = 'b')
              plt.xticks(range(24), mx_station, rotation = 90)
              plt.show()
               `
            }
          />
              
            <img className="graph-img row-child" src='/graph/dropoff.png'/>
          </div>
        </div>
        <div>
          <h3>Trend of people getting in and out by subway time zone</h3>
          <div className="row">
          <ReactMarkdown source=
            {
              ` \`\`\`
              import csv
              f = open('subwaytime.csv')
              data = csv.reader(f)
              next(data)
              next(data)
              s_in = [0] * 24
              s_out = [0] * 24
              for row in data :
                  row[4:] = map(int, row[4:])
                  for i in range(24) :
                      s_in[i] += row[4 + i * 2]
                      s_out[i] += row[5 + i * 2]
              import matplotlib.pyplot as plt
              plt.figure(dpi = 300)
              plt.rc('font', family = 'Malgun Gothic')
              plt.title('지하철 시간대별 승하차 인원 추이')
              plt.plot(s_in, label = '승차')
              plt.plot(s_out, label = '하차')
              plt.legend()
              plt.xticks(range(24), range(4,28))
              plt.show()
               `
            }
          />
              
            <img className="graph-img row-child" src='/graph/last.png'/>
          </div>
        </div>
      </section>
    )
  }

  useEffect(() => {
    var timerID = setInterval( () => tick(), 1000 );
    return function cleanup() {
        clearInterval(timerID);
      };
   });
   


  return (
    <div className="App">
      <header className="App-header">
        <h1>How Crowded Is It?</h1>
        <p>by Jinwoo Moon, 2021/02</p>
        <h2>{date.toLocaleTimeString()}</h2>
       <input type="search" onKeyPress={onKeyPress} onChange={(e)=>{setSearch(e.target.value);setResult(null)}} placeholder="Enter a Station Name"/>
       {data&&
       <>
        <h3>Choose Line</h3>
        {
        data.map((index,key)=>(
          <a href="#" onClick={()=>getHistory(index['STATION_NM'],(index['LINE_NUM'].charAt(0)==='0'?index['LINE_NUM'].slice(1):index['LINE_NUM']))}><li>{(index['LINE_NUM'].charAt(0)==='0'?index['LINE_NUM'].slice(1):index['LINE_NUM'])}</li></a>
        ))
        }</>
        }
       {error&&
       error
       }
       {
         result&&
         <p>{date.getHours()} o'clock<br/>Historical data were {result} people.<br/>It is expected to be crowded..</p>
       }
       <a href="#" onClick={()=>graph?setGraph(false):setGraph(true)}><p>See Visualize Subway Crowding Data</p></a>
       {graph&&
        GrpahContents()
       }
       
      </header>
    </div>
  );
}

export default App;
