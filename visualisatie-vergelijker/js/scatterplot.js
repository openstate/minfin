var MIN_RADIUS = 2;
var MAX_RADIUS = 20;
var DEFAULT_RADIUS = 4;

var selectedNodes;

// Initialize scales, axis append nodes, origin lines, equal line
function initPlot() {
  xScale = d3.scale.linear().range([0, width]);
  yScale = d3.scale.linear().range([height, 0]);
  rScale = d3.scale.sqrt().range([MIN_RADIUS,MAX_RADIUS]);

  xAxis = d3.svg.axis()
    .scale(xScale)
    .tickSize(-height)
    .tickFormat(myNumberFormat)
    .orient("bottom");

  yAxis = d3.svg.axis()
    .scale(yScale)
    .tickSize(-width)
    .tickFormat(myNumberFormat)
    .orient("left");

  svg.append("line")
      .attr("class","zeroLine hor");

  svg.append("text")
      .attr("class","equalLineLabel top")
      .text("overbesteding");

  svg.append("text")
      .attr("class","equalLineLabel bottom")
      .text("onderbesteding");
}

function drawAxes() {
  svg.selectAll(".axis").remove();
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .style("visibility", "hidden")
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Begroting (€1000)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(function() {
        switch(currentView) {
          case "verschilArtikel":
            return "Verschil (€1000)";
            break;
          case "verschilArtikelPerc":
            return "Verschil (% tov begroting)";
            break;
        }
      });
}

function addAndRemoveNodes() {
    svg.selectAll(".node")
    .data(selectedNodes, function(d) { return d.staat + "_" + d.omschrijving})
    .enter()
    .append("circle")
    .attr("class","node")
    .on("mouseover", function(d) {
      showTooltip(d, +d3.select(this).attr("cx"), +d3.select(this).attr("cy"));
    })
    .on("mouseout", function(d) {
      hideTooltip();
    })
    .on("click", function(d) {
      selectedNode = selectedNode == d ? null : d;
      updatePlot();
    });
  svg.selectAll(".node")
    .data(selectedNodes, function(d) { return d.staat + "_" + d.omschrijving})
    .exit()
    .remove();

  // Node labels
  svg.selectAll(".nodeLabel")
    .data(selectedNodes, function(d) { return d.staat + "_" + d.omschrijving})
    .enter()
    .append("text")
    .attr("class","nodeLabel")
    .text(function(d) { return d.omschrijving});

  svg.selectAll(".nodeLabel")
    .data(selectedNodes, function(d) { return d.staat + "_" + d.omschrijving})
    .exit()
    .remove();


  // Add and remove history nodes
  svg.selectAll(".historyLine")
    .data(historyConnections)
    .enter()
    .append("line")
    .attr("class","historyLine");

  svg.selectAll(".historyLine")
    .data(historyConnections)
    .exit().remove();

  svg.selectAll(".historyNode")
    .data(historyNodes, function(d) {
      return d.departement + "_" + d.omschrijving + "_" + d.jaar
    })
    .enter()
    .append("g")
    .attr("class", "historyNode")
    .each(function(d) {
      d3.select(this)
        .append("circle")
        .style("fill", function(d) { return d.color })
        .attr("r", 8)
      d3.select(this)
        .append("text")
        .attr("class","historyNodeLabel")
        .attr("x",10)
        .attr("y",0)
        .text(function(d) { return d.jaar });
    })
    .on("mouseover", function(d) {
      var x = d3.transform(d3.select(this).attr("transform")).translate[0];
      var y = d3.transform(d3.select(this).attr("transform")).translate[1];
      showTooltip(d.originalNode, x,y);
    })
    .on("mouseout", function(d) {
      hideTooltip();
    });


  svg.selectAll(".historyNode")
    .data(historyNodes, function(d) {
      return d.departement + "_" + d.omschrijving + "_" + d.jaar
    })
    .exit().remove();

}

