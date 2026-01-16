const r = 1.0;
const k = 50;
const theta = 8;
const a = 0.02;
const alpha = 0.5;
const m = 0.4;

function simulate(fear) {
  let dt = 0.01;
  let T = 100;

  let u = 10;
  let v = 5;

  let time = [];
  let prey = [];
  let predator = [];

  for (let t = 0; t <= T; t += dt) {

    let du = r*u*(1-u/k)*(u/theta-1)*(1/(1+fear*v)) - a*u*v;
    let dv = alpha*a*u*v - m*v;

    u += du*dt;
    v += dv*dt;

    if (u < 0) u = 0;
    if (v < 0) v = 0;

    time.push(t);
    prey.push(u);
    predator.push(v);
  }

  plotTimeSeries(time, prey, predator);
  plotPhase(prey, predator);
}

function plotTimeSeries(time, prey, predator) {
  Plotly.newPlot("timeseries", [
    {x: time, y: prey, mode: "lines", name: "Prey", line:{color:"green"}},
    {x: time, y: predator, mode: "lines", name: "Predator", line:{color:"orange"}}
  ], {
    title: "Time Series Dynamics",
    xaxis:{title:"Time"},
    yaxis:{title:"Population Density"}
  });
}

function plotPhase(prey, predator) {
  Plotly.newPlot("phase", [
    {x: prey, y: predator, mode: "lines", name: "Trajectory"},
    {x: [0, Math.max(...prey)], y: [0,0], mode:"lines",
     name:"Predator Extinction", line:{color:"red", dash:"dash"}}
  ], {
    title: "Phase Portrait",
    xaxis:{title:"Prey"},
    yaxis:{title:"Predator"},
    shapes:[{
      type:"rect", x0:0, x1:Math.max(...prey), y0:0, y1:0.2,
      fillcolor:"rgba(255,0,0,0.12)", line:{width:0}
    }]
  });
}

function plotFearCurve() {
  let mvals=[], predEq=[];

  for(let f=0; f<=2; f+=0.05){
    let u=20, v=10;
    for(let i=0;i<3000;i++){
      let du = r*u*(1-u/k)*(u/theta-1)*(1/(1+f*v)) - a*u*v;
      let dv = alpha*a*u*v - m*v;
      u+=du*0.01; v+=dv*0.01;
      if(v<0) v=0;
    }
    mvals.push(f); predEq.push(v);
  }

  Plotly.newPlot("fearcurve", [{
    x:mvals, y:predEq, mode:"lines+markers",
    name:"Predator density", line:{color:"blue"}
  }], {
    title:"Effect of Fear on Predator Density",
    xaxis:{title:"Fear parameter (f)"},
    yaxis:{title:"Predator Density"}
  });
}

let slider = document.getElementById("fear");
let label = document.getElementById("fval");

slider.oninput = function(){
  label.innerText = this.value;
  simulate(parseFloat(this.value));
};

simulate(0.2);
plotFearCurve();
