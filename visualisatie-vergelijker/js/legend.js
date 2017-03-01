var selectedDepartments = [];

function initLegend() {
  // Start with all departments selected
  selectedDepartments = departments.map(function(o) { return o.label });

  d3.select("#legend").selectAll(".legendEntry")
    .data(departments)
    .enter()
    .append("div")
    .attr("class","legendEntry")
    .on("click", function(d) {
      var index = selectedDepartments.indexOf(d.label);
      if (index == -1) {
        selectedDepartments.push(d.label);
      } else {
        selectedDepartments.splice(index,1);
      }
      updateLegend();
      updatePlot();
    })
    .on("dblclick", function(d) {
      console.log("dblclick",d,selectedDepartments);
      if (selectedDepartments.length == 0
        || (selectedDepartments.length == 1
        && selectedDepartments[0] == d.label)) {
          // If doubleclick when nothing is selected, or if doubleclick
          // on only selected department, select all
          selectedDepartments = departments.map(function(o) {return o.label});
      } else selectedDepartments = [d.label];
      updateLegend();
      updatePlot();
    })
    .each(function() {
      d3.select(this)
        .append("div")
        .attr("class","legendColor");
      d3.select(this)
        .append("div")
        .attr("class","legendLabel")
        .text(function(d) { return d.label })
    });
    updateLegend();
}

// Adapt colors of legend entries
function updateLegend() {
  d3.selectAll(".legendEntry")
    .style("background-color", function(d) {
      return selectedDepartments.indexOf(d.label) == -1 ? "transparent" : "#fff";
    })
  d3.selectAll(".legendEntry .legendColor")
    .style("background-color", function(d) {
      return selectedDepartments.indexOf(d.label) == -1 ? "#dddddd" : d.color;
    })
}
