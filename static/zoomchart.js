function doMyPlot(dataSet) {

  svg = document.getElementById("containerSvg");

  var ticks = [0,1,3,6,8,34];

  var svg = d3.select("svg"),
      margin = 20,
      diameter = svg.attr("width"),
      g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


  var x = d3.scaleLinear()
      .range([0, 850])
      .clamp(true)
      .nice();

  var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + 20 + "," + 960 / 1.05 + ")");

  slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { hue(x.invert(d3.event.x)); }));

  slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(5))
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d,i) { return ticks[i] + 'd'; });

  var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

  slider.transition() // Gratuitous intro!
        .duration(750)
        .tween("hue", function() {
        var i = d3.interpolate(70, 0);
          return function(t) {hue(i(t)); };
        });

  var color = d3.scaleLinear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

  var pack = d3.pack()
      .size([diameter - margin, diameter - margin])
      .padding(2);

  // d3.json("example.json", function(error, root) {
  //   if (error) throw error;

    root = d3.hierarchy(dataSet)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    var focus = root,
        nodes = pack(root).descendants(),
        view;

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
        .text(function(d) { return d.data.name; });

    var node = g.selectAll("circle,text");

    svg
        .style("background", color(-1))
        .on("click", function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
          });

      transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    function zoomTo(v) {
      var k = diameter / v[2]; view = v;
      node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function(d) { return d.r * k; });
    }

    function hue(h) {
      let h_new;
      if (h < 0.10) {
        h_new = 0;
      } else if (0.10 < h && h < 0.30) {
        h_new = 0.20
      } else if (0.30 < h && h < 0.50) {
        h_new = 0.40
      } else if (0.50 < h && h < 0.70) {
        h_new = 0.60
      } else if (0.70 < h && h < 0.90) {
        h_new = 0.80
      } else if (h > 0.90) {
        h_new = 1
      }
      handle.attr("cx", x(h_new));
    }
}
