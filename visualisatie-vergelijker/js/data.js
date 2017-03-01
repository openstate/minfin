var dataFile = "data/begrotingsstaten.csv";
var departmentsFile = "data/departments.json";
var nodes;
var filteredNodes;
var departments;
var historyNodes;
var historyConnections;
var maxBegroting;
var maxRealisatie;
// Min value of (begroting - realisatie)
var minVerschil;
// Max value of (begroting - realisatie)
var maxVerschil;
// Min value of (begroting - realisatie) / begroting
var minVerschilPerc;
// Max value of (begroting - realisatie) / begroting
var maxVerschilPerc;

function readData(callbackFunction) {
  nodes = [];
  filteredNodes = [];
  departments = [];
  historyNodes = [];
  historyConnections = [];
  maxBegroting = 0;
  maxRealisatie = 0;
  minVerschil = 0;
  maxVerschil = 0;
  minVerschilPerc = 0;
  maxVerschilPerc = 0;

  d3.csv(dataFile,
    function(d) {
      return {
        jaar: +d["Begrotingsjaar"],
        uo: d["Uitgaven (U) Verplichtingen (V) Ontvangsten (O)"],
        staat: d["Begrotingsstaat"] + ", " + d["Begrotingsstaat omschrijving"],
        onderdeel: d["Onderdeel"],
        omschrijving: d["Omschrijving"],
        begroting: +d["ontwerpbegroting"],
        realisatie: +d["Realisatie"]
      }
    },

    function(error, rows) {
      if (error) console.log("error reading data",error);
      // This is data over multiple years, group data for the same
      // 'staat' and 'onderdeel' together in one node
      nodes = [];
      for (var i=0; i<rows.length; i++) {
        var r = rows[i];
        var n;
        if (r.jaar >= firstYear && r.jaar <= lastYear && r.uo == currentUo) {
          // Check if node exists
          n = $.grep(nodes, function(o) {
            return o.staat == r.staat && o.onderdeel == r.onderdeel
          })[0];
          if (n == null) {
            n = {
              staat: r.staat,
              onderdeel: r.onderdeel,
              omschrijving: r.omschrijving,
              begrotingCurrentYear: "-",
              realisatieCurrentYear: "-",
              begroting: []
            }
            nodes.push(n);
          }

          if (r.begroting > maxBegroting) maxBegroting = r.begroting;
          if (r.realisatie > maxRealisatie) maxRealisatie = r.realisatie;

          var verschil = r.realisatie - r.begroting;
          // If begroting is zero, and verschil unequal to zero, make
          // percentage equal to -1 or 1
          var verschilPerc = r.begroting == 0 ? (
            verschil == 0 ? 0 : 100 * Math.abs(verschil)/verschil
          ) : 100 * verschil / r.begroting;

          n.begroting.push({
            jaar: +r.jaar,
            bedrag: r.begroting,
            realisatie: r.realisatie,
            verschil: verschil,
            verschilPerc: verschilPerc
          });

          if (r.jaar == currentYear) {
            n.begrotingCurrentYear = r.begroting;
            n.realisatieCurrentYear = r.realisatie;
            n.verschilCurrentYear = verschil;
            n.verschilPercCurrentYear = verschilPerc;
            if (verschil > maxVerschil) maxVerschil = verschil;
            if (verschil < minVerschil) minVerschil = verschil;
            if (verschilPerc > maxVerschilPerc) maxVerschilPerc = verschilPerc;
            if (verschilPerc < minVerschilPerc) minVerschilPerc = verschilPerc;
          }
        }
      }

      // Filter out nodes that have no begroting or realisatie the
      // currently selected year. Those belong to a staat/onderdeel
      // that is not used in this year.
      nodes = $.grep(nodes, function(o) {
        return o.begrotingCurrentYear != "-" && o.realisatieCurrentYear != "-"
      });
      console.log(nodes);
      callbackFunction();
    })
}

function readDepartments(callbackFunction) {
  d3.json(departmentsFile, function(error, json) {
    if (error) console.log("error reading departments",error);
    departments = json.sort(function(a, b) {
      var result = 0;
      if (a.label < b.label) result = -1;
      else result = 1;
      return result;
    });
    callbackFunction();
  })
}

// Adds to each node the department its 'begrotingshoofdstuk' belongs to
function assignDepartmentsToNodes() {
  // Cycle through each department. If a node's staat is in the
  // department's chapter list, assign the department to the node.
  for (var i=0; i<departments.length; i++) {
    for (var nIndex=0; nIndex<nodes.length; nIndex++) {
      // Check if node is in chapters
      if (departments[i].chapters.indexOf(nodes[nIndex].staat) != -1) {
        nodes[nIndex].color = departments[i].color;
        nodes[nIndex].department = departments[i].label;
      }
    }
  }
}

function sortNodes() {
  nodes.sort(function(a,b) {
    var result = 0;
    if (a.department < b.department) result = -1;
    else if (a.department > b.department) result = 1;
    else if (a.staat < b.staat) result = -1;
    else if (a.staat > b.staat) result = 1;
    return result;
  })
}
