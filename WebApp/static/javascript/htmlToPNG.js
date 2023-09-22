var interval = null;
var parentGood = true;
var queue_id = -1;

function interval_timer() {
    $.ajax({
        type: "POST",
        url: "/htmlToPNG/polling",
        dataType: "json",
        data: { "id": queue_id }
    }).done(function(data, textStatus, jqXHR) {
        if(data == null) {
        } else if(data["status"] == "success") {
            $(".input-control").prop("disabled", false);
            var file_id = data["file_id"]
            var image_url ="/htmlToPNG/image/" + file_id;
            $("#image").attr("src", image_url );
            clearInterval(interval);
        } else if(data["status"] == "enqueue" && data["status"] == "dequeue")  {
            $("#image").attr("src", "/static/image/processing.gif");
            $(".input-control").prop("disabled", false);
            clearInterval(interval);
        } else if(data["status"] == "error")  {
            $("#image").attr("src", "/static/image/error.png");
            $(".input-control").prop("disabled", false);
            clearInterval(interval);
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
            $("#image").attr("src", "/static/image/error.png");
            $(".input-control").prop("disabled", false);
            clearInterval(interval);
    });
}

$(document).ready(function(){

    function isValidUrl(string) {
        try {
            new URL(string);
            if(string.startsWith("http")) {
                return true;
            }
            else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    $(".url-text").change(function() {
        if(isValidUrl($(this).val())) {
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $("#register-btn").prop("disabled", false);
        }
        else {
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $("#register-btn").prop("disabled", true);
        }
    });
    $(".url-text").keydown(function(event) {
        if(isValidUrl($(this).val())) {
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $("#register-btn").prop("disabled", false);
        }
        else {
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $("#register-btn").prop("disabled", true);
        }
        return true;
    });

    $("#cancel-btn").click(function(){
        $("#image").attr("src", "");
        $(".input-control").prop("disabled", !parentGood);
        clearInterval(interval_timer);
    });

    $("#register-btn").click(function(){
        $("#image").attr("src", "/static/image/processing.gif");
        $(".input-control").prop("disabled", true);

        $.ajax({
            type: "POST",
            url: "/htmlToPNG/register",
            data: {
                "target_url": $("#target_url").val(),
                "width": $("#width").val()
            },
            dataType: "json"
        }).done(function(data, textStatus, jqXHR) {
            if(data["status"] == "enqueue") {
                queue_id = data["id"] + 0;
                interval = setInterval(interval_timer, 2000);
            }
            else {
                $("#image").attr("src", "/static/image/error.png");
                $(".input-control").prop("disabled", false);
            }
        }).fail(function(jqXHR, textStatus, errorThrown){
                $("#image").attr("src", "/static/image/error.png");
                $(".input-control").prop("disabled", false);
        });
    });
});