// Called when user clicks on a node, or switches views
function updatePlot() {
  selectedNodes = $.grep(nodes, function(o) {
    return selectedDepartments.indexOf(o.department) != -1
  })
  xScale.domain([0,selectedNodes.length]);
  updateHistoryNodes(); // Add or remove history nodes
  addAndRemoveNodes();
  updatePositions(); // Move nodes and lines to the correct position

  // Update color and radius
  svg.selectAll(".node")
    .style("fill", function(d) {
      return selectedNode == null ? d.color : "#dddddd";
    })
    .style("opacity",0.7)
    .attr("r", function(d) {
      return radiusIsBegroting ? rScale(d.begrotingCurrentYear) : DEFAULT_RADIUS;
    });

  // Show or hide labels
  svg.selectAll(".nodeLabel")
    .style("display", function() {
      return showingLabels ? "inline" : "none";
    })
}

function updatePositions(animated = false) {
  // Nodes
  svg.selectAll(".node")
    .attr("cx", function(d,i) {
      switch(currentView) {
        case "verschilArtikel":
        case "verschilArtikelPerc":
          return xScale(i); // Nodes are sorted
          break;
      }
    })
    .attr("cy", function(d) {
      switch(currentView) {
        case "verschilArtikel":
          return yScale(d.verschilCurrentYear);
          break;
        case "verschilArtikelPerc":
          return yScale(d.verschilPercCurrentYear);
          break;
      }
    })

  // Node labels
  svg.selectAll(".nodeLabel")
    .attr("x", function(d,i) {
      var x;
      switch(currentView) {
        case "verschilArtikel":
        case "verschilArtikelPerc":
          x = xScale(i); // Nodes are sorted
          break;
      }
      return x + 10;
    })
    .attr("y", function(d) {
      var y;
      switch(currentView) {
        case "verschilArtikel":
          y = yScale(d.verschilCurrentYear);
          break;
        case "verschilArtikelPerc":
          y = yScale(d.verschilPercCurrentYear);
          break;
      }
      return y+5;
    })
    
  // History nodes
  svg.selectAll(".historyNode")
    .attr("transform", function(d) {
      var cx, cy;
      switch(currentView) {
        case "verschilArtikel":
          cx = xScale(selectedNodes.indexOf(d.originalNode));
          cy = yScale(d.verschil);
          break;
        case "verschilArtikelPerc":
          cx = xScale(selectedNodes.indexOf(d.originalNode));
          cy = yScale(d.verschilPerc);
          break;
        }
      return "translate(" + cx + "," + cy + ")";
    });

  svg.select(".zeroLine.hor")
    .attr({
        "x1":xScale(0),
        "y1":yScale(0),
        "x2":xScale(nodes.length),
        "y2":yScale(0)
    })

  // Update history lines
    svg.selectAll(".historyLine")
      .attr("x1", function(d) {
        return xScale(d.fromNode.begroting);
      })
      .attr("y1", function(d) {
        return yScale(d.fromNode.realisatie);
      })
      .attr("x2", function(d) {
        return xScale(d.toNode.begroting);
      })
      .attr("y2", function(d) {
        return yScale(d.toNode.realisatie);
      });

  svg.select(".equalLineLabel.top")
    .attr("transform", function() {
      var x,y;
      x = width - 100;
      y = yScale(0) - 10;
      return "translate(" + x + "," + y + ")";
    });
  svg.select(".equalLineLabel.bottom")
    .attr("transform", function() {
      var x,y;
      x = width - 100;
      y = yScale(0) + 18;
      return "translate(" + x + "," + y + ")";
    });
}

// Adds extra nodes when a node is selected
function updateHistoryNodes() {
  historyNodes.length = 0;
  historyConnections.length = 0;
  if (selectedNode != null) {
    for (var i=0; i<selectedNode.begroting.length; i++) {
      historyNodes.push({
        color: selectedNode.color,
        departement: selectedNode.department,
        omschrijving: selectedNode.omschrijving,
        jaar: selectedNode.begroting[i].jaar,
        realisatie: selectedNode.begroting[i].realisatie,
        begroting: selectedNode.begroting[i].bedrag,
        verschil: selectedNode.begroting[i].verschil,
        verschilPerc: selectedNode.begroting[i].verschilPerc,
        originalNode: selectedNode
      })
      if (i > 0) {
        historyConnections.push({
          fromNode: historyNodes[i-1],
          toNode: historyNodes[i],
        })
      }
    }
  }
}
