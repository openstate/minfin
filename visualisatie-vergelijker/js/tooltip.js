var percFormat = d3.format("+.2p");

function showTooltip(node, elementXPos, elementYPos) {
  // Fill tooltip with new data
  tooltip.select("#tooltip-department")
    .text(node.staat);
  tooltip.select("#tooltip-omschrijving")
    .text(node.omschrijving);
  // Clear table
  tooltip.select("#tooltip-budget").selectAll("tr").remove();
  tooltip.select("#tooltip-budget")
    .append("tr")
    .each(function() {
      d3.select(this).append("th").text("jaar");
      d3.select(this).append("th").text("begroting");
      d3.select(this).append("th").text("realisatie");
      d3.select(this).append("th").text("verschil");
      d3.select(this).append("th").text("verschil");
    })
  tooltip.select("#tooltip-budget")
    .append("tr")
    .each(function() {
      d3.select(this).append("th").text("");
      d3.select(this).append("th").text("(€1000)");
      d3.select(this).append("th").text("(€1000)");
      d3.select(this).append("th").text("(€1000)");
      d3.select(this).append("th").text("(%)");
    })

  tooltip.select("#tooltip-budget").selectAll(".tableEntry")
    .data(node.begroting)
    .enter()
    .append("tr")
    .attr("class","tableEntry")
    .each(function(d) {
      d3.select(this)
        .append("td")
        .text(d.jaar);
      d3.select(this)
        .append("td")
        .text(myNumberFormat(d.bedrag ));
      d3.select(this)
        .append("td")
        .text(myNumberFormat(d.realisatie ));
      d3.select(this)
        .append("td")
        .text(myNumberFormat(d.verschil));
      d3.select(this)
        .append("td")
        .text(myPercFormat(d.verschilPerc));
    })
    /*
    .text(function(d) {
      return "€ " + (d.bedrag * 1000) + " " + (d.deltaperc == "-" ? "" : percFormat(d.deltaperc));
    })
    */

  // Show tooltip
  tooltip
    .style("display","inline")
    .style("left", (elementXPos < width/2) ? (elementXPos + 100) + "px"
                    : (elementXPos - 300) + "px")
    /*
    .style("top", (node.y-node.radius) < 100
      ? (node.y + node.radius + 10) + "px"
      : (node.y - node.radius - 120 - 10) + "px");*/
    .style("top", (elementYPos + margin.top - 50) + "px");

}

function hideTooltip() {
  tooltip.style("display","none");
}
