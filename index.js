// select the svg container first
const svg = d3.select('.canvas')
    .append('svg')
        .attr('width', 800)
        .attr('height', 800);

// create margins and dimensions
const margin = {top: 20, right:20, bottom:100, left:100};
const graphWidth = 600 - margin.right - margin.left;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g');

// scales
const y = d3.scaleLinear()
    .range([graphHeight, 0]);

const x = d3.scaleBand()
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.5);

// create and call the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(12)
    .tickFormat(d => d + ' orders');

// update x axis text 
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'blue')

const transition = d3.transition().duration(2000) // reusable

// update function
const update = (data) => {

    // update the scale domains 
    y.domain([0,d3.max(data, d => d.orders)]); // actual data
    x.domain(data.map(item => item.name));

    // join the data to rects
    const rects = graph.selectAll('rect')
        .data(data);

    // remove exit selection
    rects.exit().remove();

    // update the current shape in the DOM
    rects.attr('width', x.bandwidth)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
            // .transition(transition)
            // .attr('y', d => y(d.orders))
            // .attr('height', d => graphHeight - y(d.orders));

    rects.enter()
        .append('rect')
            //.attr('width', 0) //x.bandwidth
            .attr('height', 0)
            .attr('fill', 'orange')
            .attr('x', d => x(d.name))
            .attr('y', graphHeight)
            .merge(rects) // merge together
            .transition(transition)
                .attrTween('width', widthTween)
                .attr('y', d => y(d.orders))
                .attr('height', d => graphHeight - y(d.orders));
    
            
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
}

var data = [];

// type = 'added', 'removed', 'modified'
db.collection('dishes').onSnapshot(res => {

    res.docChanges().forEach(change => {
        
        const doc = {...change.doc.data(), id: change.doc.id}
        switch (change.type){
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    })

    update(data);
})

const widthTween = (d) => {

    let i = d3.interpolate(0, x.bandwidth());

    return function(t){

        return i(t);
    }
}



// // 06
// // d3.json('menu.json').then(data =>{
// db.collection('dishes').get().then(res =>{

//     var data = [];
//     res.docs.forEach(doc => {
//         data.push(doc.data())
//     });

//     update(data);

//     d3.interval(() => {

//         // data.pop()
//         // data[0].orders += 50;
//         // update(data);
//     }, 2000)
// })

// // 03
// const data = [
//     {width: 300, height: 200, fill: 'purple'},
//     {width: 100, height: 60, fill: 'pink'},
//     {width: 50, height: 30, fill: 'red'}
// ];

// const svg = d3.select('svg');

// const rect = svg.selectAll('rect')// enter the data
//     .data(data)
    
// rect.attr('width', d => d.width)// add attrs to rects already in the DOM
//     .attr('height', (d, i, n) => d.height)
//     .attr('fill', (d, i, n) => d.fill );

// rect.enter()// virtual elements
//     .append('rect')
//     .attr('width', d => d.width)
//     .attr('height', (d, i, n) => d.height)
//     .attr('fill', (d, i, n) => d.fill );

// // 03
// const rect = svg.select('rect')
//     .data(data)

//     .attr('width', (d, i, n) => { 
//         console.log(n[i])
//         return d.width })

//     .attr('height', function(d, i, n) { 
//         console.log(this)
//         return d.height })

//     .attr('fill', (d, i, n) => d.fill )

// // 02
// const canvas = d3.select('.canvas');

// const svg = canvas.append('svg')
//     .attr('height', 1200)
//     .attr('width', 1200);

// const group = svg.append('g')
//     .attr('transform', 'translate(50, -100)')

// //  append shapes to svg container
// group.append('rect')
//     .attr('height', 300)
//     .attr('width', 200)
//     .attr('fill', 'blue')
//     .attr('x', 200)
//     .attr('y', 200);

// group.append('circle')
//     .attr('cx', 600)
//     .attr('cy', 400)
//     .attr('r', 50)
//     .attr('fill', 'pink')
//     .attr('stroke', 'black')
//     .attr('stroke-width', 3);

// group.append('line')
//     .attr('x1', 120)
//     .attr('y1', 400)
//     .attr('x2', 50)
//     .attr('y2', 400)
//     .attr('stroke', 'purple')
//     .attr('stroke-width', 3);

// svg.append('text')
//     .attr('x', 600)
//     .attr('y', 600)
//     .attr('fill', 'grey')
//     .text('Hello, world')
//     .style('font-size', 50)
//     .style('font-family', 'arial');

// // 02
// const a = document.querySelector('div');
// const b = d3.select('div');
// const a = document.querySelectorAll('div');
// const b = d3.selectAll('div');
// console.log(a, b);
