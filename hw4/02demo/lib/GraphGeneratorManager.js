/*
* @Author: Dawn
* @Date:   2017-04-12 16:44:07
* @Last Modified by:   Dawn
* @Last Modified time: 2017-05-04 23:57:42
*/
'use strict';

function GraphGeneratorManager()
{
    var nodes = undefined;
    var links = undefined;
    var node_d3 = undefined;
    var link_d3 = undefined;
    var force = undefined;
    var canvasName = undefined;
    var svgWidth;
    var svgHeihgt;
    var gSvg;
    var gCursor;
    var gInsideCursor;
    var gThis;
    var original_node_data;
    var max_community_number;

    this.init = function(canName){

        svgWidth = 720;
        svgHeihgt = 720;

        gThis = this;

        canvasName = canName;

        var fill = d3.scale.category20();
  
        gSvg = d3.select("#" + canName).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeihgt)
            .on("mousemove", mousemove)
            .on("mousedown", mousedown);

        gSvg.append("rect")
            .attr("width", svgWidth)
            .attr("height", svgHeihgt);

        node_d3 = gSvg.selectAll(".node");
        link_d3 = gSvg.selectAll(".link");

        gCursor = gSvg.append("circle")
            .attr("r", CommonDefine.editRangeSize)
            // .style("fill", "#66b2ff")
            // .style("stroke", "none")
            // .attr("opacity", 0.8)
            .attr("transform", "translate(-100,-100)")
            .attr("class", "cursor");

        gInsideCursor = gSvg.append("circle")
            .attr("r", CommonDefine.editInsideRangeSize)
            .attr("opacity", 0.5)
            .attr("transform", "translate(-100,-100)")
            .attr("class", "cursor");

        //var input_data = eval( "(" + data + ")" );
        doLoadAll(undefined);

        function mousemove() {
            gCursor.attr("transform", "translate(" + d3.mouse(this) + ")");
            gInsideCursor.attr("transform", "translate(" + d3.mouse(this) + ")");
        }

        function mousedown() {
          var point = d3.mouse(this);
          var node = {x: point[0], y: point[1], index: nodes.length};
          
          if ( CommonDefine.addEditMode ) {
              if ( !CommonDefine.addEditSelLink ) {
                var n = nodes.push(node);

                // add links to any nearby nodes
                nodes.forEach(function(target) {
                    var x = target.x - node.x,
                        y = target.y - node.y;
                    if ( Math.sqrt(x * x + y * y) < CommonDefine.editRangeSize &&
                         Math.sqrt(x * x + y * y) > CommonDefine.editInsideRangeSize &&
                         node.index != target.index) {
                        if ( CommonDefine.addEditLinkMode ) {
                            links.push({source: node, target: target});
                            console.log( "link added." );
                        };
                    }
                });
              }else{
                nodes.forEach(function(target) {
                    var x = target.x - node.x,
                        y = target.y - node.y;
                    if (Math.sqrt(x * x + y * y) < CommonDefine.nodeSize) {
                        if ( CommonDefine.selectedNodeId == -1 ) {
                          gThis.highlightSelectedNode(target.index);
                        }else if(gThis.highlightSelectedNode == target.index){
                          gThis.clearEditSelection();
                        }
                        else{
                          var linkedBefore = false;
                          for (var j = 0; j < links.length; j++) {
                              if( (links[j].source.index == CommonDefine.selectedNodeId && links[j].target.index == target.index) || (links[j].source.index == target.index && links[j].target.index == CommonDefine.selectedNodeId) )
                              {
                                linkedBefore = true;
                              }
                          };
                          if ( !linkedBefore ) {
                            if ( CommonDefine.addEditLinkMode ) {
                                links.push({source: nodes[CommonDefine.selectedNodeId], target: target});
                                console.log( "link added." );
                            }
                          };
                          gThis.clearEditSelection();
                        }
                    }
                });
              }
          }

          doInsert();
        }
    }

    function tick() {
      node_d3.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      link_d3.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    }

    function doInsert() {
        link_d3 = link_d3.data(links);
        link_d3.enter().insert("line", ".node")
            .attr("class", "link");

        node_d3 = node_d3.data(nodes);
        node_d3.enter().insert("circle", ".cursor")
            .attr("class", "node")
            .attr("r", CommonDefine.nodeSize)
            .call(force.drag);

        //node_d3.exit().remove();
        //link_d3.exit().remove();

        force.start();
    }

    function doLoadGraphSeq(input_data) {
        if ( input_data != undefined ) {

            var mynodes = [];
            var mylinks = [];
            force.nodes(mynodes);
            force.links(mylinks);
            force.stop();

            node_d3 = gSvg.selectAll(".node");
            link_d3 = gSvg.selectAll(".link");

            link_d3 = link_d3.data(input_data.links);
            link_d3.enter().append("line", ".node")
                .attr("class", "link")
                .attr("stroke-opacity", function(d) { return 1.0; })
                .attr("x1", function(d){
                    return input_data.nodes[d.source].x;
                })
                .attr("y1", function(d){return input_data.nodes[d.source].y;})
                .attr("x2", function(d){return input_data.nodes[d.target].x;})
                .attr("y2", function(d){return input_data.nodes[d.target].y;});

            node_d3 = node_d3.data(input_data.nodes);
            node_d3.enter().append("circle", ".cursor")
                .attr("class", "node")
                .attr("cx", function(d){return d.x;})
                .attr("cy", function(d){return d.y;})
                //.attr("px", function(d){return d.px;})
                //.attr("py", function(d){return d.py;})
                .attr("r", CommonDefine.nodeSize);
        }
    }

    function doLoadAll(input_data) {

        if ( input_data != undefined ) {
          var newnodes = new Array(input_data.nodes.length);
          var newlinks = new Array(input_data.links.length);
          for (var i = 0; i < newnodes.length; i++) {
              newnodes[i] = {x: input_data.nodes[i].x, y: input_data.nodes[i].y, index: input_data.nodes[i].index};
          };

          for (var i = 0; i < newlinks.length; i++) {
              newlinks[i] = {source: newnodes[input_data.links[i].source], target: newnodes[input_data.links[i].target], weight: input_data.links[i].weight};
          };

          force.nodes(newnodes) // initialize with a single node
              .links(newlinks);

        }else{
          force = d3.layout.force()
              .size([svgWidth, svgHeihgt])
              .nodes([{}]) // initialize with a single node
              .linkDistance(30)
              .charge(-60)
              .on("tick", tick);
        };

        nodes = force.nodes();
        links = force.links();

        node_d3 = gSvg.selectAll(".node");
        link_d3 = gSvg.selectAll(".link");

        link_d3 = link_d3.data(links);
        link_d3.enter().append("line", ".node")
            .attr("class", "link");

        node_d3 = node_d3.data(nodes);
        node_d3.enter().append("circle", ".cursor")
            .attr("class", "node")
            .attr("r", CommonDefine.nodeSize)
            .call(force.drag);

        force.start();
    }

    this.doConnumityDetection = function(){

        var node_data = new Array( nodes.length );
        var edge_data = new Array( links.length );
        for (var i = 0; i < node_data.length; i++) {
            node_data[i] = nodes[i].index;
        };

        for (var i = 0; i < edge_data.length; i++) {
            edge_data[i] = {  
                source: links[i].source.index, 
                target: links[i].target.index, 
                weight: 0.3
            };
        };

        var community = jLouvain().nodes(node_data).edges( edge_data );
        original_node_data = d3.entries(node_data);

        console.log( original_node_data );

        var community_assignment_result = community();
        var node_ids = Object.keys(community_assignment_result);
        
        console.log('Resulting Community Data', community_assignment_result);
        max_community_number = 0;
        node_ids.forEach(function(d){
            original_node_data[d].community = community_assignment_result[d];
            max_community_number = max_community_number < community_assignment_result[d] ? community_assignment_result[d]: max_community_number;
        });

        console.log(max_community_number)

        var color = d3.scale.category20().domain(d3.range([0, max_community_number]));

        d3.selectAll('.node')
            .data(nodes)
            .style('fill', function(d, i){
                //console.log(color(d.community));
                var commId = original_node_data[i].community;
                return color( commId );
            });
    }

    this.saveSuperGraph = function(){
        var newLinks = new Array( links.length );
        for (var i = 0; i < newLinks.length; i++) {
            newLinks[i] = {source: links[i].source.index, target: links[i].target.index, weight: links[i].weight};
        };
        var graphData = {nodes: nodes, links: newLinks };
        var str = JSON.stringify(graphData);
        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        saveAs(blob, $("#option_loaddataname").val());
    }

    this.saveTimeVaryingGraph = function(){
        if ( (max_community_number-1) > 0 ) {
            // Gen special subgraph
            var seq_num = parseInt( $("#option_seqnum").val() );
            var subGraphData = CommonFuncUtility.GenSubGraph( nodes, links, original_node_data, max_community_number+1, seq_num );
        }else{
            alert( "Community detection is missing." );
        };
    }

    this.loadSuperGraphWithId = function(id){

        d3.select("#" + canvasName).selectAll(".node").remove();
        d3.select("#" + canvasName).selectAll(".link").remove();

        d3.text("data/sub_graph_" + id.toString() + ".json" , function(data) {
            var input_data = eval( "(" + data + ")" );
            doLoadAll( input_data );
        });
    }

    this.loadSuperGraph = function(){

        d3.select("#" + canvasName).selectAll(".node").remove();
        d3.select("#" + canvasName).selectAll(".link").remove();

        d3.text("data/" + $("#option_loaddataname").val(), function(data) {
            var input_data = eval( "(" + data + ")" );
            doLoadAll( input_data );
        });
    }

    this.loadSuperGraphFixedWithId = function(id){
        d3.select("#" + canvasName).selectAll(".node").remove();
        d3.select("#" + canvasName).selectAll(".link").remove();

        d3.text("data/sub_graph_" + id.toString() + ".json" , function(data) {
            var input_data = eval( "(" + data + ")" );
            doLoadGraphSeq( input_data );
        });
    }

    this.loadSuperGraphFixed = function(){
        d3.select("#" + canvasName).selectAll(".node").remove();
        d3.select("#" + canvasName).selectAll(".link").remove();

        d3.text("data/" + $("#option_loaddataname").val(), function(data) {
            var input_data = eval( "(" + data + ")" );
            doLoadGraphSeq( input_data );
        });
    }

    this.changeRangeSize = function(){
        gCursor.attr("r", CommonDefine.editRangeSize);
    }

    this.changeInsideRangeSize = function(){
        gInsideCursor.attr("r", CommonDefine.editInsideRangeSize);
    }

    this.highlightSelectedNode = function(id){
        CommonDefine.selectedNodeId = id;
        node_d3.attr("r", function(d, i){
            if ( i == CommonDefine.selectedNodeId ) {
                return CommonDefine.nodeSize*1.4;
            }else{
                return CommonDefine.nodeSize;
            };
        });
    }

    this.clearEditSelection = function(){
        CommonDefine.selectedNodeId = -1;
        node_d3.attr("r", function(){
            return CommonDefine.nodeSize;
        });
    }

    this.deleteSelectedNode = function(){
        if ( CommonDefine.selectedNodeId != -1 ) {

            var newNodes = new Array( nodes.length - 1 );
            var newLinks = [];

            for (var i = 0; i < CommonDefine.selectedNodeId; i++) {
                newNodes[i] = {x: nodes[i].x, y: nodes[i].y, index: i};
            };

            for (var i = CommonDefine.selectedNodeId; i < newNodes.length; i++) {
                newNodes[i] = {x: nodes[i+1].x, y: nodes[i+1].y, index: i};
            };

            for (var i = 0; i < links.length; i++) {

                if ( links[i].source.index != CommonDefine.selectedNodeId && 
                     links[i].target.index != CommonDefine.selectedNodeId ) {
                    var srcIndex = links[i].source.index;
                    var tarIndex = links[i].target.index;
                    if ( srcIndex >= CommonDefine.selectedNodeId ) {
                        srcIndex = srcIndex - 1;
                    };
                    if ( tarIndex >= CommonDefine.selectedNodeId ) {
                        tarIndex = srcIndex - 1;
                    };
                    newLinks.push( {source: srcIndex, target: tarIndex, weight: 0.3} );
                };
            };

            d3.select("#" + canvasName).selectAll(".node").remove();
            d3.select("#" + canvasName).selectAll(".link").remove();
            doLoadAll( {nodes:newNodes, links:newLinks} );
            CommonDefine.selectedNodeId = -1;
        };
    }
}