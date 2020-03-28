//margins and radius
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1000 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom,
    radius = width/2;

var color = d3.scaleOrdinal()
    .range(["#ccdaec","#fef1d3","#9ab5d9", "#fee3a8", "#6890c6", "#fdd57d", "#366bb3", "#fdc752", "#0447A0", "#FDB927"]);


//Define svg

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate (" + width/2 + "," + height/2 +")");

//import the data

d3.csv("data.csv").then(function(data) {
    data.forEach(function(d) {
        d.points = +d.points;
        d.team = d.team;
        d.pointsE = +d.pointsE;
        d.PDO = +d.PDO;
        d.GF = +d.GF;
        d.xGF = +d.xGF;
        d.SeasonResult = +d.SeasonResult;
    })

    let team1 = data[0].team;
    let team2 = data[1].team;
    let index = 0;
    for (let key in data[0]) {
        let temp = [{team: team1, [key]: data[0][key]}, {team: team2, [key]: data[1][key]}];
        if ((key != "team") && (key != "SeasonResult")) {
            pieCharts(temp, index, key)
            index++;
        }
        else if (key == "team") {
            svg.append("text")
                .attr("class", "team one")
                .attr("text-anchor", "end")
                .attr("x", width/2.3)
                .attr("y", height/1000000)
                .text(data[0][key]);
            svg.append("text")
                .attr("class", "team two")
                .attr("text-anchor", "end")
                .attr("x", width/-2.8)
                .attr("y", height/1000000)
                .text(data[1][key]);
            index++;
        }
        else{}
    }
})

//Function to draw the pie charts

var pieCharts = function(data, index, key) {
    //actually create the pie charts
    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d[key];
        })

    //Define the arcs, this will define the inner and outer radius of each donut/pie
    var arc =  d3.arc()
        .outerRadius(((index + 1) * 50) - 1)
        .innerRadius(index * 53)

    //Enter and append the pies
    var g = svg.selectAll(".arc" + index)
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc" + index);

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {return color(d.data[key]);})

    //need to find a better way to center the text along a horizontal line instead of this.
    g.append("text")
        .attr("transform", function(d) {return "translate(" + arc.centroid(d, index) + ")";})
        .attr("dy", ".35em").style("text-anchor", "middle")
        .text(function(d) {
            if (d.data[key] == 1) {
                return "Winner";
            }
            else if (d.data[key] != 0)
                return d.data[key];
            else
                return;
        });

    g.append("text")
        .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ") translate(0, 20)";})
        .attr("dy", ".35em").style("text-anchor", "middle")
        .text(function(d) {return key;});

    svg.append("text")
        .attr("class", "title")
        .attr("text-anchor", "end")
        .attr("x", width/14)
        .attr("y", height/-2.7)
        .text(function(d) {
            return "2019 Stanley Cup Finals";
        });

    var myimage = svg.append('image')
            .attr('xlink:href', 'https://i.ya-webdesign.com/images/stanley-cup-png-2.png')
            .attr('width', 90)
            .attr('height', 90)
            .attr("x", width/-22)
            .attr("y", height/-22);

    var myimage = svg.append('image')
        .attr('xlink:href', 'https://upload.wikimedia.org/wikipedia/de/thumb/4/49/Logo_St_Louis_Blues2.svg/1920px-Logo_St_Louis_Blues2.svg.png')
        .attr('width', 90)
        .attr('height', 90)
        .attr("x", width/-22)
        .attr("y", height/-25);

}

