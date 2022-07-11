/*
* @Author: Dawn
* @Date:   2017-04-15 19:37:00
* @Last Modified by:   Dawn
* @Last Modified time: 2017-04-20 11:25:31
*/
function UIFunc(){

    $( function() {

        var optionArr = new Array(
            "pattern_graph_1.json",
            "sub_graph_0.json",
            "graph.json",
            "sub_graph_1.json",
            "sub_graph_2.json",
            "sub_graph_3.json",
            "sub_graph_4.json",
            "sub_graph_5.json",
            "sub_graph_6.json",
            "sub_graph_7.json"
            );

        var optionStr = '';
        for (var i = 0; i < optionArr.length; i++) {
           optionStr += '<option value="' + optionArr[i]+ '">' + optionArr[i] + '</option>';
        }
        $("#option_loaddataname").html(optionStr);

        $( "#option_seqnum" ).selectmenu({
            width: 128
        });
        $( "#option_loaddataname" ).selectmenu({
            width: 168
        });

        $( "input" ).checkboxradio();

        function handleCheckbox(e){
            var target = $( e.target );
            if ( target.is( ".editmode" ) ) {
                var checked = target.is( ":checked" );
                if ( checked ) {
                    CommonDefine.addEditMode = true;
                }else{
                    CommonDefine.addEditMode = false;
                }
            }else if ( target.is( ".editlinkmode" ) ) {
                var checked = target.is( ":checked" );
                if ( checked ) {
                    CommonDefine.addEditLinkMode = true;
                }else{
                    CommonDefine.addEditLinkMode = false;
                }
            }else if ( target.is( ".editsellink" ) ) {
                var checked = target.is( ":checked" );
                if ( checked ) {
                    CommonDefine.addEditSelLink = true;
                }else{
                    CommonDefine.addEditSelLink = false;
                }
            }else if ( target.is( ".subgraphfixed" ) ) {
                var checked = target.is( ":checked" );
                if ( checked ) {
                    CommonDefine.subGraphNodeFixed = true;
                }else{
                    CommonDefine.subGraphNodeFixed = false;
                }
            }else if ( target.is( ".modulegraph" ) ) {
                var checked = target.is( ":checked" );
                if ( checked ) {
                    CommonDefine.moduleGraphMode = true;
                }else{
                    CommonDefine.moduleGraphMode = false;
                }
            }
        }

        $( ".checkboxmatch" ).on( "change", handleCheckbox );

        var handle_cir_range = $( "#range-cir-handle" );
        $( "#range-cir-slider" ).slider({
            create: function() {
                  handle_cir_range.text( $( this ).slider( "value" ) );
            },
            slide: function( event, ui ) {
                // 
                handle_cir_range.text( ui.value );

                // Change range circle
                GCommonFuncUtility.DoChangeRangeSize(ui.value);
            },
            value:30,
            min: 1,
            max: 256
        });

        var handle_cir_in_range = $( "#range-cir-in-handle" );
        $( "#range-cir-in-slider" ).slider({
            create: function() {
                  handle_cir_in_range.text( $( this ).slider( "value" ) );
            },
            slide: function( event, ui ) {
                // 
                handle_cir_in_range.text( ui.value );

                // Change range circle
                GCommonFuncUtility.DoChangeInsideRangeSize(ui.value);
            },
            value:0,
            min: 0,
            max: 256
        });

        var handle_sub_graph = $( "#subgraph-handle" );
        $( "#subgraph-slider" ).slider({
            create: function() {
                handle_sub_graph.text( $( this ).slider( "value" ) );
            },
            slide: function( event, ui ) {
                // 
                handle_sub_graph.text( ui.value );
                // Change range circle
                GCommonFuncUtility.DoLoadSubGraph(ui.value);
            },
            value:0,
            min: 0,
            max: (CommonDefine.maxSubGraphCnt-1)
        });
    });

    $("#but-edit-clear").click(function(){
        GCommonFuncUtility.DoClearEditSelection();
    });

    $("#but-edit-delete").click(function(){
        GCommonFuncUtility.DoDeleteSelectedNode();
    });

    $("#but-play-subgraph").click(function(){

        if ( CommonDefine.moduleGraphMode ) {
            GCommonFuncUtility.DoPlayModuleGraphAnimation();
        }else{
            GCommonFuncUtility.DoPlaySubGraphAnimation();
        };
    });
}