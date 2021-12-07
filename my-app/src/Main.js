import React, {useState, useEffect, useRef} from 'react';
import { FormattedMessage } from "react-intl";
import * as d3 from 'd3';
import "./styles.css";


function Main()
{
    const[data, setData] = useState([]);
    const[cuarto, setCuarto] = useState([]);
    const[disp, setDisp] = useState([]);
    const[show, setShow] = useState(true);
    const[codigo, setId] = useState('');
    const pieChart = useRef();
    let contar = 1;

    useEffect(() => {       if(navigator.onLine){ 
      if(localStorage.getItem("lugar")==null){
        fetch('https://gist.githubusercontent.com/josejbocanegra/0067d2b28b009140fee423cfc84e40e6/raw/6e6b11160fbcacb56621b6422684d615dc3a0d33/spaces.json')
        .then(response => response.json())
        .then(res => {localStorage.setItem("lugar",JSON.stringify(res))
      setData(res)});
      }else{
        setData(JSON.parse(localStorage.getItem("lugar")))
      }
    }
    else{ setData(JSON.parse(localStorage.getItem("lugar")))

  } }, []);


  useEffect(() => {       if(navigator.onLine){ 
    if(localStorage.getItem("sitio")==null){
      fetch('https://gist.githubusercontent.com/josejbocanegra/92c90d5f2171739bd4a76d639f1271ea/raw/9effd124c825f7c2a7087d4a50fa4a91c5d34558/rooms.json')
      .then(response => response.json())
      .then(res => {localStorage.setItem("sitio",JSON.stringify(res))
    setCuarto(res)});
    }else{
      setCuarto(JSON.parse(localStorage.getItem("sitio")))
    }
  }
  else{ setCuarto(JSON.parse(localStorage.getItem("sitio")))

} }, []);

   

    function cambio(e,id){
      e.preventDefault();
      setShow(false)
      setId(id)
      
   
    }

    function dispositivos(e, dev)
    {
      e.preventDefault();
      setDisp(dev); 
      
    }

    useEffect(()=>
    {
      let cuartos = [];
      cuarto.map(e =>
        {
          if(e.homeId===codigo)
          {
            cuartos.push(e);
          }
        }
      )
        
      const piedata = d3.pie().value(d => d.powerUsage.value)(JSON.parse(JSON.stringify(cuartos)))
      
      console.log(piedata)
      const arc = d3.arc().innerRadius(0).outerRadius(200)
  
      const colors = d3.scaleOrdinal(['#ffa822','#134e6f','#ff6150','#1ac0c6','#dee0e6'])
  
     
      const svg = d3.select(pieChart.current)
              .attr('width', 600)
              .attr('height', 600)
              .append('g')
                .attr('transform','translate(300,300)')
  

      const tooldiv = d3.select('#chartArea')
                .append('div')
                .style('visibility','hidden')
                .style('position','absolute')
                .style('background-color','grey')
  
  

      svg.append('g')
        .selectAll('path')
        .data(piedata)
        .join('path')
          .attr('d', arc)
          .attr('fill',(d,i)=>colors(i))
          .attr('stroke', 'white')
          .on('mouseover', (e,d)=>{
            console.log(e)
            console.log(d)
  
            tooldiv.style('visibility','visible')
                .text(`${d.data.powerUsage.value}:` + `${d.data.name}`)
          })
          .on('mousemove', (e,d)=>{
            tooldiv.style('top', (e.pageY-50) + 'px')
                .style('left', (e.pageX-50) + 'px')
          })
          .on('mouseout',()=>{
            tooldiv.style('visibility','hidden')
          })
   

        })

    if(!show)
    {
      return(
        <div>
          <h1><FormattedMessage id="MyRooms"/></h1>
          <div id ="habitaciones" className="container">
              <div className="row">
                {
                  cuarto.map(item=>{

                    if(item.homeId===codigo)
                    return(
                  <div className="col">
                    <div class="card" onClick={(e)=>dispositivos(e,item.devices)}>
                    <img class="card-img-top" id="sitio" src={ item.name ==="Kitchen"? "https://www.pngall.com/wp-content/uploads/8/Kitchen-PNG-Image-File.png": "https://i.pinimg.com/originals/91/40/34/9140344bc7b371015f6214279e91df5e.jpg" } alt="icono"/> 
                    <div class ="card-body">
                      <h5 class="card-title">{item.name}</h5>
                      </div>
                    </div>

                  </div>
                    )
                  })
                }
                <div className ="col">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">ID</th>
                        <th scope="col"><FormattedMessage id="Device"/></th>
                        <th scope="col"><FormattedMessage id="Value"/></th>
                      </tr>
                    </thead>
                    <tbody>
                    {disp.map(item=>
                      <tr>
                        <th scope="row">{contar++}</th>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.desired.value}</td>
                      </tr>
                      
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div id='chartArea'>
                <h1><FormattedMessage id="Stats"/></h1>
                <svg ref={pieChart}></svg>
              </div>
          </div>
        </div>

      )
        
      
    }
    else{
    return(
      <div>
        <h1><FormattedMessage id="MySpaces"/></h1>
      <div id ="hogares" className="container">
      <div className="row">
        {
      data.map(item => 
          
          <div className="col-md-3"> 

          <div class="card" onClick={(e)=>cambio(e,item.id)}>
            <img class="card-img-top" id="sitio" src={ item.type ==="house"? "https://wrcitytimes.com/wp-content/uploads/2019/02/house.png": "https://www.pngitem.com/pimgs/m/125-1252166_skyscraper-png-image-download-building-png-transparent-png.png" } alt="icono"/>
              <div class ="card-body">
              <h5 class="card-title">{item.name}</h5>
              <p class="card-text">{item.address}</p>
              </div>
          </div>  
          </div>
                 
          )
          }
      </div>
      </div>
      </div>
    )
  }
}

export default Main;