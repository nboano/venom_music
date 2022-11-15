<?php
    header("Content-Type: application/json");

    if(!isset($_GET["id"])) die("Specify ID");

    $id = $_GET["id"];

    $wp = file_get_contents("https://www.youtube.com/watch?" . http_build_query([
        'v' => $id,
        'gl' => 'US',
        'hl' => 'en',
        'has_verified' => 1,
        'bpctr' => 9999999999
    ]));

    preg_match('/ytcfg.set\(({.*?})\)/', $wp, $matches);

    $pr = json_decode($matches[1], true);

    $API_KEY = $pr["INNERTUBE_API_KEY"];
    $CLIENT_NAME = $pr["INNERTUBE_CONTEXT_CLIENT_NAME"];
    $VISITOR_ID = $pr["VISITOR_DATA"];
    $CLIENT_VERSION = $pr["INNERTUBE_CONTEXT_CLIENT_VERSION"];

    $options = array(
      'http'=>array(
        'method'=>'POST',
        'header'=> "Content-Type: application/json\r\nX-Goog-Visitor-Id: $VISITOR_ID\r\nX-Youtube-Client-Name: $CLIENT_NAME\r\nX-Youtube-Client-Version: $CLIENT_VERSION",
        'content'=> json_encode([
            "context" => [
                "client" => [
                    "clientName" => "ANDROID",
                    "clientVersion" => "16.20",
                    "hl" => "en"
                ]
            ],
            "videoId" => $id,
            "playbackContext" => [
                "contentPlaybackContext" => [
                    "html5Preference" => "HTML5_PREF_WANTS"
                ]
            ],
            "contentCheckOk" => true,
            "racyCheckOk" => true
        ]),
      )
    );
    $context = stream_context_create($options);
    $file = file_get_contents("https://www.youtube.com/youtubei/v1/player?key=$API_KEY", false, $context);
    $file = json_decode($file, true);

    if(!isset($_GET["itag"]))
        echo json_encode($file["streamingData"]["adaptiveFormats"]);
    else {
        foreach($file["streamingData"]["adaptiveFormats"] as $e) {
            if($e["itag"] == $_GET["itag"])
                echo json_encode($e);
        }
    }
?>