/*
* @Author: Dawn
* @Date:   2017-04-12 16:36:13
* @Last Modified by:   Dawn
* @Last Modified time: 2017-04-20 11:27:17
*/

    function menuFunc(msgName) {
        if ( msgName == "CommunityDetect" ) 
        {
            // 
            graphGentorMgr.doConnumityDetection();

            // msgMgr.pushMsg( "START_LOADING_ANIM" );
        } 
        else if ( msgName == "TemporalGraph" ) 
        {
            // msgMgr.pushMsg( "REMOVE_LOADING_ANIM" );

        }
        else if( msgName == "SaveGraph" )
        {
            graphGentorMgr.saveSuperGraph();
        }
        else if( msgName == "SaveGraphSeq" )
        {
            graphGentorMgr.saveTimeVaryingGraph();
        }
        else if ( msgName == "LoadGraph" ) 
        {
            graphGentorMgr.loadSuperGraph();
        }
        else if ( msgName == "LoadFixedGraph" ) 
        {
            graphGentorMgr.loadSuperGraphFixed();
        };
    }

