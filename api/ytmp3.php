<?php
        $url = "https://www.youtube.com/watch?v=" . $_GET["id"];
        $q = urlencode($url);

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'content' => "query=$q&vt=home"
            )
        );
        
        $context  = stream_context_create($opts);
        
        $result = file_get_contents("https://9convert.com/api/ajaxSearch/index", false, $context);
        $k = urlencode(json_decode($result, true)["links"]["mp3"]["mp3128"]["k"]);

        $id = explode("?v=", $url)[1];

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-Type: application/x-www-form-urlencoded',
                'content' => "vid=$id&k=$k"
            )
        );
        
        $context  = stream_context_create($opts);
        
        $result = file_get_contents("https://9convert.com/api/ajaxConvert/convert", false, $context);
		header("Access-Control-Allow-Origin: *");
		header("Content-Type: text/plain");
        echo json_decode($result, true)["dlink"];
?>