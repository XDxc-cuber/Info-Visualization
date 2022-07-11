/*
* @Author: Dawn
* @Date:   2017-04-19 10:44:02
* @Last Modified by:   Dawn
* @Last Modified time: 2017-04-20 11:27:14
*/

'use strict';

function CommonFuncUtl(){

    this.CheckSubGraphType = function( nodes, links, info ){

        return 1;
    }

    this.GenSubGraph = function( nodes, links, nodes_com, max_com, seq_num ){

        // Gen sub full graph
        var comset_nodes = new Array( max_com );
        var comset_links = new Array( max_com );
        var comset_cominfo = new Array( max_com );

        for (var i = 0; i < max_com; i++) {
            comset_nodes[i] = [];
            comset_links[i] = [];
            comset_cominfo[i] = {
                maxdeg_id: 0,
                maxdeg: 0,
                type:0
            };
        };

        // full sub nodes
        for (var i = 0; i < nodes_com.length; i++) {
            var curNodeCnt = comset_nodes[nodes_com[i].community].length;
            comset_nodes[nodes_com[i].community].push( {
                "sg_index": nodes[i].index,
                "index": curNodeCnt,
                "weight":1,
                "x": nodes[i].x,
                "y": nodes[i].y,
                "degree": 0
            } );
        };

        // full sub links
        for (var i = 0; i < links.length; i++) {
            var sg_src = links[i].source.index;
            var sg_tar = links[i].target.index;
            if( nodes_com[sg_src].community == nodes_com[sg_tar].community){

                var src = 0;
                var tar = 0;
                var com_id = nodes_com[sg_src].community;

                for (var j = 0; j < comset_nodes[com_id].length; j++) {
                    if ( comset_nodes[com_id][j].sg_index == sg_src ) {
                        src = j;
                    };
                    if ( comset_nodes[com_id][j].sg_index == sg_tar ) {
                        tar = j;
                    };
                };

                comset_links[com_id].push( {
                    sg_source: sg_src,
                    sg_target: sg_tar,
                    source: src,
                    target: tar,
                    weight: 0.3
                } );
            }
        };

        console.log( comset_links );

        // Cal sub nodes degree and max node
        for (var i = 0; i < max_com; i++) {
            var max_deg = 0;
            var max_deg_id = -1;
            for (var j = 0; j < comset_links[i].length; j++) {
                var src = comset_links[i][j].source;
                var tar = comset_links[i][j].target;

                comset_nodes[i][src].degree++;
                comset_nodes[i][tar].degree++;

                if ( comset_nodes[i][src].degree > max_deg ) {
                    max_deg = comset_nodes[i][src].degree;
                    max_deg_id = src;
                };

                if ( comset_nodes[i][tar].degree > max_deg ) {
                    max_deg = comset_nodes[i][tar].degree;
                    max_deg_id = tar;
                };
            };

            comset_cominfo[i].maxdeg = max_deg;
            comset_cominfo[i].maxdeg_id = max_deg_id;
        };

        console.log( comset_cominfo );

        for (var k = 0; k < seq_num; k++) {

            var selectedComMap = {};
            for (var i = 0; i < max_com; i++) {
                var randomVal = parseInt( Math.random() * max_com );
                if ( randomVal != 1 ) {
                    selectedComMap[i] = 1;
                }else{
                    selectedComMap[i] = -1;
                }
            };

            // gen real random graph
            var genedGraphNodes = [];
            var genedGraphLinks = [];
            var genedGraphInfos = {
                avail_com: selectedComMap,
                cominfo: []
            };
            var genedGraphNodesSgMap = {};
            for (var i = 0; i < max_com; i++) {
                // skip some com
                if ( selectedComMap[i] != 1 ) {
                    continue;
                };

                // random nodes
                for (var j = 0; j < comset_nodes[i].length; j++) {
                    var randomVal = parseInt( Math.random() * comset_nodes[i].length );
                    if ( (randomVal < (comset_nodes[i].length)/2) || j == comset_cominfo[i].maxdeg_id ) {
                        var curNodeIndex = genedGraphNodes.length;
                        genedGraphNodes.push({
                            "com": i,
                            "sg_index": comset_nodes[i][j].sg_index,
                            "index": curNodeIndex,
                            "weight":1,
                            "x": comset_nodes[i][j].x,
                            "y": comset_nodes[i][j].y
                        });
                        genedGraphNodesSgMap[ comset_nodes[i][j].sg_index ] = curNodeIndex;
                    }
                };
            }

            for (var i = 0; i < max_com; i++) {
                // random links
                for (var j = 0; j < comset_links[i].length; j++) {
                    var curSrc = genedGraphNodesSgMap[ comset_links[i][j].sg_source ];
                    var curTar = genedGraphNodesSgMap[ comset_links[i][j].sg_target ];
                    if( curSrc != undefined && curTar != undefined ){
                        genedGraphLinks.push({
                            sg_source: comset_links[i][j].sg_source,
                            sg_target: comset_links[i][j].sg_target,
                            source: curSrc,
                            target: curTar,
                            weight: 0.3
                        });
                    }
                }
            }

            var subGraphData = {nodes: genedGraphNodes, links: genedGraphLinks, info: genedGraphInfos}
            this.SaveObjAsJsonFile( subGraphData, "sub_graph_" + k.toString() + ".json" );
        };

    }

    this.SaveObjAsJsonFile = function(data, filename)
    {
        var str = JSON.stringify(data);
        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
        console.log( filename + " has been saved." );
    }

}

var CommonFuncUtility = new CommonFuncUtl();