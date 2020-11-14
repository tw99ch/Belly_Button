function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray2 = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result2 = resultArray2[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuIds = result2.otu_ids
    var sampleOtuLabels = result2.otu_labels
    var sampleValues = result2.sample_values;
    
    var sampleResult = [];
    sampleResult['key'] = result2.otu_ids
    sampleResult['value'] = result2.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    var sortValue = sampleOtuIds.sort((a,b) => a.sampleValues - b.sampleValues); 
    
    // console.log(sortValue);
    var yticks = sampleOtuIds.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();;
    var topTen = sampleResult.value.sort((a,b) => a.sampleValues - b.sampleValues); 
    var topTens = topTen.slice(0,10)
    var topTens = topTens.sort((a,b) => a.topTens - b.topTens).reverse();
      
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: topTens,
      y: yticks,
      type: "bar", 
      orientation: 'h',
      mode: 'markers',
      marker: {
        color: sampleOtuIds
      }
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    yaxis: { title: "OTU ID"},
    'plot_bgcolor': 'rgba(0, 0, 0, 0)',
'paper_bgcolor': 'rgba(0, 0, 0, 0)',
  };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", [barData], barLayout);
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: sampleOtuIds,
      y: sampleValues,
      text: sampleOtuLabels,
      mode: 'markers',
      marker: {
        color: sampleOtuIds,
        size: sampleValues
        
      }
   
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1000,
      'plot_bgcolor': 'rgba(0, 0, 0, 0)',
'paper_bgcolor': 'rgba(0, 0, 0, 0)',
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray3 = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var result3 = resultArray3[0];
    // 3. Create a variable that holds the washing frequency.
    var WashFREQ = result3.wfreq
    
    console.log(result3)
    console.log(WashFREQ)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 10] },
        value: WashFREQ,
        title: { text: "Belly Button Washing Frequency\nScrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        
          gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "darkred" },
            { range: [2, 4], color: "darkorange" },
            { range: [4, 6], color: "gold" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "lightsteelblue" }
          ],
          threshold: {
            thickness: 0.75,
            value: 490
            
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 },
    'plot_bgcolor': 'rgba(0, 0, 0, 0)',
            'paper_bgcolor': 'rgba(0, 0, 0, 0)',
  };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
